import React, { useEffect, useState, useCallback } from 'react';
import { axiosClient } from "@/utils/axios-client";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = useCallback(async (notificationId, link) => {
    try {
      await axiosClient.patch(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? {...n, pivot: {...n.pivot, read_at: new Date()}} : n
      ));
      setUnreadCount(prev => Math.max(prev - 1, 0));

      if (link) {
        const finalLink = link.startsWith('/') 
          ? `${window.location.origin}${link}`
          : link.startsWith('http') 
            ? link 
            : `http://${link}`;
        
        window.open(finalLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosClient.get('/notifications');
      setNotifications(response.data.notifications.data);
      setUnreadCount(response.data.unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-500 rounded-full flex justify-center items-center text-xs font-light text-gray-100">
          {unreadCount}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto"
             onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Notifications</h3>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-500 text-lg"
            >
              ×
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm">No notifications found</div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotificationClick(notification.id, notification.link);
                }}
                className={`p-2 text-sm border-b last:border-b-0 cursor-pointer ${
                  !notification.pivot.read_at ? 'bg-blue-50 font-medium' : 'text-gray-600'
                } hover:bg-gray-50 transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <span className={notification.link ? 'text-blue-600 hover:underline' : ''}>
                    {notification.content}
                  </span>
                  {!notification.pivot.read_at && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
          <div className="mt-2 text-xs text-gray-400">
            Showing {notifications.length} notifications ({unreadCount} unread)
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;