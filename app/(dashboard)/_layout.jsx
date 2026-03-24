import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import UserOnly from '../../components/(auth)/UserOnly'
import { useTheme } from '../../contexts/ThemeContext'

// Layout of the Dashboard & Dashboard pages
const DashboardLayout = () => {
  // calling theme from context to paint dashboard elements in appropriate theme
  const { theme } = useTheme()

  return (
    <UserOnly> 
      <Tabs // General Tabs settings
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop: 10,
            height: 100,
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
        }}>
        <Tabs.Screen // 'Tab; connected to specific /dashboard page
          name="reminders"
          options={{
            title: 'Reminders',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={focused ? 28 : 24}
                color={focused ? theme.iconColorFocused : theme.iconColor}
                name={focused ? 'calendar-number' : 'calendar-number-outline'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: 'Create & Edit',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={focused ? 32 : 28}
                color={focused ? theme.iconColorFocused : theme.iconColor}
                name={focused ? 'create' : 'create-outline'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Me',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={focused ? 28 : 24}
                color={focused ? theme.iconColorFocused : theme.iconColor}
                name={focused ? 'person' : 'person-outline'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={focused ? 28 : 24}
                color={focused ? theme.iconColorFocused : theme.iconColor}
                name={focused ? 'settings' : 'settings-outline'}
              />
            ),
          }}
        />
      </Tabs>
    </UserOnly>
  );
};

export default DashboardLayout;
