  import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';

  import ThemedView from './ThemedView'
  import ThemedText from './ThemedText'

  import { useTheme } from '../contexts/ThemeContext'


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
    //const [value, setValue] = useState(null);

    const { theme } = useTheme()

    return (
      <Dropdown
        style={[
            styles.dropdown,
            {
                backgroundColor: theme.uiBackground,
                color: theme.text
            },
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
      />
    );
  };

  export default ThemedDropdownComponent;

  const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        padding: 20,
        borderRadius: 6,
        width: '90%',
        margin: 10
    },
    placeholderStyle: {
        fontSize: 16
    },
    selectedTextStyle: {
        fontSize: 16
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderWidth: 0,
        borderBottomWidth: 1
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
  });