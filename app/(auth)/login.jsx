import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, View, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
// Context-hook related imports
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useTheme } from '../../contexts/ThemeContext'
//Themed components
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedSecuredTextInput from '../../components/ThemedSecuredTextInput'
// color related imports
import { Colors } from '../../constants/colors'

// Main function of the Login pages handling logic and rendering of components
const Login = () => {
    // Auth and error handling related consts
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [secured, setSecured] = useState(true)
    // Consuming context
    const { login } = useUser()
    const { theme } = useTheme()

    // little function which tries to login in user based on email and password
    const submitHandler = async () => {
        setError(null)
        try {
        await login(email, password)
        } 
        catch (error) {
            console.log(error.message)
            setError(error.message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView safe style={styles.container}>
                <Spacer/>
                <ThemedText title style={styles.title}>Log in to your account</ThemedText>

                <ThemedTextInput
                    placeholder='Email'
                    style={styles.txtInput}
                    keyboardType= "Email-address"
                    autoCorrect={false}
                    autoComplete={'off'}
                    onChangeText={setEmail}
                    value={email}
                />
                <ThemedSecuredTextInput
                    placeholder='Password'
                    styleView={{marginBottom:10}}
                    onChangeText={setPassword}
                    value={password}
                />

                <Link
                    style={{borderBottomWidth: 0.8, borderColor: theme.text}}
                    href='/forgotPassword'
                >
                    <ThemedText style={{ textAlign: "center" }}>
                        Forgot your password?
                    </ThemedText>
                </Link>
                <Spacer/>


                <ThemedButton
                    primary
                    style={{width: '40%'}}
                    onPress={submitHandler}
                >
                    <Text style={{color: '#f2f2f2', textAlign: 'center'}}>Login</Text>
                </ThemedButton>

                <Spacer/>

                {error && <Text style={styles.error}>{error}</Text>}


                <Spacer height={100}/>

                {/* rerouting to /login when pressed */}
                <Link
                    style={{borderBottomWidth: 0.6, borderColor: theme.text}}
                    href='/register'
                >
                    <ThemedText style={{ textAlign: "center"}}>
                        Dont have an account? register instead
                    </ThemedText>
                </Link>
                <Spacer/>


            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 30
    },
    txtInput: {
        width: '90%',
        marginBottom: 20
    },
    error: {
        color: Colors.warning,
        padding: 10,
        backgroundColor: "#e2b3b3ff",
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 6,
        width:"95%"
    }
})