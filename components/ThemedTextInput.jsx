import { useColorScheme, TextInput } from 'react-native'
import { Colors } from '../constants/colors'

import { useTheme } from '../contexts/ThemeContext'


const ThemedTextInput = ({style, ...props}) => {
    const { theme } = useTheme()
  return (
    <TextInput
        style={[
            {
                backgroundColor: theme.uiBackground,
                color: theme.text,
                padding: 20,
                borderRadius: 6
            },
            style
        ]} 
        placeholderTextColor = {theme.text}
        {...props}
    />
  )
}

export default ThemedTextInput

