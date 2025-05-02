<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Notification extends Model
{
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('read_at')
            ->withTimestamps();
    }

    protected $fillable = [
        'type', 'content', 'link', 'related_entity_id', 'expires_at'
    ];
}