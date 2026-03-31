import { TextInput } from 'react-native'
import {useState} from 'react'
import { Colors } from '../constants/colors'

import { useTheme } from '../contexts/ThemeContext'

// themed text input
const ThemedTextInput = ({style, ...props}) => {
    const { theme } = useTheme()
    const [isFocused, setIsFocused] = useState(false)

  return (
    <TextInput
        style={[
            {
                backgroundColor: theme.uiBackground,
                color: theme.text,
                padding: 20,
                borderRadius: 6,
                borderWidth:1,
                borderColor: theme.uiBackground
            },
            isFocused && {borderColor: Colors.primary},
            style
        ]}
        onFocus={()=>{setIsFocused(true)}}
        onBlur={()=>{setIsFocused(false)}}
        placeholderTextColor = {theme.text}
        {...props}
    />
  )
}

export default ThemedTextInput

