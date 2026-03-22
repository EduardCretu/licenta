
import { useState, useContext } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useUser } from '../../hooks/useUser';


/// SUBJECT TO CHANGE



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
