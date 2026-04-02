import { useState } from 'react'
import { StyleSheet, View, TextInput, Pressable } from 'react-native'

import ThemedSecuredTextInput from './ThemedSecuredTextInput'


// custom themed components
import ThemedText from './ThemedText'
import { Ionicons } from '@expo/vector-icons'
// color related imports
import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/colors'



// custom component that renders a text label next two a text input
const SecuredUserEditLine = ({styleView, styleTxt, title, placeholderText, ...props}) => {
    // consts for theme and highlighting the focused component
    const [isFocused, setIsFocused] = useState()
    const [secured, setSecured] = useState(true)
    const { theme } = useTheme()

    // return the component
    return (
        <View style={[styles.inputFieldView, {backgroundColor: theme.uiBackground}, styleView]}>
            {/* label */}
            <ThemedText style={[styles.label, styleTxt]}>
                {title}
            </ThemedText>

            <ThemedSecuredTextInput
                placeholder={placeholderText}
                styleView={{
                    marginRight: 20,
                    width: '70%',
                    height: '80%',
                    backgroundColor: theme.background
                }}
                styleTxt={{
                    backgroundColor: theme.background,
                    paddingVertical: 0
                }}
                styleIcon={{
                    paddingLeft: 8,
                    paddingTop: 2
                }}
                iconSize={20}
                {...props}
            />
        </View>
    )
}

export default SecuredUserEditLine

const styles = StyleSheet.create({
    inputFieldView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingLeft: 10,
        marginVertical: 8,
        width: '100%',
        borderRadius: 6,
        height: 50
    },
    label: {
        fontSize: 14,
        width: '30%'
    },
    inputField: {
        width: '30%',
        borderWidth: 1,
        borderRadius: 6,
        marginLeft: 5,
        paddingLeft: 10,
    },
    focusedField: {
        borderColor: Colors.primary
    },
    icon: {
        paddingRight: 15,
        height: 40,
        marginTop: 15,
    }
})