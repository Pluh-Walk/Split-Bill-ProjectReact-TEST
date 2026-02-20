<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = ['bill_id','name','amount','paid_by','split_type','splits'];

    protected $casts = [
        'amount' => 'decimal:2',
        'splits' => 'array',
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    public function payer()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }
}
