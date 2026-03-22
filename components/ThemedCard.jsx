import { StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/colors'

const ThemedCard = ({ style,primary=false, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  const bg = primary ? Colors.primary : theme.uiBackground

  return (
    <View 
      style={[{ backgroundColor: bg}, styles.card, style]}
      {...props}
    />
  )
}

export default ThemedCard

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20
  }
})