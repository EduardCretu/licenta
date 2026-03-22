import { StyleSheet, View, Switch, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'

import { useTheme } from '../../contexts/ThemeContext'
import { useUser } from '../../hooks/useUser'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'

import { Colors } from '../../constants/colors'

// settings tab page tasked with handling account management
const Settings = () => {
  const { isDark, toggleTheme, theme } = useTheme()
  const { user, logout, deleteAccount } = useUser()


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.mainContainer}>
        <Spacer height={20}/>

        <ThemedText title style={styles.heading}>
          Settings
        </ThemedText>
        <Spacer />
    
        <ThemedText style={styles.heading}>App Theme</ThemedText>

        <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>

          <ThemedText style={styles.label}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </ThemedText>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? '#fff' : '#fff'}
            trackColor={{ false: '#767577', true: Colors.primary }}
          />
        </View>

        <ThemedText style={styles.heading}>Account Options</ThemedText>
        <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>
          <ThemedText style={styles.label}>
            Change Email
          </ThemedText>
          <TextInput
            style={{color: theme.text, width: 150}}
            placeholder={user.email}
            placeholderTextColor={theme.text}

          />
        </View>
        <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>
          <ThemedText style={styles.label}>
            Change Password
          </ThemedText>
          <TextInput
            style={{color: theme.text, width: 150}}
            placeholder="New Password..."
            placeholderTextColor={theme.text}

          />
        </View>
        <Spacer/>
        <View style={[styles.container, {backgroundColor: theme.uiBackground, paddingRight:5}]}>
          <ThemedText style={styles.label}>
            Account Termination
          </ThemedText>
          <ThemedButton style={{backgroundColor: Colors.warning, padding: 10}} onPress={deleteAccount}>
            <Text style={{color: 'white'}}>
              DELETE ACCOUNT
            </Text>
          </ThemedButton>
        </View>

        

        <ThemedButton onPress={logout}>
          <Text style={{color:'white'}}>
            Logout
          </Text>
        </ThemedButton>

      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Settings

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center'
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 8,
    width: '95%',
    borderRadius: 6,
    height: 50
  },
  label: {
    fontSize: 16,
  },
})