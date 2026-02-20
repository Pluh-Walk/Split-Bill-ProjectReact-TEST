<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained('bills')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->foreignId('paid_by')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('split_type', ['equal','custom'])->default('equal');
            $table->json('splits')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('expenses');
    }
};
