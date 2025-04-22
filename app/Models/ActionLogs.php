<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionLogs extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'user_id',
        'target_id',
        'metadata',
    ];

    public function user_info()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
