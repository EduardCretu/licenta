import { StyleSheet, View } from 'react-native'
import ThemedText from './ThemedText'


const UserDataLine = ({style,title,userData}) => {
  return (
    <View style={[styles.section,{style},style]}>
          <ThemedText style={{width:120}}>
            {title}:
          </ThemedText>
          <ThemedText>
            {userData}
          </ThemedText>
    </View>
  )
}

export default UserDataLine

const styles = StyleSheet.create({
    section: {
        flexDirection:'row',
        width:'100%',
    },
})