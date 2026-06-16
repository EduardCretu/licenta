import { StyleSheet, View, Switch, Text, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native'
// context-hook imports
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../contexts/ThemeContext'
import { useUser } from '../../contexts/UserContext'
import { useMedInfo } from '../../contexts/MedInfoContext'
import { useDepInfo } from '../../contexts/DependentInfoContext'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom component imports
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import UserEditLine from '../../components/UserEditLine'
import SecuredUserEditLine from '../../components/SecuredUserEditLine'
import ModalButtons from '../../components/ModalButtons'
import ThemedHr from '../../components/ThemedHr'
import ThemedDropdownComponent from "../../components/ThemedDropdown"
// color related imports
import { Colors } from '../../constants/colors'
import { langs } from '../../constants/dropdownFields'

// settings tab page tasked with handling account management
const Settings = () => {
    // context hook related consts
    const { t } = useTranslation()
    const { isDark, toggleTheme, theme, locale, changeLanguage } = useTheme()
    const { user, logout, deleteAccount, updateUserEmail, updateUserPassword } = useUser()
    const { deleteMedInfo, updateMedInfo, medInfo, fetchMedInfoById } = useMedInfo()
    const { deleteDepInfo, ensureDepInfo } = useDepInfo()
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
    // caregiver feature relate state consts
    const [isCaregiverEnabled, setIsCaregiverEnabled] = useState(medInfo?.isCaregiver)
    const [optInWin, setOptInWin] = useState(false)
    const [optOutWin, setOptOutWin] = useState(false)

    const [currentLang, setCurrentLang] = useState(locale)

    // CAREGIVER FEATURE RELATED

    // setting the email value to user's email on first render and every time user's email field changes.
    useEffect(()=>{
        setEmail(user?.email ?? '')
        //console.log(currentLanguage)
    },[user?.email])
    // .isCaregiver value & setting it to true/false exclusively
    useEffect(() => {
        setIsCaregiverEnabled(!!medInfo?.isCaregiver);
    }, [user?.isCaregiver]);

    // function to handle the Caregiver feature toggle switch.
    async function handleCaregiverToggle(nextValue) {
        if (!user?.$id) return;
        // TURNING ON
        // if the next value to be switched to is true, open Opt In Window and return
        if (nextValue) {
            setOptInWin(true);
            return;
        }
        // TURNING OFF
        // if the next value to be switched to is false, open Opt Out Window.
        setOptOutWin(true)
    }

    // Opt in function
    // Calls ensure function and created Dependents Row
    async function OptIn() {
        try {
            await updateMedInfo(user.$id, { isCaregiver: true });
            await ensureDepInfo(user.$id);
            await fetchMedInfoById(user.$id);

            setIsCaregiverEnabled(true);
            setOptInWin(false)
        } catch (err) {
            console.log(err.message);
            Alert.alert('Error', err.message);
        }
    }
    // Opt in function
    // Deletes user's Dependents Row
    async function OptOut() {
        try {
            await updateMedInfo(user.$id, { isCaregiver: false });
            await deleteDepInfo(user.$id);
            await fetchMedInfoById(user.$id);

            setIsCaregiverEnabled(false);
            setOptOutWin(false)
        } catch (err) {
            console.log(err.message);
            Alert.alert('Error', err.message);
        }
    }

    // USER ACCOUNT RELATED

    // function that handles account and row deletion
    async function handleDeleteAcc() {
        // if there is no user id return early
        // (kinda useless, but why not?)
        if (!user?.$id) {
            return
        }
        const IMG_KEY = `user_profile_image_${user.$id}`
        // try deleting
        try {
            // deleteing the user.id related img_key from storage
            await AsyncStorage.removeItem(IMG_KEY);
            await deleteMedInfo(user.$id);
            await deleteDepInfo(user.$id);
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
            setError(t("settings.errMsg.updateEmail.email"));
            return;
        }
        if (!emPass.trim()) {
            setError(t("settings.errMsg.updateEmail.passwd"));
            return;
        }
        // try updating && reset fields + set announcement for user
        try {
            await updateUserEmail(email.trim(), emPass);
            setChangeEmailWin(false);
            resetEmailModal();
            setAnnouncement(t("settings.announcements.prefix.email"))
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
            setError(t("settings.errMsg.updatePass.passwd"));
            return;
        }
        if (!newPass.trim() || !newPassConf.trim()) {
            setError(t("settings.errMsg.updatePass.newPasswd"));
            return;
        }
        if (newPass !== newPassConf) {
            setError(t("settings.errMsg.updatePass.passwdNoMatch"));
            return;
        }
        // try updating && reset fields + set announcement for user
        try {
            await updateUserPassword(pass, newPass);
            setChangePassWin(false);
            resetPasswordModal();
            setAnnouncement(t("settings.announcements.prefix.passwd"))
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
                        {t("settings.headers.pageName")}
                    </ThemedText>

                    <Spacer />

                    <ThemedText style={styles.heading}>
                        {t("settings.headers.appOpt")}
                    </ThemedText>

                    {/* Dark mode switch*/}
                    <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={[styles.label, {paddingLeft: 10}]}>
                            {isDark ? t("settings.darkMode.dark") : t("settings.darkMode.light")}
                        </ThemedText>

                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            thumbColor={isDark ? '#fff' : '#fff'}
                            trackColor={{ false: '#767577', true: Colors.primary }}
                        />
                    </View>

                    <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={[styles.label, {paddingLeft: 10}]}>
                            {t('current_language')}
                        </ThemedText>

                        <ThemedDropdownComponent
                            data={langs}
                            value={currentLang}
                            mode={'modal'}
                            onChange={(newValue, item) => {
                                setCurrentLang(newValue)
                                changeLanguage(newValue)
                            }}
                            styleDropdown={{width: '50%', padding: 0, marginRight:0}}
                            styleBaseContainer={{padding:5}}
                            stylePlaceholder={{paddingLeft: 20}}
                            styleSelectedText={{paddingLeft: 20}}
                        />
                    </View>


                    <ThemedText style={styles.heading}>{t("settings.headers.accInfo")}</ThemedText>

                    <ThemedHr style={{marginVertical: 5}}/>

                    {/*fields with user's account information*/}
                    <UserEditLine
                        title={t("settings.settingsFields.email")}
                        placeholderText={infoRev ? user?.email : `......@${user?.email?.split('@')[1]}`}
                        editable={false}
                        styleView={{width: '95%'}}
                        styleTxt={{paddingLeft: 10, fontSize: 16}}
                        styleInput={{backgroundColor: theme.uiBackground, borderColor: theme.uiBackground, fontSize: 14 }}
                    />
                    <UserEditLine
                        title={t("settings.settingsFields.accID")}
                        placeholderText={infoRev ? user?.$id : `${user?.$id?.slice(0, 4)}......${user?.$id?.slice(-4)}`}
                        editable={false}
                        styleView={{width: '95%'}}
                        styleTxt={{paddingLeft: 10, fontSize: 16}}
                        styleInput={{backgroundColor: theme.uiBackground, borderColor: theme.uiBackground, fontSize: 14 }}
                    />
                    <UserEditLine
                        title={t("settings.settingsFields.accDate")}
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
                            {infoRev ? t("settings.settingsFields.reveal.tru") : t("settings.settingsFields.reveal.fals")}
                        </ThemedText>
                    </Pressable>

                    <Spacer height={30}/>

                    <ThemedText style={styles.heading}>
                        {t("settings.headers.accOpt")}
                    </ThemedText>

                    <ThemedHr style={{marginVertical: 5}}/>

                    {/* button to open modal responsible for email update*/}
                    <View style={[styles.container, {backgroundColor: theme.uiBackground}]}>
                        <ThemedText style={[styles.label, {paddingLeft: 10, fontWeight: 600}]}>
                            {t("settings.settingsFields.caregiverReg")}
                        </ThemedText>

                        <Switch
                            value={isCaregiverEnabled}
                            onValueChange={handleCaregiverToggle}
                            thumbColor={isDark ? '#fff' : '#fff'}
                            trackColor={{ false: '#767577', true: Colors.primary }}
                        />
                    </View>
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
                            {t("settings.buttons.changeEmailBtn")}
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
                            {t("settings.buttons.changePasswdBtn")}
                        </Text>
                    </ThemedButton>

                    <Spacer/>

                    <ThemedText style={[styles.heading, {marginBottom: 10}]}>
                        {t("settings.headers.logout")}
                    </ThemedText>

                    <ThemedHr style={{marginVertical: 15}}/>

                    {/* button to open modal responsible for logging user out*/}
                    <ThemedButton
                        style={{marginBottom:5, width: '60%', height: '50', backgroundColor: '#c05151'}}
                        onPress={() => {setLogWin(true)}}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 500}}>
                            {t("settings.buttons.logoutBtn")}
                        </Text>
                    </ThemedButton>

                    <Spacer/>

                    <ThemedText style={[styles.heading, {marginBottom: 10}]}>
                        {t("settings.headers.terminate")}
                    </ThemedText>

                    <ThemedHr style={{marginBottom: 15}}/>

                    {/* button to open modal responsible for account termination*/}
                    <ThemedButton
                        warning
                        style={{marginBottom:5, width: '60%', height: '50'}}
                        onPress={() => {setDelWin(true)}}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 500}}>
                            {t("settings.buttons.terminateBtn")}
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
                                    {t("settings.modals.email.title")}
                                </ThemedText>

                                <UserEditLine
                                    title={t("settings.modals.email.email")}
                                    placeholderText={'...'}
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    styleView={{height: 70}}
                                    styleTxt={{width: '25%'}}
                                    styleInput={{width: '70%', height: '80%'}}
                                />

                                <SecuredUserEditLine
                                    title={t("settings.modals.email.passwd")}
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
                                    subText={t("common.change")}
                                    cancText={t("common.cancel")}
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
                                    title={t("settings.modals.passwd.oldPasswd")}
                                    placeholderText={"Old Password"}
                                    value={pass}
                                    onChangeText={(text) => setPass(text)}
                                    iconSize={16}
                                />
                                <SecuredUserEditLine
                                    title={t("settings.modals.passwd.newPasswd")}
                                    placeholderText={"New Password"}
                                    value={newPass}
                                    onChangeText={(text) => setNewPass(text)}
                                    iconSize={16}
                                />
                                <SecuredUserEditLine
                                    title={t("settings.modals.passwd.confirmPasswd")}
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
                                    subText={t("common.change")}
                                    cancText={t("common.cancel")}
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
                                    {t("settings.headers.logout")}
                                </ThemedText>
                                {/* button section with delete and cancel options */}
                                <ModalButtons
                                    subText={t("settings.buttons.logoutBtn")}
                                    cancText={t("common.cancel")}
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
                                    {t("settings.modals.delAcc.header")}
                                </ThemedText>
                                <ThemedText style={{fontStyle: 'italic', fontWeight: 500}}>
                                     {t("settings.modals.delAcc.title")}
                                </ThemedText>
                                <ThemedText style={{fontStyle: 'italic', marginBottom: 5}}>
                                     {t("settings.modals.delAcc.body")}
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
                                {`\n${announcement} ${t("settings.announcements.suffix")}!\n`}
                            </Text>
                        </Pressable>
                    </Modal>}

                    {/* Opt In Window: Modal which queries if user wants to Opt In*/}
                    <Modal
                        visible={optInWin}
                        transparent={true}
                        animationType={'slide'}
                    >
                        <View
                            style={{flex:1, justifyContent: 'center'}}
                        >
                            <View
                                style={[
                                    styles.modalView,
                                    { backgroundColor: theme.navBackground, borderColor: Colors.primary, borderWidth: 1 }
                                ]}
                            >
                                <View style={[styles.section, { backgroundColor: theme.navBackground }]}>
                                    <ThemedText title style={{ fontWeight: 'bold', fontSize: 20, color: Colors.primary }}>
                                        {t("settings.modals.caregiver.optIn.title")}
                                    </ThemedText>
                                    <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                                    <ThemedText title style={{fontSize: 16}}>
                                        {t("settings.modals.caregiver.optIn.body")}
                                    </ThemedText>
                                </View>
                                <ModalButtons
                                    styleSub={{backgroundColor: Colors.primary}}
                                    subText={t("settings.modals.caregiver.optIn.optInBtn")}
                                    cancText={t("common.cancel")}
                                    onSubmit={OptIn}
                                    onCancel={()=>{setOptInWin(false)}}

                                />
                            </View>
                        </View>
                    </Modal>
                    {/* Opt Out Window: Modal which queries if user wants to Opt Out*/}
                    <Modal
                        visible={optOutWin}
                        transparent={true}
                        animationType={'slide'}
                    >
                        <View
                            style={{flex:1, justifyContent: 'center'}}
                        >
                            <View
                                style={[
                                    styles.modalView,
                                    { backgroundColor: theme.navBackground, borderColor: Colors.warning, borderWidth: 1 }
                                ]}
                            >
                                <View style={[styles.section, { backgroundColor: theme.navBackground }]}>
                                    <ThemedText title style={{ fontWeight: 'bold', fontSize: 20, color: Colors.warning }}>
                                        {t("settings.modals.caregiver.optOut.title")}
                                    </ThemedText>
                                    <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                                    <ThemedText title style={{fontSize: 16}}>
                                        {t("settings.modals.caregiver.optOut.title")}
                                    </ThemedText>
                                    <ThemedText title style={{fontSize: 16, fontWeight: 600, fontStyle: 'italic', color: Colors.warning}}>
                                         {t("settings.modals.caregiver.optOut.warning")}
                                    </ThemedText>
                                </View>
                                <ModalButtons
                                    subText={t("settings.modals.caregiver.optOut.optOutBtn")}
                                    cancText={t("common.cancel")}
                                    onSubmit={OptOut}
                                    onCancel={()=>{setOptOutWin(false)}}
                                />
                            </View>
                        </View>
                    </Modal>
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
    section: {
          alignItems: 'center',
          textAlign: 'center',
          width: '90%',
          padding: 20,
          borderRadius: 6,
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
// error && announcement
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
    },
})