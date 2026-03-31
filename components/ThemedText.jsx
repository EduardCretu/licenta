import { Text } from 'react-native'
import { useTheme } from '../contexts/ThemeContext'

// themed text component, matching current selected theme
// has the ability to take a normal text color and a bolder title text color.
const ThemedText = ({ style, title = false, ...props }) => {
  const { theme } = useTheme()

  const textColor = title ? theme.title : theme.text

  return (
    <Text 
      style={[{ color: textColor }, style]}
      {...props}
    />
  )
}

export default ThemedText