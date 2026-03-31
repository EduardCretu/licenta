
import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useUser } from '../../contexts/UserContext'


/*
* Fully deprecated.
* I don't even thing I ever got the chance to actually render the page
*/

export default function PassRecovery({ route, navigation }) {
    const { userId, secret } = route.params;
    const { updateRecovery } = useUser();

    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');

    return (
        <View>
            <TextInput
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={passwordAgain}
                onChangeText={setPasswordAgain}
            />
            <Button
                title="Reset Password"
                onPress={async () => {
                    try {
                        await updateRecovery({ userId, secret, password, passwordAgain });
                        alert('Password updated! You can now login.');
                        navigation.navigate('Login');
                    } catch (e) {
                        alert(e.message);
                    }
                }}
            />
        </View>
    );
}
