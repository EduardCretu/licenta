import { createContext, useEffect, useState, useContext } from "react";
import { account } from "../lib/appwrite";
import { ID } from "react-native-appwrite";

// importing medInfoContext to create a DB row on account registration
import { useMedInfo } from "./MedInfoContext";

// creating the context
export const UserContext = createContext();

// the provider
export function UserProvider({ children }) {
    // state consts && deconstructed use medinfo
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const { ensureMedInfo } = useMedInfo();

    // function to update user's email
    async function updateUserEmail(newEmail, currentPassword) {
        try {
            await account.updateEmail({
                email: newEmail,
                password: currentPassword,
            });
            // reload user information for consistency
            const response = await account.get();
            setUser(response);
        } catch (error) {
            throw Error(error.message);
        }
    }
    // function to update user's password
    async function updateUserPassword(currentPassword, newPassword) {
        try {
            await account.updatePassword({
                password: newPassword,
                oldPassword: currentPassword,
            });
            / reload user information for consistency
            const response = await account.get();
            setUser(response);
        } catch (error) {
            throw Error(error.message);
        }
    }

    // function to log in user
    async function login(email, password) {
        try {
            await account.createEmailPasswordSession({
                email: email,
                password: password,
            });
            const response = await account.get();
            await ensureMedInfo(response.$id);
            setUser(response);
        } catch (error) {
            throw Error(error.message);
        }
    }

    // function to register user. calls login upon successful registration
    async function register(email, password) {
        try {
            await account.create({
                userId: ID.unique(),
                email: email,
                password: password,
            });
            await login(email, password);
        } catch (error) {
            throw Error(error.message);
        }
    }

    // second parter to the passwordRecover function. Deprecated
    async function updateRecovery({ userId, secret, password, passwordAgain }) {
        try {
            await account.updateRecovery({
                userId,
                secret,
                password,
                passwordAgain,
            });
        } catch (error) {
            throw Error(error.message);
        }
    }

    // first parter password recovery function.
    // sends an automated email to user's inputted email with a url and secret,
    // which would then be, theoretically, intercepted by the app and pulled back into it
    async function passwordRecovery(email) {
        try {
            await account.createRecovery({
                email: email,
                url: "https://example.com",
            });
        } catch (error) {
            throw Error(error.message);
        }
    }

    // little function to log user out by ending session
    async function logout() {
        await account.deleteSession({ sessionId: "current" });
        setUser(null);
    }

    // function to delete user account
    // gets endpoints from .env and sends delete request
    async function deleteAccount() {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/account`,
                {
                    method: "DELETE",
                    headers: {
                        "X-Appwrite-Project":
                            process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to delete account");
            }

            setUser(null);
        } catch (error) {
            throw Error(error.message);
        }
    }

    // function to get user value, called on first render
    async function getInitialUserValue() {
        try {
            const response = await account.get();
            setUser(response);
        } catch (error) {
            setUser(null);
        } finally {
            setAuthChecked(true);
        }
    }

    useEffect(() => {
        getInitialUserValue();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                deleteAccount,
                passwordRecovery,
                updateRecovery,
                authChecked,
                updateUserEmail,
                updateUserPassword,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);