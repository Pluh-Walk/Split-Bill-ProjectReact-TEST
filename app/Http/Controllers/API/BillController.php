<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillUser;
use App\Models\Invitation;
use App\Models\GuestAccessWindow;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BillController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $archived = $request->query('archived', false);
        
        $bills = Bill::where('host_id', $user->id)
            ->orWhereHas('participants', function($q) use ($user) {
                $q->where('user_id', $user->id)->where('accepted', true);
            })
            ->where('archived', $archived)
            ->with(['host', 'participants.user'])
            ->get();

        return response()->json(['bills'=>$bills]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check user type and enforce limits
        if ($user->user_type === 'standard') {
            // Count bills created this month
            $billsThisMonth = Bill::where('host_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
            
            if ($billsThisMonth >= 5) {
                return response()->json([
                    'message' => 'Standard users can only create 5 bills per month. Upgrade to Premium for unlimited bills.'
                ], 403);
            }
        }

        // Check participant limit for standard users
        $participants = $request->input('participants', []);
        if ($user->user_type === 'standard' && count($participants) > 3) {
            return response()->json([
                'message' => 'Standard users can only add up to 3 persons per bill. Upgrade to Premium for more participants.'
            ], 403);
        }

        $v = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'participants' => 'array',
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $code = strtoupper(Str::random(8));
        $bill = Bill::create([
            'host_id' => $request->user()->id,
            'code' => $code,
            'name' => $request->name,
        ]);

        // add participants if provided
        $participants = $request->input('participants', []);
        foreach ($participants as $p) {
            if (!empty($p['email']) && empty($p['user_id'])) {
                // guest
                BillUser::create(['bill_id'=>$bill->id,'guest_name'=>$p['name'] ?? null,'guest_email'=>$p['email'],'accepted'=>true]);
            } elseif (!empty($p['user_id'])) {
                BillUser::create(['bill_id'=>$bill->id,'user_id'=>$p['user_id'],'accepted'=>true]);
            }
        }

        return response()->json(['bill'=>$bill]);
    }

    public function show(Request $request, $id)
    {
        $bill = Bill::with([
            'host',
            'participants.user',
            'expenses.payer'
        ])->findOrFail($id);
        return response()->json(['bill'=>$bill]);
    }

    public function update(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        
        $v = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $bill->update($request->only(['name']));
        return response()->json(['bill'=>$bill]);
    }

    public function destroy(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        $bill->expenses()->delete();
        $bill->participants()->delete();
        $bill->delete();
        return response()->json(['message'=>'Bill deleted successfully']);
    }

    public function regenerateCode(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        $bill->code = strtoupper(Str::random(8));
        $bill->save();
        return response()->json(['bill'=>$bill]);
    }

    public function viewByCode(Request $request, $code)
    {
        $bill = Bill::with(['participants','expenses'])->where('code', $code)->firstOrFail();

        // If the request is authenticated, allow full access
        if ($request->user()) {
            return response()->json(['bill'=>$bill]);
        }

        // Determine guest identifier: prefer provided email, fallback to IP
        $guestIdentifier = $request->query('email') ?: $request->ip();
        $today = Carbon::now()->toDateString();

        $window = GuestAccessWindow::where('bill_id', $bill->id)
            ->where('guest_identifier', $guestIdentifier)
            ->where('date', $today)
            ->first();

        if ($window) {
            if ($window->window_expires && Carbon::now()->lessThanOrEqualTo($window->window_expires)) {
                // still within today's window
                return response()->json(['bill'=>$bill]);
            }

            // window exists but expired — deny access
            return response()->json(['message' => 'Guest access window expired for today (6 hours limit reached).'], 403);
        }

        // No window for today yet — create one for 6 hours from now
        $start = Carbon::now();
        $expires = Carbon::now()->addHours(6);

        GuestAccessWindow::create([
            'bill_id' => $bill->id,
            'guest_identifier' => $guestIdentifier,
            'date' => $today,
            'window_start' => $start,
            'window_expires' => $expires,
        ]);

        return response()->json(['bill'=>$bill]);
    }

    public function archive(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        $bill->archived = true;
        $bill->save();
        return response()->json(['bill'=>$bill]);
    }

    public function unarchive(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        $bill->archived = false;
        $bill->save();
        return response()->json(['bill'=>$bill]);
    }

    public function addParticipantByCode(Request $request, $code)
    {
        $inv = Invitation::where('code', $code)->firstOrFail();
        $user = $request->user();

        // link invitation if necessary
        $inv->invitee_user_id = $user->id;
        $inv->used_at = now();
        $inv->save();

        // attach to bill if invitation was for bill
        $bill = Bill::where('code', $code)->first();
        if ($bill) {
            BillUser::create(['bill_id'=>$bill->id,'user_id'=>$user->id,'accepted'=>true]);
            return response()->json(['message'=>'Added to bill','bill'=>$bill]);
        }

        return response()->json(['message'=>'Invitation accepted','invitation'=>$inv]);
    }

    public function addParticipant(Request $request, $billId)
    {
        $bill = Bill::findOrFail($billId);
        
        $v = Validator::make($request->all(), [
            'type' => 'required|in:guest,registered',
            'guest_name' => 'required_if:type,guest|string|max:255',
            'guest_email' => 'required_if:type,guest|email',
            'user_id' => 'required_if:type,registered|exists:users,id',
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        if ($request->type === 'guest') {
            $participant = BillUser::create([
                'bill_id' => $bill->id,
                'guest_name' => $request->guest_name,
                'guest_email' => $request->guest_email,
                'accepted' => true,
            ]);
        } else {
            $participant = BillUser::create([
                'bill_id' => $bill->id,
                'user_id' => $request->user_id,
                'accepted' => true,
            ]);
        }

        return response()->json(['participant'=>$participant]);
    }

    public function removeParticipant(Request $request, $billId, $participantId)
    {
        $participant = BillUser::where('bill_id', $billId)->findOrFail($participantId);
        $participant->delete();
        return response()->json(['message'=>'Participant removed']);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->query('q', '');
        $users = User::where('email', 'like', "%{$query}%")
            ->orWhere('username', 'like', "%{$query}%")
            ->orWhere('nickname', 'like', "%{$query}%")
            ->limit(10)
            ->get();
        
        return response()->json(['users'=>$users]);
    }
}
