import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import ThemedView from './ThemedView'
import ThemedText from './ThemedText'

import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/colors'


const ThemedDropdownComponent = ({data,
    showSearch=false,
    value,
    onChange,
    styleDropdown,
    stylePlaceholder,
    styleSelectedText,
    styleInputSearch,
    styleItemContainer,
    styleBaseContainer,
    mode='default'
    }) => {


    const { theme } = useTheme()
    const [isFocused, setIsFocused] = useState()

    return (
        <Dropdown
            style={[
                styles.dropdown,
                {
                    backgroundColor: theme.uiBackground,
                    color: theme.text,
                    borderColor: theme.uiBackground
                },
                isFocused === true && styles.focusedField,
                styleDropdown
            ]}
            placeholderStyle={[
                styles.placeholderStyle,
                {
                    backgroundColor: theme.uiBackground,
                    color: theme.text
                },
                stylePlaceholder
            ]}
            selectedTextStyle={[
                styles.selectedTextStyle,
                {
                    backgroundColor: theme.uiBackground,
                    color: theme.text
                },
                styleSelectedText
            ]}
            inputSearchStyle={[
                styles.inputSearchStyle,
                {
                    backgroundColor: theme.uiBackground,
                    color: theme.text
                },
                styleInputSearch
            ]}
            itemContainerStyle={[
                styles.itemContainerStyle,
                {
                    backgroundColor: theme.background,
                    borderColor: theme.navBackground
                },
                styleItemContainer
            ]}
            containerStyle={[
                styles.containerStyle,
                {
                    backgroundColor: theme.navBackground,
                    borderColor: theme.navBackground
                },
                styleBaseContainer
            ]}
            itemTextStyle={{ color: theme.text }}
            activeColor={theme.uiBackground}
            mode={mode}
            flatListProps={{
                style: {
                    maxHeight: 500, // controls dropdown list height
                }
            }}
            autoScroll={false}
            data={data}
            search={showSearch}
            maxHeight={250}
            labelField="label"
            valueField="value"
            placeholder="..."
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              onChange?.(item.value, item);
            }}
            onFocus={() => {setIsFocused(true)}}
            onBlur={() => {setIsFocused(false)}}
        />
    );
};

export default ThemedDropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        padding: 20,
        borderRadius: 6,
        borderWidth: 1,
        width: '90%',
        margin: 20
    },
    placeholderStyle: {
        fontSize: 16,
        padding: 0
    },
    selectedTextStyle: {
        fontSize: 16,
        padding: 0
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    itemContainerStyle: {
        borderRadius: 10,
        borderBottomWidth: 2,
        width: '95%',
        alignSelf: 'center'
    },
    containerStyle: {
        borderRadius: 10,
        borderWidth: 0,
        marginTop: 0,
    },
    focusedField: {
        borderColor: Colors.primary
    }
});