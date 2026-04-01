import { View } from 'react-native'
import { useTheme } from '../contexts/ThemeContext'

// simple HR component. Admittedly a bit overkill, since I only used it once.
const ThemedHr = ({width='90%', style}) => {
    const { theme } = useTheme()
  return (
    <View style={[{
        borderWidth:1.2,
        borderColor:theme.uiBackground,
        height:'0px',
        width:width
        },
        style
        ]}
    />
  )
}

export default ThemedHr