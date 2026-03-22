import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../contexts/userContext";
import { ThemeProvider } from "../contexts/ThemeContext";

import { initNotifications }  from "../lib/notifications"
import { useEffect } from "react";



// Root Layout to route all pages and wrap everything in User & Theme providers.
export default function RootLayout() {

  useEffect(() => {
    initNotifications();
  }, [])
  return (
    <UserProvider> 
      <ThemeProvider>
        <StatusBar hidden />
        <Slot /> 
      </ThemeProvider>
    </UserProvider>
  );
}

/*
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});







import * as Linking from 'expo-linking'
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

  useEffect(() => {
    const handleUrl = (event) => {
      const { queryParams } = Linking.parse(event.url);
      const { userId, secret } = queryParams;

      // Navigate to passRecovery screen with userId & secret
      if (userId && secret) {
        navigation.navigate('PassRecovery', { userId, secret });
      }
    };

    Linking.addEventListener('url', handleUrl);

    // Handle initial URL if app was closed
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => Linking.removeEventListener('url', handleUrl);
  }, [navigation]);
*/