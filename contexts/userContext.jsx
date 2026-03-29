import { createContext, useEffect, useState } from "react"
import { account } from "../lib/appwrite"
import { ID } from "react-native-appwrite"

import { useMedInfo } from './medInfoContext'



export const UserContext = createContext()

export function UserProvider({ children }) {

  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const { ensureMedInfo } = useMedInfo()

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession({email: email,password: password})
      const response = await account.get()
      await ensureMedInfo(response.$id)
      setUser(response)
    }
    catch (error) {
      throw Error (error.message)
    }
  }

  async function register(email, password) {
    try {
      await account.create({userId: ID.unique(),email: email,password: password})
      await login(email, password)
    }
    catch (error) {
      throw Error (error.message)
    }
  }


  async function updateRecovery({ userId, secret, password, passwordAgain }) {
  try {
    await account.updateRecovery({
      userId,
      secret,
      password,
      passwordAgain
    });
    // Optionally you can set user state here if you want auto-login
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function logout() {
    await account.deleteSession({sessionId:"current"})
    setUser(null)
  }

  async function deleteAccount() {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/account`, {
        method: "DELETE",
        headers: {
          "X-Appwrite-Project": process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete account");
      }

      setUser(null);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get()
      setUser(response)
    }
    catch (error) {
      setUser(null)
    }
    finally {
      setAuthChecked(true)
    }
  }

  useEffect(()=>{
    getInitialUserValue()
  },[])


  return (
    <UserContext.Provider value={{ 
      user, login, logout, register, deleteAccount, updateRecovery, authChecked
    }}>
      {children}
    </UserContext.Provider>
  );
}