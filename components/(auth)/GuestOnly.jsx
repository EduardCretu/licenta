import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

import ThemedLoader from '../ThemedLoader'

// function which handles the logic of checking if the user 
// is authentificated and redirecting to 'profile' page if true
const GuestOnly = ({ children }) => {
    const { user, authChecked } = useUser()
    const router = useRouter()
    
    // on first render and every time 'user' and 'authChecked' change, run check and redirect if needed
    useEffect(() => {
        if (authChecked && user !== null) {
            router.replace("/profile")
        }
    }, [user, authChecked])

    // render loading icon while fetching is done
    if (!authChecked || user) {
        return (
            <ThemedLoader/>
        )
    }
    // aka the rest of the pages
    return children
}

export default GuestOnly