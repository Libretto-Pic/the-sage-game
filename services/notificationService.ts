const notificationService = {
  isSupported: (): boolean => 'Notification' in window,

  getPermissionStatus: (): NotificationPermission | 'unsupported' => {
    if (!notificationService.isSupported()) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  requestPermission: async (): Promise<NotificationPermission> => {
    const status = notificationService.getPermissionStatus();
    if (status === 'unsupported' || status === 'granted' || status === 'denied') {
      return status as NotificationPermission;
    }
    // If status is 'default', request permission
    return await Notification.requestPermission();
  },

  sendMissionReadyNotification: (missionCount: number): void => {
    if (notificationService.getPermissionStatus() === 'granted') {
      const title = "Your Daily Trials Await";
      // FIX: The 'vibrate' property does not exist on the NotificationOptions type in this environment, causing a build error.
      const options: NotificationOptions = {
        body: `The Sage has prepared ${missionCount} new missions for you. Begin your journey for today!`,
        // You can add an icon URL here if you have one hosted
        // icon: '/sage-icon.png',
      };
      
      // Use the service worker if available for more robust notifications,
      // otherwise fallback to a standard notification.
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, options);
        }).catch(() => new Notification(title, options)); // Fallback
      } else {
        new Notification(title, options);
      }
    }
  },
};

export { notificationService };