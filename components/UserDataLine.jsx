import { StyleSheet, View } from 'react-native'
import ThemedText from './ThemedText'
import { useTheme } from'../contexts/ThemeContext'

// a simple component to avoid redundancy in /profile.jsx. 
// Displays two data strings side by side
const UserDataLine = ({style,title,userData, placeholderText = '-', topBorder = false, bottomBorder = false}) => {
    const { theme } = useTheme()
  return (
    <View
        style={[
            styles.section,
            {
                backgroundColor: theme.background
            },
                topBorder && {borderTopRightRadius: 6, borderTopLeftRadius: 6, paddingTop: 10},
                bottomBorder && {borderBottomRightRadius: 6, borderBottomLeftRadius: 6, paddingBottom: 10},
            style,
        ]}
    >
          <ThemedText
            style={[
                {
                    height: '100%',
                    width: '38%',
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    marginVertical: 5,
                    borderRightWidth: 2,
                    borderColor: theme.navBackground,
                }
             ]}
          >
            {title}:
          </ThemedText>
          <ThemedText
            style={[
              {
                  height: '100%',
                  textAlignVertical: 'center',
                  width: '60%',
                  fontSize: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
              },
            ]}>
            {(userData === '') ? placeholderText : userData}
          </ThemedText>
    </View>
  )
}

export default UserDataLine

const styles = StyleSheet.create({
    section: {
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        paddingHorizontal: 10,
    },
})