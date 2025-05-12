import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Bell, Book } from 'lucide-react';

function OrderNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('https://localhost:7086/chat-hub')
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveOrderNotification', (notification) => {
      setNotifications(prev => [{
        ...notification,
        id: Date.now() // Add unique id for React keys
      }, ...prev].slice(0, 5)); 
    });

    connection.start()
      .catch(err => console.error('Error connecting to SignalR:', err));

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white shadow-xl rounded-xl p-4 w-80 border-l-4 border-blue-400 animate-slide-in"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Bell size={18} className="text-blue-500" />
            <span className="font-semibold text-gray-800">
              {notification.userName} - Order Completed Successfully
            </span>
          </div>

          {/* Book items */}
          <ul className="space-y-1 text-sm text-gray-700 pl-1">
            {notification.items.map((item, index) => (
              <li key={index} className="flex items-center gap-1">
                📗 <span>{item.quantity} × {item.bookTitle}</span>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="mt-3 text-right">
            <span className="text-xs text-gray-400">
              {new Date(notification.orderDate).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>

  );
}

export default OrderNotifications;
