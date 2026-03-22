import { StyleSheet, Text, View } from 'react-native'

// custom component imports
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedHr from '../../components/ThemedHr'
import UserDataLine from '../../components/UserDataLine'

// state, hooks and context imports
import { useUser } from '../../hooks/useUser'
import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigation } from 'expo-router'

// Profile tab page handling displaying user info
const Profile = () => {
  const [editInfo, setEditInfo] = useState(false)

  const { user } = useUser()
  const { theme } = useTheme()
  const nav = useNavigation()

  // func rerouting to 'create' page
  const handleEdit = () => {
    setEditInfo(!editInfo)
    nav.navigate('create')
  }

  return (
    <ThemedView safe style={styles.container}>
      <Spacer/>

      <View style={[styles.usernameSection, {flexDirection:'row'}]}>
        <ThemedLogo style={styles.avatar}/>
        <ThemedText title={true} style={styles.heading}>
          {user.email}
        </ThemedText>
      </View>

      <ThemedHr/>

      <Spacer/>

      <View style={[styles.section,{backgroundColor:theme.navBackground}]}>
        <ThemedText title style={{fontWeight:'bold',fontSize:20}}>
          User Information
        </ThemedText>
        <Spacer height={20}/>

        {/*vvvvvvvvv To be automated and tied to user-info db/json */}
        <UserDataLine title={"Full name"} userData={"placeholder name"}/>
        <UserDataLine title={"Date of Birth"} userData={"placeholder date"}/>
        <UserDataLine title={"Address"} userData={"placeholder address"}/>
        <Spacer/>
        <UserDataLine title={"Blood Type"} userData={"placeholder blood"}/>
        <UserDataLine title={"Rh level"} userData={"placeholder Rh"}/>
        <UserDataLine title={"Genetic Conditions"} userData={"placeholder cond"}/>
        <Spacer/>
        <UserDataLine title={"Chronic Illness"} userData={"placeholder ill"}/>
        <UserDataLine title={"Recent Screening"} userData={"placeholder date"}/>
        <UserDataLine title={"allergies"} userData={"placeholder allerg"}/>
        
      </View>

      <Spacer />
      
      {/* Button to 'handle the editing of user info */}
      <ThemedButton onPress={handleEdit}> 
        <Text style={{color:'white',textAlign:'center'}}>Edit health information?</Text>
      </ThemedButton>

      


    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  avatar: {
    width: 50, 
    height : 50,
    borderRadius:10000,
    marginRight: 10
  },
  usernameSection: {
    alignItems: 'center',
    textAlign: 'center',
    width: '85%',
    marginBottom: 20,
  },
  section: {
    alignItems: 'center',
    textAlign: 'center',
    width: '85%',
    padding: 20,
    borderRadius: 6
  }
})