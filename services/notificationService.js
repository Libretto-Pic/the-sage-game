
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
    return await Notification.requestPermission();
  },

  sendMissionReadyNotification: (missionCount: number): void => {
    if (notificationService.getPermissionStatus() === 'granted') {
      const title = "Your Daily Trials Await";
      const options = {
        body: `The Sage has prepared ${missionCount} new missions for you. Begin your journey for today!`,
      };
      
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, options);
        }).catch(() => new Notification(title, options));
      } else {
        new Notification(title, options);
      }
    }
  },
};

export { notificationService };
