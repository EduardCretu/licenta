import { StyleSheet } from 'react-native'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"


// create tab page tasked with handling creating and editing information and reminders.
const Create = () => {
  return (
    <ThemedView safe style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        Add a Reminder
      </ThemedText>
      <Spacer />

    </ThemedView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})