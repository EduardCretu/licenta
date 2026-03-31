import { useEffect } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
// context-hook imports
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { MedInfoProvider } from "../contexts/MedInfoContext";
// notification related imports
import { initNotifications }  from "../lib/notifications"
// the little tray of buttons at the bottom of the screen
import * as NavigationBar from 'expo-navigation-bar'


// Root Layout to route all pages and wrap everything in User & Theme providers.
export default function RootLayout() {
    const visibility = NavigationBar.useVisibility();
    // on first render initialise the notifications
    useEffect(() => {
    initNotifications();
    }, [])
    // return the wrap and render the children (including those in folders. Looking at you <Stack/>)
    return (
        <MedInfoProvider>
            <UserProvider>
                <ThemeProvider>
                    <StatusBar hidden />
                    <Slot />
                </ThemeProvider>
            </UserProvider>
        </MedInfoProvider>
    );
}