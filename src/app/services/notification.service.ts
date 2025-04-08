import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private router: Router) {
    this.initializeListeners();
  }

  async requestPermission(): Promise<boolean> {
    const permission = await LocalNotifications.requestPermissions();
    return permission.receive === 'granted';
  }

  async scheduleSleepinessReminder(): Promise<void> {
    const permissionGranted = await this.requestPermission();
    if (!permissionGranted) {
      console.warn('Notification permission not granted.');
      return;
    }
    const triggerTime = new Date(Date.now() + 60 * 60 * 1000);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Sleepiness Reminder',
          body: "Don't forget to log your sleepiness!",
          schedule: { at: triggerTime },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: { navigateTo: 'sleepiness' }
        }
      ]
    });
  }

  private initializeListeners(): void {
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      if (notification.notification.extra && notification.notification.extra.navigateTo === 'sleepiness') {
        this.router.navigate(['/add-sleepiness']);
      }
    });
  }
}
