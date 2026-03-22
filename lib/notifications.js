import * as Notifications from 'expo-notifications'

export const initNotifications = () => {
    Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
    });
}