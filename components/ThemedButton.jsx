import { Pressable, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

const ThemedButton = ({style, ...props}) => {
  return (
    <Pressable
        style={({pressed})=>[styles.btn, pressed && styles.btnPressed, style]}
        {...props}
    />
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 5
    },
    btnPressed: {
        opacity: 0.8
    }
})