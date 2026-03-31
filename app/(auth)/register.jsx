import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { Link } from 'expo-router'
// context-hook imports
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
//Themed components
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
// color relate imports
import { Colors } from '../../constants/colors'

// auth page to register the user to appwrite auth
// May change this to a local hash function to rid myself of the appwrite parasite
const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { register } = useUser()
    const { createMedInfo } = useMedInfo()

    // function that uses and calls appwrite 'register' function from their auth API
    const submitHandler = async () =>{
        setError(null)
        try {
            await register(email, password)
        }
        catch (error) {
            setError(error.message)
        }
    }
    
    // <- Wraps whole page in a listener which dismisses the keyboard on pressing elsewhere
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView safe style={styles.container}>
                <Spacer/>
                <ThemedText title style={styles.title}>Register for an account</ThemedText>
                {/* vv-- email input field. May change to username*/}
                <ThemedTextInput
                    placeholder='Email'
                    style={styles.txtInput}
                    keyboardType= "Email-address"
                    autoCorrect={false}
                    autoComplete={'off'}
                    onChangeText={setEmail}
                    value={email}
                />
                {/* vv-- password input field */}
                <ThemedTextInput
                    placeholder='Password'
                    style={styles.txtInput}
                    keyboardType= "password"
                    autoCorrect={false}
                    autoComplete={'off'}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />


                <ThemedButton onPress={submitHandler}>
                    <Text style={{color: '#f2f2f2'}}>Register</Text>
                </ThemedButton>

                <Spacer/>

                {error && <Text style={styles.error}>{error}</Text>}

                <Spacer height={100}/>

                {/* rerouting to /login when pressed */}
                <Link href='/login'>
                    <ThemedText style={{ textAlign: "center" }}>
                        Have an account already? Login instead
                    </ThemedText>
                </Link>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default Register

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