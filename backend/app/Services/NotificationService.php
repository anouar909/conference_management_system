<?php

namespace app\Services;

use app\Models\Notification;
use app\Models\User;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    // Create global notification for all users
    public function createGlobalNotification(string $content)
    {
        $notification = Notification::create([
            'type' => 'global',
            'content' => $content,
            'expires_at' => now()->addDays(7)
        ]);

        $this->attachToAllUsers($notification);
    }

    // Create notification for specific user
    public function createUserNotification(User $user, string $content)
    {
        $notification = Notification::create([
            'type' => 'user',
            'content' => $content
        ]);

        $notification->users()->attach($user->id);
    }

    // Helper method for mass attaching users
    private function attachToAllUsers(Notification $notification)
    {
        User::chunk(200, function ($users) use ($notification) {
            $relations = $users->map(fn ($user) => [
                'user_id' => $user->id,
                'notification_id' => $notification->id
            ]);
            
            DB::table('notification_user')->insert($relations->toArray());
        });
    }
}