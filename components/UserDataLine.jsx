import { StyleSheet, View } from 'react-native'
import ThemedText from './ThemedText'

// a simple component to avoid redundancy in /profile.jsx. 
// Displays two data strings side by side
const UserDataLine = ({style,title,userData}) => {
  return (
    <View style={[styles.section,{style},style]}>
          <ThemedText style={{width: '50%', fontSize: 16}}>
            {title}:
          </ThemedText>
          <ThemedText style={{width: '45%', fontSize: 16}}>
            {(userData === '') ? '-' : userData}
          </ThemedText>
    </View>
  )
}

export default UserDataLine

const styles = StyleSheet.create({
    section: {
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
    },
})