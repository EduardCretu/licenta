import { ActivityIndicator } from "react-native"
import ThemedView from "./ThemedView"
import { useTheme } from "../contexts/ThemeContext"

// Themed loader used in (auth) components. Simple spinny wheel
const ThemedLoader = ({size="large"}) => {
    const { theme } = useTheme()

  return (
    <ThemedView style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <ActivityIndicator size={size} color={theme.text}/>
    </ThemedView>
  )
}

export default ThemedLoader