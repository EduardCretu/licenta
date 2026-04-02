import { useState } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

// custom themed components
import ThemedText from './ThemedText'

// color related imports
import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/colors'



// custom component that renders a text label next two a text input
const UserEditLine = ({styleView, styleInput, styleTxt, title, placeholderText, setKey=()=>{}, ...props}) => {
    // consts for theme and highlighting the focused component
    const [isFocused, setIsFocused] = useState()
    const { theme } = useTheme()

    // return the component
    return (
        <View style={[styles.inputFieldView, {backgroundColor: theme.uiBackground}, styleView]}>
            {/* label */}
            <ThemedText style={[styles.label, styleTxt]}>
                {title}
            </ThemedText>
            {/* the text input */}
            <TextInput
                style={[
                    styles.inputField,
                    {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.background
                    },
                    // if the text is focused on use this CSS object as well
                    isFocused && styles.focusedField,
                    styleInput
                ]}
                placeholder={placeholderText}
                placeholderTextColor={theme.text}
                onFocus={() => {setIsFocused(true); setKey(true)}}
                onBlur={() => {setIsFocused(false); setKey(false)}}
                {...props}
            />
        </View>
    )
}

export default UserEditLine

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
            width: '45%'
        },
        inputField: {
            width: '50%',
            borderWidth: 1,
            borderRadius: 6,
            marginLeft: 5,
            paddingLeft: 10,
        },
        focusedField: {
            borderColor: Colors.primary
        }
})