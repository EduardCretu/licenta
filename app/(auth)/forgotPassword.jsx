import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { Link } from 'expo-router'

import { useState } from 'react'
import { useUser } from '../../hooks/useUser'

//Themed components
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'

import { Colors } from '../../constants/colors'


const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    const {passwordRecovery} = useUser()


    const handleSubmit = async () => {
        if (email === '') {
            alert('Please enter your email.');
            return;
        }

        try {
            await passwordRecovery(email);
            alert('Check your email for the password reset link.');
        } catch (error) {
            alert(error.message);
        }
    };



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView safe style={styles.container}>
            <Spacer/>
            <ThemedText title style={styles.title}>Forgot Password for an account</ThemedText>

            <ThemedTextInput 
            placeholder='Email' 
            style={styles.txtInput}
            keyboardType= "Email-address"
            autoCorrect={false} 
            autoComplete={'off'}
            onChangeText={setEmail}
            value={email}
            />

            <ThemedButton onPress={handleSubmit}> 
                <Text style={{color: '#f2f2f2'}}>Send Recovery Email</Text>
            </ThemedButton>

            <Spacer/>


            <Spacer height={100}/>

            <Link href='/login'>
                <ThemedText style={{ textAlign: "center" }}>
                    Remembered your password? Login instead
                </ThemedText>
            </Link>

        </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default ForgotPassword

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