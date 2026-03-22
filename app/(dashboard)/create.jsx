import { StyleSheet, Button } from 'react-native'
import { useState } from 'react'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications'

import { initNotifications } from "../../lib/notifications.js"

// async function to request system permissions for push notifications
async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications not granted!');
    return false;
  }
  return true;
}


// create tab page tasked with handling creating and editing information and reminders.
const Create = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // test function to see if everything is mint
  async function scheduleTestNotification() {
    // Ensure a channel exists for Android
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
      });

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: 'Change sides!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 20,
      },
    });
  }

  async function handlePress() {
    const granted = await requestPermissions();
    if (!granted) return;
    scheduleTestNotification();
  }
  return (
    <ThemedView safe style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        Add a Reminder
      </ThemedText>

      <Button
        title="Schedule 5 min notification"
        onPress={handlePress}
      />
      <Spacer />

    </ThemedView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})