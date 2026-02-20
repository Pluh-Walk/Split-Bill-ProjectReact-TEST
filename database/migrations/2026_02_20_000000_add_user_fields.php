<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'nickname')) {
                $table->string('nickname')->unique()->nullable();
            }
            if (!Schema::hasColumn('users', 'user_type')) {
                $table->string('user_type')->default('standard')->index();
            }
            if (!Schema::hasColumn('users', 'is_guest')) {
                $table->boolean('is_guest')->default(false)->index();
            }
            if (!Schema::hasColumn('users', 'invitation_code')) {
                $table->string('invitation_code')->nullable()->index();
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'nickname')) {
                $table->dropColumn('nickname');
            }
            if (Schema::hasColumn('users', 'user_type')) {
                $table->dropColumn('user_type');
            }
            if (Schema::hasColumn('users', 'is_guest')) {
                $table->dropColumn('is_guest');
            }
            if (Schema::hasColumn('users', 'invitation_code')) {
                $table->dropColumn('invitation_code');
            }
        });
    }
};
