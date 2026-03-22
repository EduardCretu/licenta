import { StyleSheet } from 'react-native'


// custom component imports
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"


// reminders tab page handling creating and viewing reminders
const Reminders = () => {
  return (
    <ThemedView safe style={styles.container}>

      <Spacer />
      <ThemedText title={true} style={styles.heading}>
        Your Reminders List
      </ThemedText>

    </ThemedView>
  )
}

export default Reminders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})