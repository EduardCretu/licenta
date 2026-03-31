import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../contexts/ThemeContext'

// cornerstone of the app, themed view with SafeArea insets
const ThemedView = ({safe=false, style, ...props}) => {
  const {theme} = useTheme()


  if(!safe) return (
    <View style={[{
        backgroundColor: theme.background},style ]}
        {...props}
    />
  )

  const insets = useSafeAreaInsets()

  return (
    <View style={[{
        backgroundColor: theme.background,
        
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      },
      style ]}
        {...props}
    />
  )
}

export default ThemedView

