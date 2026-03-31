// context-hook imports
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
// custom loader
import ThemedLoader from '../ThemedLoader'

// function which handles the logic of checking if the user 
// is authentificated and redirecting to 'login' page if not
const UserOnly = ({children}) => {
    const { user, authChecked } = useUser()
    const router = useRouter()

    // on first render and every time 'user' and 'authChecked' change, run check and redirect if needed
    useEffect(() => {
        if (authChecked && user === null) {
            router.replace('/login')
        }
    }, [user, authChecked])

    // render loading icon while fetching is done
    if (!authChecked || !user) {
        return (
            <ThemedLoader/>
        )
    }
    // aka the rest of the pages
    return children
}

export default UserOnly