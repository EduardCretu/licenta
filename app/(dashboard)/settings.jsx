import { StyleSheet, View, Switch, Text, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native'
// context-hook imports
import { useTheme } from '../../contexts/ThemeContext'
import { useUser } from '../../contexts/UserContext'
import { useMedInfo } from '../../contexts/MedInfoContext'
import { useState, useEffect } from 'react'
// custom component imports
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import UserEditLine from '../../components/UserEditLine'
import SecuredUserEditLine from '../../components/SecuredUserEditLine'
import ModalButtons from '../../components/ModalButtons'
import ThemedHr from '../../components/ThemedHr'
// color related imports
import { Colors } from '../../constants/colors'

// settings tab page tasked with handling account management
const Settings = () => {
    // context hook related consts
    const { isDark, toggleTheme, theme } = useTheme()
    const { user, logout, deleteAccount, updateUserEmail, updateUserPassword } = useUser()
    const { deleteMedInfo } = useMedInfo()
    // state consts related to storing information
    const [email, setEmail] = useState('')
    const [emPass, setEmPass] = useState('')
    const [pass, setPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [newPassConf, setNewPassConf] = useState('')
    const [infoRev, setInfoRev] = useState(false)
    const [delWin, setDelWin] = useState(false)
    const [logWin, setLogWin] = useState(false)
    const [changeEmailWin, setChangeEmailWin] = useState(false)
    const [changePassWin, setChangePassWin] = useState(false)
    // error & announcement state consts
    const [error, setError] = useState('')
    const [announcement, setAnnouncement] = useState(null)

    // setting the email value to user's email on first render and every time user's email field changes.
    useEffect(()=>{
        setEmail(user?.email ?? '')
    },[user?.email])
    // function that handles account and row deletion
    async function handleDeleteAcc() {
        // if there is no user id return early
        // (kinda useless, but why not?)
        if (!user?.$id) {
            return
        }
        // try deleting
        try {
            await deleteMedInfo(user.$id);
            await deleteAccount();
        }
        catch (err) {
            console.log(err)
        }
    }

    // function to handle updating user's email information
    async function handleUpdateEmail() {
        setError('');
        // manual checks to cut down on failed appwrite API calls
        if (!email.trim()) {
            setError('Please enter an email.');
            return;
        }
        if (!emPass.trim()) {
            setError('Please enter your password.');
            return;
        }
        // try updating && reset fields + set announcement for user
        try {
            await updateUserEmail(email.trim(), emPass);
            setChangeEmailWin(false);
            resetEmailModal();
            setAnnouncement('Email')
        } catch (err) {
            // console.log(err);
            setError(getErrorMessage(err));
        }
    }
    // function that handles updating user's password
    async function handleUpdatePass() {
        setError('');
        // again, manual checks to cut down on traffic towards appwrite project
        if (!pass.trim()) {
            setError('Please enter your current password.');
            return;
        }
        if (!newPass.trim() || !newPassConf.trim()) {
            setError('Please fill in both new password fields.');
            return;
        }
        if (newPass !== newPassConf) {
            setError('New passwords do not match.');
            return;
        }
        // try updating && reset fields + set announcement for user
        try {
            await updateUserPassword(pass, newPass);
            setChangePassWin(false);
            resetPasswordModal();
            setAnnouncement('Password')
        } catch (err) {
            // console.log(err);
            setError(getErrorMessage(err));
        }
    }

    // helper function to manage error message
    // if you wonder why, its because of the error handling I was doing before it
    function getErrorMessage(err) {
        if (typeof err === 'string') {
            return err;
        }
        const msg = err?.message ?? 'Something went wrong';
        const parts = msg.split(':');
        // return first truthy
        return parts[1]?.trim() || parts[0] || 'Something went wrong';
    }

    // helper functions to reset fields
    function resetEmailModal() {
        setEmPass('');
        setError('');
        setEmail(user?.email ?? '');
    }
    function resetPasswordModal() {
        setPass('');
        setNewPass('');
        setNewPassConf('');
        setError('');
    }

    // main body
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                style={{backgroundColor: theme.background, width: '100%', height: '100%', flex: 1 }}
                // vvv another coconut.png
                //contentContainerStyle={{alignItems: 'center'}}
                endFillColor={theme.background}
                showsVerticalScrollIndicator={false}
            >
                <ThemedView safe style={styles.mainContainer}>
                    <Spacer/>

                    <ThemedText title style={styles.heading}>
                        Settings
                    </ThemedText>

                    <Spacer />

                    <ThemedText style={styles.heading}>
                        App Options
                    </ThemedText>

                    {/* Dark mode switch*/}
                    <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={[styles.label, {paddingLeft: 10}]}>
                            {isDark ? 'Dark Mode' : 'Light Mode'}
                        </ThemedText>

                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            thumbColor={isDark ? '#fff' : '#fff'}
                            trackColor={{ false: '#767577', true: Colors.primary }}
                        />
                    </View>


                    <ThemedText style={styles.heading}>Account Info</ThemedText>

                    <ThemedHr style={{marginVertical: 5}}/>

                    {/*fields with user's account information*/}
                    <UserEditLine
                        title={'User Email:'}
                        placeholderText={infoRev ? user?.email : `......@${user?.email?.split('@')[1]}`}
                        editable={false}
                        styleView={{width: '95%'}}
                        styleTxt={{paddingLeft: 10, fontSize: 16}}
                        styleInput={{backgroundColor: theme.uiBackground, borderColor: theme.uiBackground, fontSize: 14 }}
                    />
                    <UserEditLine
                        title={'Account ID:'}
                        placeholderText={infoRev ? user?.$id : `${user?.$id?.slice(0, 4)}......${user?.$id?.slice(-4)}`}
                        editable={false}
                        styleView={{width: '95%'}}
                        styleTxt={{paddingLeft: 10, fontSize: 16}}
                        styleInput={{backgroundColor: theme.uiBackground, borderColor: theme.uiBackground, fontSize: 14 }}
                    />
                    <UserEditLine
                        title={'Account Creation Date:'}
                        placeholderText={infoRev ? user?.$createdAt?.split('T')[0] : `${user?.$createdAt?.slice(0, 4)}-MM-DD`}
                        editable={false}
                        styleView={{width: '95%'}}
                        styleTxt={{paddingLeft: 10, fontSize: 16}}
                        styleInput={{backgroundColor: theme.uiBackground, borderColor: theme.uiBackground, fontSize: 14 }}
                    />
                    <Pressable
                        style={{borderBottomWidth: 1, borderColor: theme.text}}
                        onPress={() => {setInfoRev(!infoRev)}}
                    >
                        <ThemedText style={{fontStyle: 'italic'}}>
                            {infoRev ? 'Hide Account Information' : 'Reveal Account Information'}
                        </ThemedText>
                    </Pressable>

                    <Spacer height={30}/>

                    <ThemedText style={styles.heading}>
                        Account Options
                    </ThemedText>

                    <ThemedHr style={{marginVertical: 5}}/>

                    {/* button to open modal responsible for email update*/}
                    <ThemedButton
                        primary
                        style={{marginVertical: 8, width: '95%', height: '50'}}
                        onPress={() => {
                            resetEmailModal()
                            setChangeEmailWin(true)

                        }}>
                        <Text
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 500
                                }}
                        >
                            Change Email
                        </Text>
                    </ThemedButton>

                    {/* button to open modal responsible for password update*/}
                    <ThemedButton
                        primary
                        style={{marginVertical: 8, width: '95%', height: '50'}}
                        onPress={() => {
                            resetPasswordModal()
                            setChangePassWin(true)}}
                        >
                        <Text
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 500
                                }}
                        >
                            Change Password
                        </Text>
                    </ThemedButton>

                    <Spacer/>

                    <ThemedText style={[styles.heading, {marginBottom: 10}]}>
                        Logout
                    </ThemedText>

                    <ThemedHr style={{marginVertical: 15}}/>

                    {/* button to open modal responsible for logging user out*/}
                    <ThemedButton
                        style={{marginBottom:5, width: '60%', height: '50', backgroundColor: '#c05151'}}
                        onPress={() => {setLogWin(true)}}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 500}}>
                            Exit
                        </Text>
                    </ThemedButton>

                    <Spacer/>

                    <ThemedText style={[styles.heading, {marginBottom: 10}]}>
                        Terminate Account
                    </ThemedText>

                    <ThemedHr style={{marginBottom: 15}}/>

                    {/* button to open modal responsible for account termination*/}
                    <ThemedButton
                        warning
                        style={{marginBottom:5, width: '60%', height: '50'}}
                        onPress={() => {setDelWin(true)}}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 500}}>
                            DELETE ACCOUNT
                        </Text>
                    </ThemedButton>
                    <Spacer/>



                    {/* Modal which handles Email update process*/}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={changeEmailWin}
                    >
                        <View style={styles.centeredView}>
                            <View
                                style={[
                                    styles.modalView,
                                    {
                                        backgroundColor: theme.navBackground,
                                        borderColor: Colors.primary,
                                        paddingHorizontal: 15
                                    }
                                ]}
                            >
                                <ThemedText style={[styles.modalText, { fontSize: 25 }]}>
                                    Change Email
                                </ThemedText>

                                <UserEditLine
                                    title={'Email:'}
                                    placeholderText={'...'}
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    styleView={{height: 70}}
                                    styleTxt={{width: '25%'}}
                                    styleInput={{width: '70%', height: '80%'}}
                                />

                                <SecuredUserEditLine
                                    title="Password:"
                                    placeholderText="Confirm Password"
                                    value={emPass}
                                    onChangeText={(text) => setEmPass(text)}
                                    iconSize={16}
                                />

                                {/*error && <Text style={styles.error}>{(error?.message?.split(':')[1]) === undefined ? (error?.message?.split(':')[0]) : (error?.message?.split(':')[1])}</Text>*/}
                                {error && <Text style={styles.error}>{error}</Text>}


                                {/* button section with delete and cancel options */}
                                <ModalButtons
                                    styleSub={{backgroundColor: Colors.primary}}
                                    subText={'Change'}
                                    cancText={'Cancel'}
                                    onSubmit={handleUpdateEmail}
                                    onCancel={()=>{
                                        setChangeEmailWin(false)
                                        resetEmailModal()
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* Modal which handles Password update process*/}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={changePassWin}
                    >
                        <View style={styles.centeredView}>
                            <View
                                style={[
                                    styles.modalView,
                                    {
                                        backgroundColor: theme.navBackground,
                                        borderColor: Colors.primary,
                                        paddingHorizontal: 15
                                    }
                                ]}
                            >
                                <ThemedText style={[styles.modalText, { fontSize: 25 }]}>
                                    Change Password
                                </ThemedText>
                                <SecuredUserEditLine
                                    title={'Old\nPassword:'}
                                    placeholderText={"Old Password"}
                                    value={pass}
                                    onChangeText={(text) => setPass(text)}
                                    iconSize={16}
                                />
                                <SecuredUserEditLine
                                    title={'New\nPassword:'}
                                    placeholderText={"New Password"}
                                    value={newPass}
                                    onChangeText={(text) => setNewPass(text)}
                                    iconSize={16}
                                />
                                <SecuredUserEditLine
                                    title={'Confirm Password:'}
                                    placeholderText={"Confirm New Password"}
                                    value={newPassConf}
                                    onChangeText={(text) => setNewPassConf(text)}
                                    iconSize={16}
                                />

                                {/*error && <Text style={styles.error}>{(error.message === undefined) ? (error) : (error?.message?.split(':')[1]) === undefined ? (error?.message?.split(':')[0]) : (error?.message?.split(':')[1])}</Text>*/}
                                {error && <Text style={styles.error}>{error}</Text>}
                                {/* button section with delete and cancel options */}
                                <ModalButtons
                                    styleSub={{backgroundColor: Colors.primary}}
                                    subText={'Change'}
                                    cancText={'Cancel'}
                                    onSubmit={handleUpdatePass}
                                    onCancel={()=>{
                                        setChangePassWin(false)
                                        resetPasswordModal()

                                    }}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* Modal which handles Logout process*/}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={logWin}
                    >
                        <View style={styles.centeredView}>
                            <View
                                style={[
                                    styles.modalView,
                                    { backgroundColor: theme.navBackground, borderColor: Colors.primary }
                                ]}
                            >
                                <ThemedText style={[styles.modalText, { fontSize: 25, fontWeight: 800 }]}>
                                    Log Out?
                                </ThemedText>
                                {/* button section with delete and cancel options */}
                                <ModalButtons
                                    subText={'Log Out'}
                                    cancText={'Cancel'}
                                    onSubmit={logout}
                                    onCancel={()=>{setLogWin(false)}}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* Modal which handles Account termination*/}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={delWin}
                    >
                        <View style={styles.centeredView}>
                            <View
                                style={[
                                    styles.modalView,
                                    { backgroundColor: theme.navBackground, borderColor: Colors.warning }
                                ]}
                            >
                                <ThemedText style={[styles.modalText, { fontSize: 25, fontWeight: 800, color: Colors.warning }]}>
                                    Delete Account?
                                </ThemedText>
                                <ThemedText style={{fontStyle: 'italic', fontWeight: 500}}>
                                     This action is permanent.
                                </ThemedText>
                                <ThemedText style={{fontStyle: 'italic', marginBottom: 5}}>
                                     Both the account and its data will be deleted
                                </ThemedText>
                                {/* button section with delete and cancel options */}
                                <ModalButtons
                                    subText={'Delete'}
                                    cancText={'Cancel'}
                                    onSubmit={handleDeleteAcc}
                                    onCancel={()=>{setDelWin(false)}}
                                />
                            </View>
                        </View>
                    </Modal>


                    {/* Modal which announces successful (hopefully) account updates*/}
                    {announcement && <Modal
                        animationType={"slide"}
                        transparent={true}
                    >
                        <Pressable
                            style={{
                                height: '100%',
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => {setAnnouncement(null)}}>
                            <Text
                                style={styles.announcement}
                            >
                                {`\n${announcement} changed Succesfully!\n`}
                            </Text>
                        </Pressable>
                    </Modal>}
                </ThemedView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default Settings

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center'
    },
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 8,
        width: '95%',
        borderRadius: 6,
        height: 50
    },
    label: {
        fontSize: 16,
    },
// Modal related CSS
    centeredView: {
        flex: 1,
        //justifyContent: 'center',
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
// error
    error: {
        color: Colors.warning,
        padding: 10,
        backgroundColor: "#e2b3b3ff",
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 6,
        width:"95%"
    },
    announcement: {
        textAlign: 'center',
        color: Colors.primary,
        padding: 10,
        backgroundColor: "rgb(134, 194, 152)",
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 6,
        width:"70%",
    }
})