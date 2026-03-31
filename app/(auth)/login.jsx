import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Link } from 'expo-router'
// Context-hook related imports
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
//Themed components
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
// color related imports
import { Colors } from '../../constants/colors'

// Main function of the Login pages handling logic and rendering of components
const Login = () => {
    // Auth and error handling related consts
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    // Consuming context
    const { login } = useUser()

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
                <ThemedText title style={styles.title}>Login to your account</ThemedText>

                <ThemedTextInput
                    placeholder='Email'
                    style={styles.txtInput}
                    keyboardType= "Email-address"
                    autoCorrect={false}
                    autoComplete={'off'}
                    onChangeText={setEmail}
                    value={email}
                />

                <ThemedTextInput
                    placeholder='Password'
                    style={[styles.txtInput,{marginBottom:10}]}
                    keyboardType= "password"
                    autoCorrect={false}
                    autoComplete={'off'}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
                <Link href='/forgotPassword'>
                    <ThemedText style={{ textAlign: "center" }}>
                        Forgot your password?
                    </ThemedText>
                </Link>
                <Spacer/>


                <ThemedButton onPress={submitHandler}>
                    <Text style={{color: '#f2f2f2'}}>Login</Text>
                </ThemedButton>

                <Spacer/>

                {error && <Text style={styles.error}>{error}</Text>}


                <Spacer height={100}/>

                {/* rerouting to /login when pressed */}
                <Link href='/register'>
                    <ThemedText style={{ textAlign: "center" }}>
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