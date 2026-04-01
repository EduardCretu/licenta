import { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'

// custom theme components
import ThemedText from './ThemedText'
import ThemedButton from './ThemedButton'

// theme related imports
import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/colors'



// component specifically for 3 modals. i am not joking. i hate myself
const ModalButtons = ({subText, cancText, placeholderText, onSubmit, onCancel, styleSub, styleCanc}) => {
    // consuming the theme
    const { theme } = useTheme()

    return (
        <View style={styles.btnView}>
            {/* a little view with two buttons */}
            <ThemedButton
                style={[{ backgroundColor: Colors.warning, width: '45%',height: 55 }, styleSub]}
                onPress={onSubmit}
            >
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 500 }}>
                    {subText}
                </Text>
            </ThemedButton>

            <ThemedButton
                style={[{backgroundColor: theme.buttonColor, width: '45%',height: 55 }, styleCanc]}
                onPress={onCancel}
            >
                <Text style={{ textAlign: 'center', color: theme.text, fontSize: 18, fontWeight: 500 }}>
                    {cancText}
                </Text>
            </ThemedButton>
        </View>
    )
}

export default ModalButtons

const styles = StyleSheet.create({
        btnView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginVertical: 8,
            width: '95%',
            borderRadius: 6,
            height: 50
        }
})