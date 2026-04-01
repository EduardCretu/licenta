import { Pressable, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

import { useTheme } from '../contexts/ThemeContext'

// a pressable in the thematic of the application
const ThemedButton = ({style, primary, warning, ...props}) => {
    const { theme } = useTheme()
  return (
    <Pressable
        style={({pressed})=>[
            styles.btn,
            {backgroundColor: theme.buttonColor},
            primary && {backgroundColor: Colors.primary},
            warning && {backgroundColor: Colors.warning},
            pressed && styles.btnPressed,
            style
        ]}
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