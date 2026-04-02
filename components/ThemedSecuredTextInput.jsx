import { TextInput, View, Pressable, StyleSheet } from 'react-native'
import {useState} from 'react'
import { Colors } from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../contexts/ThemeContext'

// themed text input
const ThemedSecuredTextInput = ({styleTxt, styleView, styleIcon, iconSize=24, ...props}) => {
    const { theme } = useTheme()
    const [isFocused, setIsFocused] = useState(false)
    const [secured, setSecured] = useState(true)

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: theme.uiBackground,
                    backgroundColor: theme.uiBackground,
                    borderWidth:1
                },
                isFocused && {borderColor: Colors.primary},
                styleView
            ]}
        >
            <TextInput
                style={[styles.txtInput, {
                      backgroundColor: theme.uiBackground,
                      color: theme.text,
                      borderColor: theme.uiBackground
                  },
                  isFocused && {borderColor: Colors.primary},
                  styleTxt
                ]}
                keyboardType= "password"
                autoCorrect={false}
                autoComplete={'off'}
                onFocus={()=>{setIsFocused(true)}}
                onBlur={()=>{setIsFocused(false)}}
                placeholderTextColor = {theme.text}
                secureTextEntry={secured}
                {...props}
            />
            <Pressable
                onPress={()=>{setSecured(!secured)}}
                style={[
                    styles.icon,
                    styleIcon
                ]}
            >
                <Ionicons
                    size={iconSize}
                    color={!secured ? theme.iconColorFocused : theme.iconColor}
                    name={secured ? 'eye-off' : 'eye'}
                />
            </Pressable>
        </View>
    )
}

export default ThemedSecuredTextInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 6,
        paddingLeft: 0
    },
    txtInput: {
        width: '85%',
        padding: 20,
        borderBottomLeftRadius: 6,
        borderTopLeftRadius: 6,
        borderRightWidth:1,
    },
    icon: {
        paddingRight: 15,
        height: 40,
        marginTop: 15,
    }
})