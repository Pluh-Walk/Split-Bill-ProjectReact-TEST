<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExpenseController extends Controller
{
    public function store(Request $request, $billId)
    {
        $v = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'paid_by' => 'required',
            'split_type' => 'required|in:equal,custom',
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $bill = Bill::findOrFail($billId);

        $expense = Expense::create([
            'bill_id' => $bill->id,
            'name' => $request->name,
            'amount' => $request->amount,
            'paid_by' => $request->paid_by,
            'split_type' => $request->split_type,
            'splits' => $request->input('splits', null),
        ]);

        return response()->json(['expense'=>$expense]);
    }

    public function update(Request $request, $billId, $expenseId)
    {
        $expense = Expense::where('bill_id', $billId)->findOrFail($expenseId);
        
        $v = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0.01',
            'paid_by' => 'sometimes',
            'split_type' => 'sometimes|in:equal,custom',
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $expense->update($request->only(['name', 'amount', 'paid_by', 'split_type', 'splits']));
        return response()->json(['expense'=>$expense]);
    }

    public function destroy($billId, $expenseId)
    {
        $expense = Expense::where('bill_id', $billId)->findOrFail($expenseId);
        $expense->delete();
        return response()->json(['message'=>'Expense deleted successfully']);
    }
}
