// dev related imports
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, Keyboard, Modal, Alert, Linking } from 'react-native'
// notification related imports
import * as Notifications from 'expo-notifications'
import { initNotifications } from "../../lib/notifications.js"
// context-hook imports
import { useTheme } from '../../contexts/ThemeContext'
// custom component imports
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from "../../components/ThemedButton"
import ThemedDropdownComponent from "../../components/ThemedDropdown"
import { Colors } from '../../constants/colors'

// import data for dropdown menus from constants
import { notificationTypeData, minuteData, hourData, weekdayData, monthData, monthlyDayData } from '../../constants/dropdownFields'

import AsyncStorage from '@react-native-async-storage/async-storage';

// async function to check & request system permissions for notifications
async function requestPermissions() {
    // check if permissions have been given
    const { status } = await Notifications.requestPermissionsAsync()
    // if !permissions, alert
    if (status !== 'granted') {
        alert('Permission for notifications not granted!')
        return false
    }
    return true
}

// unlike minutes, hours, weekdays and months, days in a month are not constant.. how sad
function getDaysInMonth(month, year = new Date().getFullYear()) {
    // if there is no data in month const, return empty item list
    if (!month) {
        return []
    }
    // get last day of month at specific year and month (usually current year & selected month)
    const daysInMonth = new Date(year, month, 0).getDate()
    // construct and array object with values 'label' and 'value', as per <Dropdown> component requirements and return it
    return Array.from({ length: daysInMonth }, (_, i) => ({
        label: String(i + 1),
        value: i + 1,
    }))
}

// create tab page tasked with handling creating and editing information and reminders.
const Create = () => {
    // notification scheduler related consts
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [minute, setMinute] = useState(null)
    const [hour, setHour] = useState(null)
    const [weekday, setWeekday] = useState(null)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    // notification dropdown related consts
    const [notificationType, setNotificationType] = useState(null)
    const [error, setError] = useState(null)
    const dayData = getDaysInMonth(month) // <<-- this bad boy is different, *dynamic*! purr, rawr. bow-wow

    // theme related const
    const { theme } = useTheme()

    useEffect(() => {
        // create a const function that checks storage for a token regarding showing user 'A&N' alert
        const checkReminderAlert = async () => {
            try {
                // get token value
                const hasSeen = await AsyncStorage.getItem('hasSeenReminderAlert')
                // if token value is 'null' show alert
                if (!hasSeen) {
                    Alert.alert(
                        "IMPORTANT",
                        "For accurate notifications, please enable 'Alarms & Reminders' in your device settings.",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Open Settings",
                                // send user to system settings
                                onPress: () => Linking.openSettings()
                            }
                        ]
                    )
                    // Once alert has been dismissed, sets token as true for a 1 time use case
                    await AsyncStorage.setItem('hasSeenReminderAlert', 'true')
                }
            } catch (err) {
                console.error("AsyncStorage error:", err)
            }
        }
        // call function once and never again
        checkReminderAlert()
    }, [])



    // function to validate dropdown fields
    function validateNotificationForm() {
        let errMessage = ""
        if(!title.trim()) {errMessage += "Please enter a notification title\n"}
        if(hour === null) {errMessage += "Choose value from 'Hour' field\n"}
        if(minute === null) {errMessage += "Choose value from 'Minute' field\n"}
        if(notificationType === 3 && weekday === null) {errMessage += "Choose value from 'Week day' field\n"}
        if(notificationType === 4 && day === null) {errMessage += "Choose value from 'Day' field\n"}
        if (notificationType === 5) {
            if (month === null) {
                errMessage += "Choose value from 'Month' field\n"
            }
            if (day === null) {
                errMessage += "Choose value from 'Day' field\n"
            }
        }
        // return accumulated errors
        if (errMessage === "") {return null}
        return errMessage
    }


    // notification scheduler function
    async function scheduleNotification() {
        try {
            // set error to null
            setError(null)
            // validate for errors and return
            const validateErr = validateNotificationForm()
            // 'throw' error if error exists
            if (validateErr) {
                setError(validateErr)
                return
            }
            // check notification type and schedule based on it
            if (notificationType === 2) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DAILY,
                        hour,
                        minute,
                    },
                })
                console.log('Daily notification set')
            } else if (notificationType === 3) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                        hour,
                        minute,
                        weekday,
                    },
                })
                console.log('Weekly notification set')
            } else if (notificationType === 4) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
                        hour,
                        minute,
                        day,
                    },
                })
                console.log('Monthly notification set')
            } else if (notificationType === 5) {
                // get current date
                const now = new Date()
                // get date based on dropdown fields
                let date = new Date(new Date().getFullYear(), month-1, day, hour, minute, 0 )
                // check if date has passed and schedule for following year if true
                if (date <= now) {
                    date = new Date(now.getFullYear()+1, month-1, day, hour, minute, 0 )
                }

                await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date
                    },
                })
                console.log('One-time notification set')
            }
            // reset notification related consts
            setNotificationType(null);
            setHour(null);
            setMinute(null);
            setWeekday(null);
            setDay(null);
            setMonth(null);
            setTitle('');
            setBody('');
        }
        catch (err) {
                setError("Failed to Schedule Notification")
        }
    }
    // function to handle schedule submission
    async function handlePress() {
        // get system permissions
        const granted = await requestPermissions()
        // return if permissions disallow
        if (!granted) {
            return
        }
        // call function to schedule notification
        await scheduleNotification()
    }


    // note to self: May need to add scrollview
    return (
        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
            <ScrollView endFillColor={theme.background}>
                <ThemedView safe style={styles.container}>

                    <Spacer/>

                    {/*Header*/}
                    <ThemedText title={true} style={styles.header}>
                        Schedule Notification
                    </ThemedText>

                    <Spacer height={20}/>


                    {/*Notification title label and input field*/}
                    <ThemedText>
                        Notification Title
                    </ThemedText>

                    <ThemedTextInput
                        placeholder='Notification Name'
                        style={styles.txtInput}
                        autoCorrect={false}
                        autoComplete={'off'}
                        onChangeText={setTitle}
                        value={title}
                    />

                    {/*Notification Body label and input field*/}
                    <ThemedText>
                        Notification Body
                    </ThemedText>

                    <ThemedTextInput
                        placeholder='Notification Body'
                        style={styles.txtInput}
                        autoCorrect={false}
                        autoComplete={'off'}
                        onChangeText={setBody}
                        value={body}
                    />

                    {/*Dropdown subsection where the magic happens*/}
                    <ThemedText>
                        Notification Type
                    </ThemedText>
                    {/*Custom Themed component with custom {props} passed to manipulate a generalized version of a component*/}
                    <ThemedDropdownComponent
                        // data prop accepts data array to disply as 'items'
                        data={notificationTypeData}
                        // value prop matching local value with general components display item
                        // in our case 'notificationType' is int, wherein 2 ==> 'Daily' field
                        value={notificationType}
                        // onChange prop to change local and general component values
                        onChange={(newValue, item) => {
                            // setting the values
                            setNotificationType(newValue);
                            // resetting fields. Why? CALENDAR trigger incident
                            // no funky business with carryover data
                            setHour(null);
                            setMinute(null);
                            setWeekday(null);
                            setDay(null);
                            setMonth(null);
                            setError(null);
                        }}
                    />
                    {/*if null, display text suggesting that user should pick notification type*/}
                    {(notificationType === null) && <ThemedText style={{margin: 20}}>Select A Notification Type</ThemedText>}

                    {/*sub-dropdown fields, each only rendering when appropriate for the notification type*/}
                    {(notificationType === 5) && <View style={[styles.fieldContainer, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={styles.label}>
                            Month:
                        </ThemedText>
                        <ThemedDropdownComponent
                            data={monthData}
                            value={month}
                            mode={'modal'}
                            onChange={(newValue, item) => {
                                setMonth(newValue);
                                // day array is calculated dynamically for accuracy,
                                // thus needs resetting so no mismatch occurs
                                setDay(null);
                            }}
                            styleDropdown={{width: '70%', padding: 0}}
                            styleBaseContainer={{padding:5}}
                        />
                    </View>}
                    {(notificationType === 4 || notificationType === 5) && <View style={[styles.fieldContainer, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={styles.label}>
                            Day:
                        </ThemedText>
                        <ThemedDropdownComponent
                            data={(notificationType === 4) ? monthlyDayData : dayData}
                            value={day}
                            mode={'modal'}
                            onChange={(newValue, item) => {
                                setDay(newValue);
                            }}
                            styleDropdown={{width: '70%', padding: 0}}
                            styleBaseContainer={{padding:5}}
                        />
                    </View>}
                    {(notificationType === 3) && <View style={[styles.fieldContainer, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={styles.label}>
                            Week day:
                        </ThemedText>
                        <ThemedDropdownComponent
                            data={weekdayData}
                            value={weekday}
                            mode={'modal'}
                            onChange={(newValue, item) => {
                                setWeekday(newValue);
                            }}
                            styleDropdown={{width: '70%', padding: 0}}
                            styleBaseContainer={{padding:5}}
                        />
                    </View>}
                    {(notificationType >= 2) && <View style={[styles.fieldContainer, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={styles.label}>
                            Hour:
                        </ThemedText>
                        <ThemedDropdownComponent
                            data={hourData}
                            value={hour}
                            mode={'modal'}
                            onChange={(newValue, item) => {
                                setHour(newValue);
                            }}
                            styleDropdown={{width: '70%', padding: 0}}
                            styleBaseContainer={{padding:5}}
                        />
                    </View>}
                    {(notificationType !== null) && <View style={[styles.fieldContainer, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={styles.label}>
                            Minute:
                        </ThemedText>
                        <ThemedDropdownComponent
                            data={minuteData}
                            value={minute}
                            mode={'modal'}
                            onChange={(newValue, item) => {
                                setMinute(newValue);
                            }}
                            styleDropdown={{width: '70%', padding: 0}}
                            styleBaseContainer={{padding:5}}
                        />
                    </View>}

                    {/*error display in case of error*/}
                    {error && <Modal
                        animationType={"slide"}
                        transparent={true}
                    >
                        <Text style={styles.error} onPress={() => {setError(null)}}>
                            {error}
                        </Text>
                    </Modal>}

                    {/*submission button only appears if notificationType is valid value*/}
                    {(notificationType !== null) && <ThemedButton onPress={handlePress}>
                        <Text style={{ color: 'white' }}>
                            Schedule Notification
                        </Text>
                    </ThemedButton>}
                </ThemedView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default Create

const styles = StyleSheet.create({
// basic page CSS
    container: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center"
    },
// input fields
    txtInput: {
        width: '90%',
        margin:10
    },
// Dropdown related CSS
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
        borderRadius: 6,
        borderBottomWidth: 2,
        width: '95%',
        alignSelf: 'center'
    },
// sub-dropdown related CSS
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 8,
        width: '90%',
        borderRadius: 6,
        height: 50
    },
// error message CSS



    error: {
        textAlign: 'center',
        color: Colors.warning,
        padding: 10,
        backgroundColor: "#e2b3b3ff",
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 6,
        boxShadow: '2px 2px 5px #030303',
        margin: 20
        }

})