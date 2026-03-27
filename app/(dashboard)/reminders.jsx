import {StyleSheet, ScrollView, RefreshControl, Text, View, Modal, Pressable } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';

// custom component imports
import Spacer from '../../components/Spacer';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import ThemedButton from '../../components/ThemedButton';

import * as Notifications from 'expo-notifications';

import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/colors';

const Reminders = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotif, setSelectedNotif] = useState(null);
    const [delAllWin, setDelAllWin] = useState(false);
    const [detailWin, setDetailWin] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();

    // Loads notifications from the OS if there are any
    const loadScheduledNotifications = async () => {
        try {
            const notifData = await Notifications.getAllScheduledNotificationsAsync();
            setNotifications(notifData);
            //console.log(notifData)
        } catch (err) {
            console.log(err);
            setNotifications([]);
        }
    };

    // function to refresh screen on pulldown
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadScheduledNotifications();
        } finally {
            setRefreshing(false);
        }
    }, []);


    // function to load notifications on first render
    useEffect(() => {
        loadScheduledNotifications();
    }, []);

    // const to open specific notification window
    const openNotifWin = (notif) => {
        setSelectedNotif(notif);
        setDetailWin(true);
    };
    // const to close notif window
    const closeNotifWin = () => {
        setSelectedNotif(null);
        setDetailWin(false);
    };

    // arrow function that deletes specified notification by ID
    const handleDeleteOne = async () => {
        try {
            await Notifications.cancelScheduledNotificationAsync(selectedNotif.identifier);
            closeNotifWin();
            await loadScheduledNotifications();
        } catch (err) {
            console.log(err);
        }
    };

    // arrow function that deletes all notifications
    const handleDeleteAll = async () => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            setDelAllWin(false);
            await loadScheduledNotifications();
        } catch (err) {
            console.log(err);
        }
    };

    const renderTriggerDetails = (trigger) => {
        return (
            <>
                <ThemedText>Type: {trigger.type}</ThemedText>
                {trigger.type !== 'date' && <ThemedText>Hour: {trigger.hour}</ThemedText>}
                {trigger.type !== 'date' && <ThemedText>Minute: {trigger.minute}</ThemedText>}
                {trigger.type === 'weekday' && <ThemedText>Weekday: {trigger.weekday}</ThemedText>}
                {trigger.type === 'monthly' || trigger.type === 'date '&& <ThemedText>Day: {trigger.day}</ThemedText>}
                {trigger.type === 'date' && <ThemedText>Date: {new Date(trigger.value).toLocaleString()}</ThemedText>}
            </>
        );
    };

    return (
        <ScrollView
            endFillColor={theme.background}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <ThemedView safe style={styles.container}>
                <Spacer />

                <ThemedText title={true} style={styles.heading}>
                    Your Reminders List
                </ThemedText>

                {notifications.length === 0 && (
                    <ThemedText>No scheduled notifications</ThemedText>
                )}

                {notifications.length !== 0 &&
                    <View style={styles.listWrap}>
                        {notifications.map((notif, index) => (
                            <Pressable
                                key={notif.identifier}
                                onPress={() => openNotifWin(notif)}
                                style={[
                                    styles.card,
                                    {backgroundColor: theme.uiBackground, borderColor: theme.iconColor}]}
                            >
                                <ThemedText title style={styles.cardTitle}>
                                    #{index + 1} {notif.content.title}
                                </ThemedText>

                                <ThemedText>
                                    Type: {notif.trigger.type}
                                </ThemedText>

                                {notif.trigger.type !== 'date' && <ThemedText>
                                    Time: {notif.trigger.hour }: {String(notif.trigger.minute).padStart(2, '0')}
                                </ThemedText>}

                                {notif.trigger.type === 'date' && <ThemedText>
                                    {new Date(notif.trigger.value).toLocaleString()}
                                </ThemedText>}

                            </Pressable>
                        ))}
                    </View>
                }

                {notifications.length > 0 && (
                    <ThemedButton onPress={() => setDelAllWin(true)}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>
                            Delete all notifications
                        </Text>
                    </ThemedButton>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={detailWin}
                    onRequestClose={closeNotifWin}
                >
                    <View style={styles.centeredView}>
                        <View
                            style={[
                                styles.modalView,
                                { backgroundColor: theme.navBackground, borderColor: Colors.primary }
                            ]}
                        >
                            <ThemedText style={[styles.modalText, { fontSize: 25 }]}>
                                Notification Details
                            </ThemedText>

                            {selectedNotif && (
                                <View style={styles.detailBlock}>
                                    {renderTriggerDetails(selectedNotif.trigger)}
                                </View>
                            )}

                            <View style={styles.btnView}>
                                <ThemedButton
                                    style={{
                                        backgroundColor: Colors.primary,
                                        width: '45%',
                                        height: 55
                                    }}
                                    onPress={handleDeleteOne}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 18,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Delete
                                    </Text>
                                </ThemedButton>

                                <ThemedButton
                                    style={{
                                        backgroundColor: Colors.warning,
                                        width: '45%',
                                        height: 55
                                    }}
                                    onPress={closeNotifWin}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 18,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Close
                                    </Text>
                                </ThemedButton>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={delAllWin}
                    onRequestClose={() => setDelAllWin(false)}
                >
                    <View style={styles.centeredView}>
                        <View
                            style={[
                                styles.modalView,
                                { backgroundColor: theme.navBackground }
                            ]}
                        >
                            <ThemedText style={[styles.modalText, { fontSize: 25, fontWeight: 500 }]}>
                                Delete all notifications?
                            </ThemedText>

                            <View style={styles.btnView}>
                                <ThemedButton
                                    style={{
                                        backgroundColor: Colors.primary,
                                        width: '45%',
                                        height: 55
                                    }}
                                    onPress={handleDeleteAll}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 18,
                                            fontWeight: 500
                                        }}
                                    >
                                        Delete
                                    </Text>
                                </ThemedButton>

                                <ThemedButton
                                    style={{
                                        backgroundColor: Colors.warning,
                                        width: '45%',
                                        height: 55
                                    }}
                                    onPress={() => setDelAllWin(false)}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 18,
                                            fontWeight: 500
                                        }}
                                    >
                                        Cancel
                                    </Text>
                                </ThemedButton>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ThemedView>
        </ScrollView>
    );
};

export default Reminders;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16
    },
    listWrap: {
        width: '90%',
        marginBottom: 20
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
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
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: Colors.warning,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 16
    },
    detailBlock: {
        width: '100%',
        gap: 8,
        marginBottom: 20
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
    }
});