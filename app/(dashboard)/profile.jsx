import { StyleSheet, Text, View, Modal, ScrollView, Image, Pressable, Linking, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, Alert } from 'react-native'
// imports related to avatar
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom component imports
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedView from '../../components/ThemedView'
import ThemedButton from '../../components/ThemedButton'
import ThemedHr from '../../components/ThemedHr'
import UserDataLine from '../../components/UserDataLine'
import UserEditLine from '../../components/UserEditLine'
import ModalButtons from '../../components/ModalButtons'
import SecuredUserEditLine from '../../components/SecuredUserEditLine'
// state, hooks and context imports
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useMedInfo } from '../../contexts/MedInfoContext'
import { useDepInfo } from '../../contexts/DependentInfoContext'
// color imports
import { Colors } from '../../constants/colors'
// import to immediately call Emergency Contact to skip verification
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
// pretty iconsm :)
import { Ionicons } from '@expo/vector-icons'

import { useTranslation } from 'react-i18next'

// Constants
const DEFAULT_AVATAR = require('../../assets/img/default-avatar.png')
const DEFAULT_CONTACT = '1120000000'

// Profile tab page handling displaying user info
const Profile = () => {
    // avatar related consts. Can you tell im adding them last?
    const [imageUri, setImageUri] = useState(null);
    const [imageError, setImageError] = useState(false);
    // consts related to virtual keyboard chicanery
    const [keyUp, setKeyUp] = useState(false)
    const screenHeight = Dimensions.get('window').height;
    // location button query const
    const [location, setLocation] = useState('Pharmacy')
    // few state const for showing & editing user information.
    // I should have probably used []error, setError], but I could not be bothered
    const [editInfo, setEditInfo] = useState(false);
    const [errMessage, setErrMessage] = useState(null)
    const [showBaseInfo, setShowBaseInfo] = useState(true)
    const [showMidInfo, setShowMidInfo] = useState(false)
    const [showEndInfo, setShowEndInfo] = useState(false)
    // Caregiver Feature Related Consts
    const [showDeps, setShowDeps] = useState(false);
    const [depArr, setDepArr] = useState([]);
    const [dependent, setDependent] = useState('');
    const [selectedDep, setSelectedDep] = useState(null);
    const [depModalVisible, setDepModalVisible] = useState(false);
    const [delDepWin, setDelDepWin] = useState(false)
    const [missingDep, setMissingDep] = useState(null)
    const [depNote, setDepNote] = useState('')
    const [showDepNote, setShowDepNote] = useState(false)
    const [depNoteSuccess, setDepNoteSuccess] = useState(false)
    // hooking the contexts and consuming them
    const { user } = useUser();
    const { theme } = useTheme();
    const { medInfo, fetchMedInfoById, statelessFetchMedInfoById, updateMedInfo } = useMedInfo();
    const { depInfo, fetchDepInfoById, updateDepInfo } = useDepInfo()
    // formatting medInfo to be readable (deprecated)
    const row = medInfo
    // making a data object to store our information
    // every row can take null, so null is the default value
    const [formData, setFormData] = useState({
        FullName: null,
        DOB: null,
        Address: null,
        BloodType: null,
        GeneticCond: null,
        ChronicIll: null,
        Allergies: null,
        Medications: null,
        RecentScreenDate: null,
        RecentScreenInfo: null,
        EmergNum: null,
        CaregiverID: null,
        CaregiverNote: null,
        PhoneNum: null,
    });

    const { t } = useTranslation()

    // quick little function to fetch saved image URI from storage
    const loadImage = async () => {
        const IMG_KEY = `user_profile_image_${user?.$id}`
        const saved = await AsyncStorage.getItem(IMG_KEY);
        if (saved) {
            setImageUri(saved);
        }
    };

    // function to pick user PFP with allowance for editing and set ratio of 1:1
    const pickImage = async () => {
        const IMG_KEY = `user_profile_image_${user?.$id}`
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        // if the process was not cancelled, store URI
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setImageError(false);
          setImageUri(uri);
          await AsyncStorage.setItem(IMG_KEY, uri);
        }
    };

    // our initial render, fetching the data from the DB ++ loading the user image
    // we use user.$id because a guest without an id cannot enter the dashboard
    // also since createRow wont let me do that otherwise
    useEffect(() => {
        // fetching the data
        fetchMedInfoById(user?.$id);
        loadImage();
    }, [user?.$id, medInfo?.isCaregiver]);
    // render for fetching DepRow. Only runs the fetch function if user's .isCaregiver is true.
    useEffect(() => {
        if(!row?.isCaregiver) {
            setShowDeps(false)
            setDepArr([]);
            setDepModalVisible(false);
            setSelectedDep(null);
            setDependent('');
            return
        }
        fetchDeps()
    }, [user?.$id, medInfo?.isCaregiver]);

    // another useEffect function
    useEffect(() => {
        // return early if there isnt a row. I can probably remove this safely now
        if (!row?.$id) {
            return;
        };
        // we set the local obj data to the DB data
        setFormData({
            FullName: row?.FullName ?? null,
            DOB: row?.DOB?.split('T')[0] ?? null,
            Address: row?.Address ?? null,
            EmergNum: row?.EmergNum ?? null,
            BloodType: row?.BloodType ?? null,
            GeneticCond: row?.GeneticCond ?? null,
            ChronicIll: row?.ChronicIll ?? null,
            Allergies: row?.Allergies ?? null,
            Medications: row?.Medications ?? null,
            RecentScreenDate: row?.RecentScreenDate?.split('T')[0] ?? null,
            RecentScreenInfo: row?.RecentScreenInfo ?? null,
            CaregiverID: row?.CaregiverID ?? null,
            CaregiverNote: row?.CaregiverNote ?? null,
            PhoneNum: row?.PhoneNum ?? null,
        });
        //console.log(formData)
        // repeat render when row.$id changes, ergo when user Changes.
    }, [row?.$id]);

    // function to handle the pressing of a button. why? because I intended to do something else with it but forgot
    // enjoy obscurity lmao
    function handleEditPress() {
        setEditInfo(true)
    }

    // function to handle the submission of data
    // almost all columns are 'text' type columns, so there is no need to thoroughly check
    async function handlerSubmitPress() {
        setErrMessage(null);
        let err = '';

        // Date validation
        if (formData.DOB && !isValidYYYYMMDD(formData.DOB)) {
            err += 'Date must be in YYYY-MM-DD format\n';
        }
        if (formData.RecentScreenDate && !isValidYYYYMMDD(formData.RecentScreenDate)) {
            err += 'Last Screening Date must be in YYYY-MM-DD format\n';
        }
        // Emergency number validation
        if (formData.EmergNum) {
            const phoneRegex = /^[0-9+]+$/;
            if (!phoneRegex.test(formData.EmergNum.trim())) {

                err += 'Please enter a valid Emergency number: (+)1234567890\n';
            }
        }
        if (formData.PhoneNum) {
            const phoneRegex = /^\+?[1-9]\d{7,14}$/;
            if (!phoneRegex.test(formData.PhoneNum.trim())) {
                err += 'Please enter a valid phone number: (+)1234567890\n';
            }
        }
        // CaregiverID validation
        // Only accept strict 20 char length, exactly one (1) ID
        if (formData.CaregiverID) {
            const trimmed = formData.CaregiverID.trim();
            if (trimmed.length !== 20) {
                err += 'Caregiver ID must be exactly 20 characters\nOnly one Caregiver ID can be active at one time\n';
            }
            // overwrite with trimmed value so DB never gets whitespace ' '
            formData.CaregiverID = trimmed;
        }
        // Launch Err into stratosphere
        if (err) {
            setErrMessage(err);
            return;
        }
        // attempt update if everything is in order.
        await updateMedInfo(user.$id, formData);
        setEditInfo(false);
        setErrMessage(false)
        setShowBaseInfo(true)
        setShowMidInfo(false)
        setShowEndInfo(false)
        setKeyUp(false);
        // refetch data.
        await fetchMedInfoById(user.$id);
    }

    // function to exit and cancel changes
    function handleCancelPress() {
        // close window, error and reset local obj data to fetched or null.
        setEditInfo(false)
        setErrMessage(false)
        setShowBaseInfo(true)
        setShowMidInfo(false)
        setShowEndInfo(false)
        setKeyUp(false)
        setShowBaseInfo(true)
        setFormData({
            FullName: row?.FullName ?? null,
            DOB: row?.DOB?.split('T')[0] ?? null,
            Address: row?.Address ?? null,
            EmergNum: row?.EmergNum ?? null,
            BloodType: row?.BloodType ?? null,
            GeneticCond: row?.GeneticCond ?? null,
            ChronicIll: row?.ChronicIll ?? null,
            Allergies: row?.Allergies ?? null,
            Medications: row?.Medications ?? null,
            RecentScreenDate: row?.RecentScreenDate?.split('T')[0] ?? null,
            RecentScreenInfo: row?.RecentScreenInfo ?? null,
            CaregiverID: row?.CaregiverID ?? null,
            CaregiverNote: row?.CaregiverNote ?? null,
            PhoneNum: row?.PhoneNum ?? null,
        });
    }

    // function to validate date format
    function isValidYYYYMMDD(str) {
        // must match exact format :p
        if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            return false;
        }

        // split the string at each dash (-) and store in consts
        const [year, month, day] = str.split('-').map(Number);

        // basic ranges && comparison
        if (year < 1900 || year > 2100) return false; // optional, adjust if needed
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        // if all good, return true
        return true;
    }

    // little function which redirects user toward maps with a query
    async function openMaps() {
        // console.log(Platform.OS)
        // check if user is on IOS or android and adjust query accordingly
        const url = Platform.OS === 'ios' ? `http://maps.apple.com/?q=${location}` : `https://www.google.com/maps/search/?api=1&query=${location}`;
        try {
            await Linking.openURL(url);
        }
        catch (err) {
            console.log(err)
        }
    };

    // function to call emergency contact or DEFAULT
    async function callEmergNumber() {
        try {
            await RNImmediatePhoneCall.immediatePhoneCall(
                row?.EmergNum?.trim() || DEFAULT_CONTACT
            );
            console.log('Call commencing')
        }
        catch (err) {
            console.log('call failed', err)
        }
    };

    async function callNumber(number) {
            try {
                await RNImmediatePhoneCall.immediatePhoneCall(number);
                console.log('Call commencing')
            }
            catch (err) {
                console.log('call failed', err)
            }
        };

    // CAREGIVER FEATURE RELATED

    // function to add a dependent ID and name to table
    async function addDependent(DepID, currentDependents = []) {
        // checking if given param is array otherwise using empty array
        const safeDependents = Array.isArray(currentDependents) ? currentDependents : [];

        try {
            // attempt stateless call to return data to DepRow const only.
            const DepRow = await statelessFetchMedInfoById(DepID);
            // filtering errors and returning objects for handler
            if (!DepRow) {
                return { ok: false, message: 'This user does not exist.' };
            }
            if (DepRow.CaregiverID !== user.$id) {
                return { ok: false, message: 'This user does not have you assigned as a caregiver.' };
            }
            if (safeDependents.some(dep => dep.id === DepID)) {
                return { ok: false, message: 'This dependent is already added.' };
            }
            // creating new Dependent object with given ID and extracted FullName
            const newDep = {
                id: DepID,
                name: DepRow.FullName ?? 'Unnamed',
            };
            // appending object to array
            const updated = [...safeDependents, newDep];
            //attempting update to append ID & name references.
            await updateDepInfo(user.$id, {
                DependentIdArr: updated.map(dep => dep.id),
                DependentNameArr: updated.map(dep => dep.name),
            });
            // return object with true for handler
            return { ok: true, data: updated };
        } catch (err) {
            return { ok: false, message: err.message || 'Failed to add dependent.' };
        }
    }
    // function to remove Dependent record from user's dep row
    async function removeDependent(DepID, currentDependents = []) {
        // checking if given param is array otherwise using empty array
        const safeDependents = Array.isArray(currentDependents) ? currentDependents : [];

        try {
            // filtering and returning obj for handler
            if (!safeDependents.some(dep => dep.id === DepID)) {
                return { ok: false, message: 'Dependent was not found in your list.' };
            }
            // removing the dependent from local array
            const updated = safeDependents.filter(dep => dep.id !== DepID);
            // attempt update with new, filtered array
            await updateDepInfo(user.$id, {
                DependentIdArr: updated.map(dep => dep.id),
                DependentNameArr: updated.map(dep => dep.name),
            });
            // return object for handler
            return { ok: true, data: updated };
        } catch (err) {
            return { ok: false, message: err.message || 'Failed to remove dependent.' };
        }
    }

    // handler for addDependent function
    async function handleAddDep(dep) {
        // setting error
        setErrMessage('');
        // trimming dep for whitespaces so DB gets clean ID reference.
        const cleanDep = dep.trim()
        // calling addDependent
        const result = await addDependent(cleanDep, depArr);
        // clearing textInput
        setDependent('');
        //if result obj with key 'ok' is false, set error and return early
        if (!result.ok) {
            setErrMessage(result.message);
            return;
        }
        //set updated array
        setDepArr(result.data);
    }

    // handler for removeDependent function
    async function handleDelDep(depId) {
        setErrMessage('');
        const result = await removeDependent(depId, depArr);
        //if result obj with key 'ok' is false, set error and return early
        if (!result.ok) {
            setErrMessage(result.message);
            return;
        }
        // se updated array and reset relevant states
        setDepArr(result.data);
        setDepModalVisible(false);
        setSelectedDep(null);
        setDelDepWin(false);
        setMissingDep(null);
    }

    // function to fetch IDs & names of dependents
    async function fetchDeps() {
        try {
            // get data from Dep table
            const data = await fetchDepInfoById(user.$id);
            // ensure ids and names are arrays and assign to consts
            const ids = Array.isArray(data?.DependentIdArr) ? data.DependentIdArr : [];
            const names = Array.isArray(data?.DependentNameArr) ? data.DependentNameArr : [];
            // create object out of arrays
            const combined = ids.map((id, index) => ({
                id,
                name: names[index] ?? 'Unnamed',
            }));
            // set depArr to array of combined objects
            setDepArr(combined);
        } catch (err) {
            setErrMessage(err.message || 'Failed to load dependents.');
            setDepArr([]);
        }
    }
    // little consts to handle 'switching tabs'
    const handleShowDeps = () => {
        setErrMessage('')
        setShowDeps(true)
    }
    const handleHideDeps = () => {
        setErrMessage('')
        setShowDeps(false)
        setDependent("")
    }

    // function to fetch chosen Dependents data for viewing.
    async function handleOpenDependent(depId) {
        try {
            setErrMessage('');
            // attempt to fetch from MedInfo with stateless
            const depRow = await statelessFetchMedInfoById(depId);
            // open viewing window with relevant data
            setSelectedDep(depRow);
            setDepModalVisible(true);
        } catch (err) {
            // if user no longer exists, offer option to remove from row array
            const missing = depArr.find(dep => dep.id === depId) ?? {
                id: depId,
                name: 'this dependent',
            }
            setMissingDep(missing);
            setDelDepWin(true);
        }
    }

    async function handleSendNote(ID) {
        try {
            await updateMedInfo(ID, {CaregiverNote: depNote})
            setDepNote('')
            setShowDepNote(false)
            setDepNoteSuccess(true)
        }
        catch (err) {
            console.log(err.message)
        }
    }
    async function handleClearNote(ID) {
        try {
            await updateMedInfo(ID, {CaregiverNote: null})
            await fetchMedInfoById(ID)
        }
        catch (err) {
            console.log(err.message)
        }
    }


    // the components itself, should probs add a ScrollView
    return (
        <ScrollView
            style={{backgroundColor: theme.background, width: '100%', flex: 1 }}
            // vvv another coconut.png
            contentContainerStyle={{alignItems: 'center'}}
            endFillColor={theme.background}
            showsVerticalScrollIndicator={false}
        >
            <ThemedView safe style={styles.container}>
                <Spacer />
                {/* user Header with username & avatar & badge*/}
                <View style={[styles.usernameSection, { flexDirection: 'row' }]}>

                    <Pressable onPress={pickImage}>
                        <Image source={
                            (imageUri && !imageError) ? { uri: imageUri } : DEFAULT_AVATAR }
                            style={styles.avatar}
                        />
                    </Pressable>

                    <View
                        style={{flexDirection: 'row', flex: 1}}
                    >
                        <ThemedText
                            title
                            style={[
                                styles.heading,
                                {
                                    flexShrink: 1,
                                    minWidth: 0,
                                }
                            ]}
                        numberOfLines={2}
                        >
                            {user.email}
                        </ThemedText>
                        {row?.isCaregiver &&
                            <Text
                                style={{
                                    marginLeft: 10,
                                    color: Colors.primary,
                                    fontWeight: 800,
                                    padding: 4,
                                    backgroundColor: 'rgba(10, 114, 41, 0.15)',
                                    borderWidth: 2,
                                    borderColor: Colors.primary,
                                    borderRadius: 10,
                                    textAlign: 'center',
                                    alignSelf: 'center'
                                }}
                            >
                                {t('profile.badge')}
                            </Text>
                        }
                    </View>

                </View>

                <ThemedHr />

                {/*Profile tabs, only visible if .isCaregiver is true */}
                    {row?.isCaregiver &&
                        <View
                            style={{
                                backgroundColor: theme.navBackground,
                                flexDirection: 'row',
                                justifyContent:'center',
                                width: '90%',
                                marginBottom: 10

                            }}
                        >
                            <ThemedButton
                                style={[
                                    !showDeps ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                    {
                                        width:'50%',
                                        borderRadius: 0,
                                        borderBottomLeftRadius: 6,
                                        paddingVertical: 10,
                                    }
                                    ]}
                                onPress={handleHideDeps}
                            >
                                <Text
                                    style={[
                                        !showDeps ? {color: 'white', fontWeight: 500} : {color: theme.text, fontWeight: 400},
                                        {
                                            textAlign: 'center',
                                            fontSize: 16
                                        }
                                    ]}
                                >
                                    {t('profile.caregiverTabs.selfTab')}
                                </Text>
                            </ThemedButton>
                            <ThemedButton
                                style={[
                                      showDeps ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                      {
                                          width: '50%',
                                          borderRadius: 0,
                                          borderBottomRightRadius: 6,
                                          paddingVertical: 10,
                                      }
                                      ]}
                                onPress={handleShowDeps}
                            >
                                <Text
                                    style={[
                                        showDeps ? {color: 'white', fontWeight: 500} : {color: theme.text, fontWeight: 400},
                                        {
                                            textAlign: 'center',
                                            fontSize: 16
                                        }
                                    ]}
                                >
                                    {t('profile.caregiverTabs.patientTab')}
                                </Text>
                            </ThemedButton>
                        </View>
                    }

                    <Spacer/>
                {/* beginning of render for 'self' page. Renders: user info, map launcher, emergency number, and all relevant modal windows. */}
                {!showDeps &&
                    <>
                        <View style={[styles.section, { backgroundColor: theme.navBackground }]}>
                            <ThemedText title style={{ fontWeight: 'bold', fontSize: 20 }}>
                                {t('profile.infoTable.headers.userInfo')}
                            </ThemedText>
                            <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                            <Spacer height={20} />

                            {/* Well well well.. Anyway. Basic UserData Lines to display the medical information without a trillion lines of code in one page. Ergo, 'modularity' */}
                            {/*vvvvvvvvv To be automated and tied to user-info db/json */}
                            <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.persInfo')}</ThemedText>
                            <UserDataLine title={t('profile.infoTable.fields.fullName')} userData={row?.FullName ?? '-'} topBorder/>
                            <UserDataLine title={t('profile.infoTable.fields.DOB')} userData={row?.DOB?.split('T')[0] ?? 'YYYY-MM-DD'} />
                            <UserDataLine title={t('profile.infoTable.fields.address')} userData={row?.Address ?? '-'} />
                            <UserDataLine title={t('profile.infoTable.fields.personalNum')} userData={row?.PhoneNum ?? '-'} placeholderText={'-'}/>
                            <UserDataLine title={t('profile.infoTable.fields.emergNum')} userData={row?.EmergNum ?? DEFAULT_CONTACT} placeholderText={DEFAULT_CONTACT} bottomBorder/>
                            <Spacer height={20}/>
                            <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.medInfo')}</ThemedText>
                            <UserDataLine title={t('profile.infoTable.fields.bloodType')} userData={row?.BloodType ?? '-'} topBorder />
                            <UserDataLine title={t('profile.infoTable.fields.genCond')} userData={row?.GeneticCond ?? '-'} />
                            <UserDataLine title={t('profile.infoTable.fields.chronIll')} userData={row?.ChronicIll ?? '-'} />
                            <UserDataLine title={t('profile.infoTable.fields.allergies')} userData={row?.Allergies ?? '-'} />
                            <UserDataLine title={t('profile.infoTable.fields.medication')} userData={row?.Medications ?? '-'} bottomBorder />
                            <Spacer height={20}/>
                            <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.medRecs')}</ThemedText>
                            <UserDataLine title={t('profile.infoTable.fields.RSD')} userData={row?.RecentScreenDate?.split('T')[0] ?? 'YYYY-MM-DD'} topBorder />
                            <UserDataLine title={t('profile.infoTable.fields.RSI')} userData={row?.RecentScreenInfo ?? '-'} />
                            <UserDataLine title={t('profile.infoTable.fields.caregiverID')} userData={row?.CaregiverID ?? '-'} bottomBorder={!(medInfo?.CaregiverID?.trim() && medInfo?.CaregiverNote?.trim())} />
                            {(medInfo?.CaregiverID?.trim() && medInfo?.CaregiverNote?.trim()) && <UserDataLine title={t('profile.infoTable.fields.careNote')} userData={row?.CaregiverNote ?? '-'} bottomBorder />}
                        </View>


                        <Spacer />

                        {/* Button to 'handle the editing of user info */}
                        <ThemedButton primary onPress={handleEditPress}>
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 500, fontSize: 16 }}>
                                {t('profile.buttons.editBtn')}
                            </Text>
                        </ThemedButton>

                        <Spacer/>

                        {/*maps section of the profile tab*/}
                        <ThemedText
                            title
                            style={styles.heading}
                        >
                            {t('profile.headers.assistPrompt')}
                        </ThemedText>
                        <View
                        style={[styles.mapsPressableBtns, {backgroundColor: theme.navBackground}]}
                        >
                            <ThemedButton
                                onPress={()=>{setLocation('Pharmacy')}}
                                style={[
                                    location === 'Pharmacy' ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                    {
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        width:'33%',
                                        paddingHorizontal: 0
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        location === 'Pharmacy' ? {color: 'white'
                                            , fontWeight: 500} : {color: theme.text, fontWeight: 400} ,
                                        {
                                            fontSize: 16,
                                            textAlign: 'center'
                                        }
                                    ]}
                                >
                                    {t('profile.buttons.pharmBtn')}
                                </Text>
                            </ThemedButton>

                            <ThemedButton
                                onPress={()=>{setLocation('Hospital')}}
                                style={[
                                    location === 'Hospital' ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                    {
                                        borderRadius: 0,
                                        width:'33%',
                                        paddingHorizontal: 0
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        location === 'Hospital' ? {color: 'white', fontWeight: 500} : {color: theme.text, fontWeight: 400} ,
                                        {
                                            fontSize: 16,
                                            textAlign: 'center'
                                        }
                                    ]}
                                >
                                    {t('profile.buttons.hospitalBtn')}
                                </Text>
                            </ThemedButton>
                            <ThemedButton
                                onPress={()=>{setLocation('Clinic')}}
                                style={[
                                    location === 'Clinic' ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                    {
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        borderBottomRightRadius: 0,
                                        width:'33%',
                                        paddingHorizontal: 0
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        location === 'Clinic' ? {color: 'white', fontWeight: 500} : {color: theme.text, fontWeight: 400} ,
                                        {
                                            fontSize: 16,
                                            textAlign: 'center'
                                        }
                                    ]}
                                >
                                    {t('profile.buttons.clinicBtn')}
                                </Text>
                            </ThemedButton>
                        </View>

                        {/*Pressable Icon to send user to Maps app to find pharmacy/hospital/clinic*/}
                        <Pressable
                            onPress={openMaps}
                            style={[
                                styles.mapPressable,
                                {
                                    backgroundColor: theme.uiBackground,
                                    borderColor: theme.navBackground,
                                }]}
                        >
                            {location == 'Pharmacy' &&<Image
                                source={require('../../assets/img/mapsRedirectIcon.png')}
                                style={{height: '90%', width: '90%'}}
                            />}
                            {location == 'Hospital' &&<Image
                                source={require('../../assets/img/mapRedirectHospitalIcon.png')}
                                style={{height: '90%', width: '90%'}}
                            />}
                            {location == 'Clinic' &&<Image
                                source={require('../../assets/img/mapRedirectClinicIcon.png')}
                                style={{height: '90%', width: '90%'}}
                            />}
                            <View
                                style={[
                                    styles.mapView,
                                    {
                                        backgroundColor:theme.navBackground,
                                    }
                                ]}
                            >
                                <ThemedText
                                    style={styles.heading}
                                >
                                    {t('profile.misc.findEmbed')}
                                </ThemedText>
                            </View>
                        </Pressable>

                        <Spacer/>

                        {/* Emergency phone number section */}
                        <ThemedText title style={[styles.heading, {marginVertical: 15}]}>
                            {t('profile.headers.callPrompt')}
                        </ThemedText>

                        <ThemedButton
                            primary
                            style={{minWidth: '60%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                            onPress={callEmergNumber}
                        >
                            <Ionicons
                                size={38}
                                color={'white'}
                                name={'call'}
                            />
                            <Text title style={{color: 'white', fontWeight: 800, fontSize: 20}}>
                                 {row?.EmergNum?.trim() || DEFAULT_CONTACT}
                            </Text>
                        </ThemedButton>

                        {/* Beginning of 'Self' page modals */}

                        {/* Modal window for editing user medical information */}
                        <Modal
                            animationType={'slide'}
                            transparent={true}
                            visible={editInfo}
                            backdropColor={theme.navBackground}
                            //onRequestClose={() => {setEditInfo(!editInfo)}}
                        >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.centeredView}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* I wanted to make this as compact as <UserDataLine/> but failed miserably */}
                                    <View style={[styles.modalView, {backgroundColor: theme.navBackground}]}>
                                        <Text style={{ color: theme.text, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>
                                            {t('profile.buttons.editBtn')}
                                        </Text>
                                        <Spacer height={10}/>
                                        <View
                                            style={[styles.fieldView, {borderColor: theme.background, backgroundColor: theme.background}]}
                                        >
                                            <Pressable
                                                onPress={()=>setShowBaseInfo(!showBaseInfo)}
                                                style={styles.fieldDropdownBox}
                                            >
                                                <Ionicons
                                                    size={20}
                                                    color={theme.iconColor}
                                                    name={showBaseInfo ? 'chevron-up' : 'chevron-down'}
                                                />
                                                <ThemedText title style={{fontWeight:450}}>
                                                    {t('profile.infoTable.headers.userInfo')}
                                                </ThemedText>
                                            </Pressable>
                                            {showBaseInfo &&
                                                <>
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.fullName')}
                                                        placeholderText={'...'}
                                                        value={formData.FullName}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, FullName: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.DOB')}
                                                        placeholderText={'...'}
                                                        value={formData.DOB}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, DOB: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.address')}
                                                        placeholderText={'...'}
                                                        value={formData.Address}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, Address: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.personalNum')}
                                                        placeholderText={'...'}
                                                        value={formData.PhoneNum}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, PhoneNum: text }))}
                                                        setKey={setKeyUp}
                                                        maxLength={16}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.emergNum')}
                                                        placeholderText={'...'}
                                                        value={formData.EmergNum}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, EmergNum: text }))}
                                                        setKey={setKeyUp}
                                                        maxLength={16}
                                                    />
                                                </>
                                            }
                                        </View>
                                        <View
                                            style={[styles.fieldView, {borderColor: theme.background, backgroundColor: theme.background}]}
                                        >
                                            <Pressable
                                                onPress={()=>setShowMidInfo(!showMidInfo)}
                                                style={styles.fieldDropdownBox}
                                            >
                                                <Ionicons
                                                    size={20}
                                                    color={theme.iconColor}
                                                    name={showMidInfo ? 'chevron-up' : 'chevron-down'}
                                                />
                                                <ThemedText title style={{fontWeight:450}}>
                                                    {t('profile.infoTable.headers.medInfo')}
                                                </ThemedText>
                                            </Pressable>
                                            {showMidInfo &&
                                                <>
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.bloodType')}
                                                        placeholderText={'...'}
                                                        value={formData.BloodType}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, BloodType: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.genCond')}
                                                        placeholderText={'...'}
                                                        value={formData.GeneticCond}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, GeneticCond: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.chronIll')}
                                                        placeholderText={'...'}
                                                        value={formData.ChronicIll}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, ChronicIll: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.allergies')}
                                                        placeholderText={'...'}
                                                        value={formData.Allergies}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, Allergies: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.medication')}
                                                        placeholderText={'...'}
                                                        value={formData.Medications}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, Medications: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                </>
                                            }
                                        </View>
                                        <View
                                            style={[styles.fieldView, {borderColor: theme.background, backgroundColor: theme.background}]}
                                        >
                                            <Pressable
                                                onPress={()=>setShowEndInfo(!showEndInfo)}
                                                style={styles.fieldDropdownBox}
                                            >
                                                <Ionicons
                                                    size={20}
                                                    color={theme.iconColor}
                                                    name={showEndInfo ? 'chevron-up' : 'chevron-down'}
                                                />
                                                <ThemedText title style={{fontWeight:450}}>
                                                    {t('profile.infoTable.headers.medRecs')}
                                                </ThemedText>
                                            </Pressable>
                                            {showEndInfo &&
                                                <>
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.RSD')}
                                                        placeholderText={'...'}
                                                        value={formData.RecentScreenDate}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, RecentScreenDate: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.RSI')}
                                                        placeholderText={'...'}
                                                        value={formData.RecentScreenInfo}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, RecentScreenInfo: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={t('profile.infoTable.fields.caregiverID')}
                                                        placeholderText={'...'}
                                                        value={formData.CaregiverID}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, CaregiverID: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    {(medInfo?.CaregiverID?.trim() && medInfo?.CaregiverNote?.trim())  &&
                                                        <ThemedButton
                                                            primary
                                                            onPress={() => {handleClearNote(user?.$id)}}
                                                        >
                                                            <Text
                                                                style={{color: 'white', fontWeight: 600, fontSize: 16, textAlign: 'center'}}
                                                            >
                                                                {t("profile.buttons.clearCareNote")}
                                                            </Text>
                                                        </ThemedButton>
                                                    }
                                                </>
                                            }
                                        </View>
                                        {/*error message displayed on inputting the wrong format in DOB and LSD */}
                                        {errMessage && <Text style={styles.error}>{errMessage}</Text>}

                                        {/*custom set of modal buttons. Way too unnecessary, but I proved to myself I can make them. */}
                                        <ModalButtons
                                            styleSub={{backgroundColor: Colors.primary}}
                                            subText={t('common.submit')}
                                            cancText={t('common.cancel')}
                                            onSubmit={handlerSubmitPress}
                                            onCancel={handleCancelPress}
                                        />
                                    </View>
                                    {/* artificially adding and removing height so user can access every field*/}
                                    {keyUp && <Spacer height={screenHeight/2}/>}
                                </ScrollView>
                            </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </>
                }

                {/* Dependents tab section */}

                {showDeps &&
                    <>
                        {/* adding dependents by ID */}
                        <ThemedText title style={[styles.heading, {fontSize: 20, marginVertical: 5}]}>
                            {t('profile.headers.addPatID')}
                        </ThemedText>

                        <View
                            style={[styles.fieldDropdownBox, {justifyContent: 'center'}]}
                        >
                            <ThemedTextInput
                                style={{width: '60%', height: 55, marginRight: 10, paddingVertical: 0}}
                                placeholder={'...'}
                                value={dependent}
                                onChangeText={setDependent}
                            />
                            <ThemedButton
                                primary
                                style={{
                                    height: '95%',
                                }}
                                onPress={() => {
                                    setErrMessage('')
                                    if (!dependent.trim()) return;
                                    handleAddDep(dependent.trim());
                                }}
                            >
                                <Text
                                    style={{textAlign:'center', color: 'white', fontSize: 16, fontWeight: 600}}
                                >
                                    {t('profile.buttons.addPatientBtn')}
                                </Text>
                            </ThemedButton>
                        </View>
                        {/* rendering errors related to fetching */}
                        {errMessage && <Text style={styles.error}>{errMessage}</Text>}

                        <Spacer/>

                        {/* displaying 'patients' via expandable cards */}
                        <ThemedText title style={[styles.heading, {fontSize: 24, fontWeight: 800, marginBottom: 5}]}>
                            {t('profile.headers.patientHeader')}
                        </ThemedText>

                        <ThemedHr/>

                        <Spacer/>

                        {depArr.length === 0 &&
                            <ThemedText>
                                {t('profile.misc.noPatientsTxt')}
                            </ThemedText>
                        }

                        {/* maps all objects of depArr onto reusable card */}
                        {depArr?.map((dep, index) => (
                            <Pressable
                                key={dep.id}
                                onPress={() => handleOpenDependent(dep.id)}
                                style={[
                                    styles.card,
                                    {backgroundColor: theme.uiBackground, borderColor: theme.iconColor}
                                ]}
                            >
                                <ThemedText title style={styles.cardTitle}>
                                    #{index + 1} {dep.name}
                                </ThemedText>

                                <ThemedText>
                                    ID: {dep.id}
                                </ThemedText>
                            </Pressable>
                        ))}

                        {/* beginning of modal window section of 'Patients' tab */}

                        {/* Dependents Window modal. Displays all of selected dependents fetched information */}
                        <Modal
                            visible={depModalVisible}
                            transparent={true}
                            animationType={'slide'}
                        >
                            <ScrollView
                                style={{flex:1}}
                            >
                                <View
                                    style={[
                                        styles.modalView,
                                        { backgroundColor: theme.navBackground }
                                    ]}
                                >
                                    <View style={[styles.section, { backgroundColor: theme.navBackground, width: '100%', paddingHorizontal: 0 }]}>
                                        <ThemedText title style={{ fontWeight: 'bold', fontSize: 20 }}>
                                            {selectedDep?.FullName} {t('profile.infoTable.headers.namedInfo')}
                                        </ThemedText>
                                        <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                                        <Spacer height={20} />

                                        {/* Well well well.. Anyway. Basic UserData Lines to display the medical information without a trillion lines of code in one page. Ergo, 'modularity' */}
                                        {/*vvvvvvvvv To be automated and tied to user-info db/json */}
                                        <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.persInfo')}</ThemedText>
                                        <UserDataLine title={t('profile.infoTable.fields.fullName')} userData={selectedDep?.FullName ?? '-'} topBorder />
                                        <UserDataLine title={t('profile.infoTable.fields.DOB')} userData={selectedDep?.DOB?.split('T')[0] ?? 'YYYY-MM-DD'} />
                                        <UserDataLine title={t('profile.infoTable.fields.address')} userData={selectedDep?.Address ?? '-'} />
                                        <UserDataLine title={t('profile.infoTable.fields.personalNum')} userData={selectedDep?.PhoneNum ?? '-'} placeholderText={'-'}/>
                                        <UserDataLine title={t('profile.infoTable.fields.emergNum')} userData={selectedDep?.EmergNum ?? DEFAULT_CONTACT} placeholderText={DEFAULT_CONTACT} bottomBorder/>
                                        <Spacer height={20} />
                                        <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.medInfo')}</ThemedText>
                                        <UserDataLine title={t('profile.infoTable.fields.bloodType')} userData={selectedDep?.BloodType ?? '-'} topBorder />
                                        <UserDataLine title={t('profile.infoTable.fields.genCond')} userData={selectedDep?.GeneticCond ?? '-'} />
                                        <UserDataLine title={t('profile.infoTable.fields.chronIll')} userData={selectedDep?.ChronicIll ?? '-'} />
                                        <UserDataLine title={t('profile.infoTable.fields.allergies')} userData={selectedDep?.Allergies ?? '-'} />
                                        <UserDataLine title={t('profile.infoTable.fields.medication')} userData={selectedDep?.Medications ?? '-'} bottomBorder/>
                                        <Spacer height={20} />
                                        <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.medRecs')}</ThemedText>
                                        <UserDataLine title={t('profile.infoTable.fields.RSD')} userData={selectedDep?.RecentScreenDate?.split('T')[0] ?? 'YYYY-MM-DD'} topBorder />
                                        <UserDataLine title={t('profile.infoTable.fields.RSI')} userData={selectedDep?.RecentScreenInfo ?? '-'} />
                                        <UserDataLine title={t('profile.infoTable.fields.caregiverID')} userData={selectedDep?.CaregiverID ?? '-'} bottomBorder/>
                                    </View>

                                    <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.namedContact')} {selectedDep?.FullName}</ThemedText>

                                    <View
                                        style={[styles.fieldView, {borderColor: theme.background, backgroundColor: theme.background}]}
                                    >
                                        <Pressable
                                            onPress={()=>setShowDepNote(!showDepNote)}
                                            style={[styles.fieldDropdownBox]}
                                        >
                                            <Ionicons
                                                size={20}
                                                color={theme.iconColor}
                                                name={showDepNote ? 'chevron-up' : 'chevron-down'}
                                            />
                                            <ThemedText title style={{fontWeight:450}}>
                                                {t('profile.infoTable.headers.sendPatientNote')} {selectedDep?.FullName}
                                            </ThemedText>
                                        </Pressable>
                                        {showDepNote &&
                                            <>
                                                <UserEditLine
                                                    multiline
                                                    styleView={{height: 200}}
                                                    styleTxt={{width: '25%'}}
                                                    styleInput={{width: '70%', height: '95%', textAlignVertical: 'top'}}
                                                    title={`${t('profile.infoTable.headers.sendPatientNote')} ${selectedDep?.FullName}:`}
                                                    placeholderText={'...'}
                                                    value={depNote}
                                                    onChangeText={setDepNote}
                                                    //setKey={setKeyUp}
                                                />
                                                <ThemedButton
                                                    primary
                                                    onPress={() => {handleSendNote(selectedDep?.$id)}}
                                                >
                                                    <Text
                                                        style={{color: 'white', fontWeight: 600, fontSize: 16, textAlign: 'center'}}
                                                    >
                                                        {t('profile.buttons.sendNote')}
                                                    </Text>
                                                </ThemedButton>
                                            </>
                                        }
                                    </View>

                                    <View
                                        style={[
                                            styles.fieldView,
                                            {
                                                borderColor: theme.background,
                                                backgroundColor: theme.background,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingRight: 2
                                            }
                                        ]}
                                    >
                                        <ThemedText
                                            style={{fontSize: 15, fontWeight: 450, marginLeft: 10}}
                                        >
                                            {t('profile.infoTable.fields.callPatient')} {selectedDep?.FullName}
                                        </ThemedText>

                                        <ThemedButton
                                            primary
                                            disabled={!selectedDep?.PhoneNum?.trim()}
                                            style={[
                                                {
                                                    minWidth: '50%',
                                                    maxHeight: '95%',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    opacity: selectedDep?.PhoneNum?.trim() ? 1 : 0.6,
                                                }
                                            ]}
                                            onPress={()=>{callNumber(selectedDep?.PhoneNum)}}
                                        >
                                            <Ionicons
                                                size={24}
                                                color={'white'}
                                                name={'call'}
                                            />
                                            <Text title style={{color: 'white', fontWeight: 800, fontSize: 16}}>
                                                 {(selectedDep?.PhoneNum?.trim()) ? selectedDep?.PhoneNum : t('profile.misc.number404')}
                                            </Text>
                                        </ThemedButton>

                                    </View>


                                    {depNoteSuccess && <Modal
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
                                            onPress={() => {setDepNoteSuccess(false)}}>
                                            <Text
                                                style={styles.announcement}
                                            >
                                                {`\n${t('profile.successMsg.noteSentPrefix')} ${selectedDep?.FullName} ${t('profile.successMsg.noteSentSuffix')}\n`}
                                            </Text>
                                        </Pressable>
                                    </Modal>}


                                    <Spacer/>

                                    <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>{t('profile.infoTable.headers.recOptions')}</ThemedText>

                                    <ModalButtons
                                        subText={t('profile.buttons.rmUser')}
                                        cancText={t('common.exit')}
                                        onSubmit={()=>{handleDelDep(selectedDep?.$id)}}
                                        onCancel={()=>{setDepModalVisible(false)}}

                                    />

                                </View>
                            </ScrollView>
                        </Modal>

                        {/* modals to delete Dependent record from Dep table when dependent ID is not found in MedInfo table*/}
                        <Modal
                            visible={delDepWin}
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
                                            {t('profile.errMsg.missingPatTitle')}
                                        </ThemedText>
                                        <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                                        <ThemedText title style={{fontSize: 16}}>
                                            {t('profile.errMsg.missingPatBody')} "{missingDep?.name}"?
                                        </ThemedText>
                                    </View>
                                    <ModalButtons
                                        subText={t('common.del')}
                                        cancText={t('common.cancel')}
                                        onSubmit={()=>{handleDelDep(missingDep?.id)}}
                                        onCancel={()=>{setDelDepWin(false); setMissingDep(null)}}

                                    />

                                </View>
                            </View>
                        </Modal>
                    </>
                }
                <Spacer/>
            </ThemedView>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
// Basic CSS
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 10000,
        marginRight: 10,
    },
    usernameSection: {
        alignItems: 'center',
        textAlign: 'center',
        width: '85%',
        marginBottom: 20,
    },
    section: {
        alignItems: 'center',
        textAlign: 'center',
        width: '90%',
        padding: 20,
        borderRadius: 6,
    },
// Map Pressable CSS
    mapPressable: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 340,
        borderWidth:5,
    },
    mapsPressableBtns: {
        flexDirection:'row',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 6,
        paddingHorizontal:5,
        paddingBottom: 2,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        margin: 10,
        marginBottom: 0
    },
    mapView: {
        width: '101%',
        padding: 5
    },
// Modal Related CSS
    centeredView: {
        flex: 1,
        //justifyContent: 'center',
    },
    modalView: {
        margin: 10,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        elevation: 5,
    },
// ErrMessage related CSS
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
// DropDown CSS
    fieldDropdownBox: {
        width: '100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical: 10,
        paddingHorizontal: 10
    },
    fieldView: {
        borderWidth: 2,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 5
    },
// Profile Cards
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        width: '90%'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
})