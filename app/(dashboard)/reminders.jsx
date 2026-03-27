import { StyleSheet, ScrollView, RefreshControl, Text, View, Modal} from 'react-native'
import React, { useState, useEffect } from 'react'

// custom component imports
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'

import * as Notifications from 'expo-notifications'

import { useTheme } from '../../contexts/ThemeContext'
import { Colors } from '../../constants/colors'


// reminders tab page handling creating and viewing reminders
const Reminders = () => {
    const [getNotifs, setGetNotifs] = useState('');
    const [delAllWin, setDelAllWin] = useState(false);
    const [btnVis, setBtnVis] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const { theme } = useTheme()

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
          loadScheduledNotifications();
        }, 1000);
    }, []);

    useEffect(() => {
        loadScheduledNotifications();
    }, [])

    async function loadScheduledNotifications() {

        const notifData = await Notifications.getAllScheduledNotificationsAsync()
        //console.log(notifData)

        const formatted = notifData.map((n,index) => {
              return `#${index + 1}
              Type: ${n.trigger?.type}
              Hour: ${n.trigger?.hour}
              Minute: ${n.trigger?.minute}
              Weekday: ${n.trigger?.weekday}
              Day: ${n.trigger?.day}
              ------------------`
        }).join('\n')
        setGetNotifs(formatted || 'No scheduled Notifications');
        setBtnVis(notifData.length > 0);
    }

    async function handleDeletePress() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            setDelAllWin(!delAllWin);
        }
        catch (err) {
            console.log(err)
        }
    }



    return (
        <ScrollView endFillColor={theme.background}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <ThemedView safe style={styles.container}>

            <Spacer />
            <ThemedText title={true} style={styles.heading}>
                Your Reminders List
            </ThemedText>

            <ThemedText>{getNotifs}</ThemedText>


            {btnVis && <ThemedButton primary={true} onPress={() => setDelAllWin(!delAllWin)}>
                <Text style={{color:'white'}}>
                    Delete all notifications
                </Text>
            </ThemedButton>}


            <Modal
                animationType="slide"
                transparent={true}
                visible={delAllWin}
                onRequestClose={() => {
                    setDelAllWin(!delAllWin);
                }}>

                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {backgroundColor: theme.navBackground}]}>
                        <ThemedText style={[styles.modalText, {fontSize: 25}]}>
                            Delete all notifications?
                        </ThemedText>
                        <View style={styles.btnView}>
                            <ThemedButton
                                style={{backgroundColor: Colors.primary, width: '45%', height:'55'}}
                                onPress={handleDeletePress}
                            >
                                  <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                      Delete
                                  </Text>
                            </ThemedButton>
                            <ThemedButton
                                style={{backgroundColor: Colors.warning, width: '45%', height:'55'}}
                                onPress={() => setDelAllWin(!delAllWin)}
                            >
                                  <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                      Cancel
                                  </Text>
                            </ThemedButton>
                        </View>
                    </View>
                </View>

            </Modal>


            </ThemedView>
        </ScrollView>
    )
}

export default Reminders

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btnView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 8,
        width: '95%',
        borderRadius: 6,
        height: 50
    },
})