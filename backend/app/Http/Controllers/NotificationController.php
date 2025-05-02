<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;


class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return [
            'unread' => $request->user()->notifications()
                ->wherePivotNull('read_at')
                ->count(),
            'notifications' => $request->user()->notifications()
                ->orderByPivot('created_at', 'desc')
                ->paginate(10)
        ];
    }




    public function markAsRead(Request $request, Notification $notification)
    {
        $request->user()->notifications()
            ->updateExistingPivot($notification->id, [
                'read_at' => now()
            ]);
    
        return response()->noContent();
    }

    
}