<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestAccessWindow extends Model
{
    use HasFactory;

    protected $fillable = ['bill_id','guest_identifier','date','window_start','window_expires'];

    protected $dates = ['date','window_start','window_expires'];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
