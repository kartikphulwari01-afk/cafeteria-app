import { useEffect, useState } from 'react';
import { useToastStore } from '@/store/toastStore';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { addToast } = useToastStore();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      addToast('Browser does not support notifications', 'warn');
      return false;
    }
    
    if (permission === 'granted') return true;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        addToast('Notifications enabled!', 'success');
        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    return false;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        ...options,
      });
    }
  };

  return { permission, requestPermission, sendNotification };
};
