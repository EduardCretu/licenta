import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GuestOnly from "../../components/(auth)/GuestOnly";

// Layout of auth related pages
export default function AuthLayout() {
    //Guest only reroutes a logged in user to dashboard
    return(
        <GuestOnly>
            <StatusBar value="auto"/>
            <Stack
                screenOptions={{headerShown: false, animation:'none'}}
            />
        </GuestOnly>
    )
}