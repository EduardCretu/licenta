import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import UserOnly from '../../components/(auth)/UserOnly'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from "react-i18next"

// Layout of the Dashboard & Dashboard pages
const DashboardLayout = () => {
    // calling theme from context to paint dashboard elements in appropriate theme
    const { theme } = useTheme()
    const { t } = useTranslation()

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
                }}
            >
                <Tabs.Screen // 'Tab; connected to specific /dashboard page
                    name="reminders"
                    options={{
                        title: t("dashboard.reminders"),
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
                        title: t("dashboard.create"),
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
                        title: t("dashboard.profile"),
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
                        title: t("dashboard.settings"),
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
