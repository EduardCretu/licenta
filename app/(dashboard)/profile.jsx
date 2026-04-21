import { StyleSheet, Text, View, Modal, ScrollView, Image, Pressable, Linking, Platform, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
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

import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

import { Ionicons } from '@expo/vector-icons'

// async storage consts
const DEFAULT_AVATAR = require('../../assets/img/default-avatar.png')
const DEFAULT_CONTACT = '+40756190779'



// Profile tab page handling displaying user info
const Profile = () => {
    // avatar related consts. Can you tell im adding them last?
    const [imageUri, setImageUri] = useState(null);
    const [imageError, setImageError] = useState(false);

    const [keyUp, setKeyUp] = useState(false)
    const screenHeight = Dimensions.get('window').height;

    const [location, setLocation] = useState('Pharmacy')

    // few state const. I should have probably used error, setError, but I could not be bothered
    const [editInfo, setEditInfo] = useState(false);
    const [errMessage, setErrMessage] = useState(null)

    const [showBaseInfo, setShowBaseInfo] = useState(true)
    const [showMidInfo, setShowMidInfo] = useState(false)
    const [showEndInfo, setShowEndInfo] = useState(false)

    const [showDeps, setShowDeps] = useState(false);
    const [depArr, setDepArr] = useState([]);
    const [dependent, setDependent] = useState('');

    const [selectedDep, setSelectedDep] = useState(null);
    const [depModalVisible, setDepModalVisible] = useState(false);

    // hooking the contexts
    const { user } = useUser();
    const { theme } = useTheme();
    const { medInfo, fetchMedInfoById, statelessFetchMedInfoById, updateMedInfo } = useMedInfo();
    const { depInfo, fetchDepInfoById, updateDepInfo } = useDepInfo()

    // formatting medInfo to be readable
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
    });

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
        fetchMedInfoById(user.$id);
        loadImage();
    }, [user?.$id, medInfo.isCaregiver]);

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
    }, [user?.$id, medInfo.isCaregiver]);

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
            CaregiverID: row?.CaregiverID ?? null
        });
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
                err += 'Emergency number format: (+)1234567890\n';
            }
        }
        // Launch Err
        if (err) {
            setErrMessage(err);
            return;
        }

        await updateMedInfo(user.$id, formData);
        setEditInfo(false);
        setErrMessage(false)
        setShowBaseInfo(true)
        setKeyUp(false);
        await fetchMedInfoById(user.$id);
    }

    // function to exit and cancel changes
    function handleCancelPress() {
        // close window, error and reset local obj data to fetched or null.
        setEditInfo(false)
        setErrMessage(false)
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

    async function callNumber() {
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

    // Care giver related Logic code.


    async function addDependent(DepID, currentDependents = []) {
        const safeDependents = Array.isArray(currentDependents) ? currentDependents : [];

        try {
            const DepRow = await statelessFetchMedInfoById(DepID);

            if (!DepRow) {
                return { ok: false, message: 'This user does not exist.' };
            }

            if (DepRow.CaregiverID !== user.$id) {
                return { ok: false, message: 'This user does not have you assigned as a caregiver.' };
            }

            if (safeDependents.some(dep => dep.id === DepID)) {
                return { ok: false, message: 'This dependent is already added.' };
            }

            const newDep = {
                id: DepID,
                name: DepRow.FullName ?? 'Unnamed',
            };

            const updated = [...safeDependents, newDep];

            await updateDepInfo(user.$id, {
                DependentIdArr: updated.map(dep => dep.id),
                DependentNameArr: updated.map(dep => dep.name),
            });

            return { ok: true, data: updated };
        } catch (err) {
            return { ok: false, message: err.message || 'Failed to add dependent.' };
        }
    }

    async function removeDependent(DepID, currentDependents = []) {
        const safeDependents = Array.isArray(currentDependents) ? currentDependents : [];

        try {
            if (!safeDependents.some(dep => dep.id === DepID)) {
                return { ok: false, message: 'Dependent was not found in your list.' };
            }

            const updated = safeDependents.filter(dep => dep.id !== DepID);

            await updateDepInfo(user.$id, {
                DependentIdArr: updated.map(dep => dep.id),
                DependentNameArr: updated.map(dep => dep.name),
            });

            return { ok: true, data: updated };
        } catch (err) {
            return { ok: false, message: err.message || 'Failed to remove dependent.' };
        }
    }

    async function handleAddDep(dep) {
        setErrMessage('');

        const cleanDep = dep.trim()

        const result = await addDependent(cleanDep, depArr);

        setDependent('');
        if (!result.ok) {
            setErrMessage(result.message);
            return;
        }

        setDepArr(result.data);
    }

    async function handleDelDep(depId) {
        setErrMessage('');

        const result = await removeDependent(depId, depArr);

        if (!result.ok) {
            setErrMessage(result.message);
            return;
        }

        setDepArr(result.data);
        setDepModalVisible(false);
        setSelectedDep(null);
    }

    async function fetchDeps() {
        try {
            const data = await fetchDepInfoById(user.$id);

            const ids = Array.isArray(data?.DependentIdArr) ? data.DependentIdArr : [];
            const names = Array.isArray(data?.DependentNameArr) ? data.DependentNameArr : [];

            const combined = ids.map((id, index) => ({
                id,
                name: names[index] ?? 'Unnamed',
            }));

            setDepArr(combined);
        } catch (err) {
            setErrMessage(err.message || 'Failed to load dependents.');
            setDepArr([]);
        }
    }

    const handleShowDeps = () => {
        setErrMessage('')
        setShowDeps(true)
    }

    const handleHideDeps = () => {
        setErrMessage('')
        setShowDeps(false)
        setDependent("")
    }

    async function handleOpenDependent(depId) {
        try {
            setErrMessage('')
            const depRow = await statelessFetchMedInfoById(depId);

            if (!depRow) {
                throw new Error('Dependent not found');
            }

            console.log(depRow)

            setSelectedDep(depRow);
            setDepModalVisible(true);
        } catch (err) {
            console.log(err.message);
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
                {/* user Header with username & avatar */}
                <View style={[styles.usernameSection, { flexDirection: 'row' }]}>

                    <Pressable onPress={pickImage}>
                        <Image source={
                            (imageUri && !imageError) ? { uri: imageUri } : DEFAULT_AVATAR }
                            style={styles.avatar}
                        />
                    </Pressable>

                    <View
                        style={{flexDirection: 'row'}}
                    >
                        <ThemedText
                            title
                            style={[
                                styles.heading,
                                {flexWrap:1}
                            ]}
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
                                }}
                            >
                                Caregiver
                            </Text>
                        }
                    </View>

                </View>

                <ThemedHr />

                {/*Beginning of user Info card */}
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
                                    See Self
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
                                    See Patients
                                </Text>
                            </ThemedButton>
                        </View>
                    }

                    <Spacer/>

                {!showDeps &&
                    <>
                        <View style={[styles.section, { backgroundColor: theme.navBackground }]}>
                            <ThemedText title style={{ fontWeight: 'bold', fontSize: 20 }}>
                                User Information
                            </ThemedText>
                            <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                            <Spacer height={20} />

                            {/* Well well well.. Anyway. Basic UserData Lines to display the medical information without a trillion lines of code in one page. Ergo, 'modularity' */}
                            {/*vvvvvvvvv To be automated and tied to user-info db/json */}
                            <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>Personal Information</ThemedText>
                            <UserDataLine title={'Full name'} userData={row?.FullName ?? '-'} />
                            <UserDataLine title={'Date of Birth'} userData={row?.DOB?.split('T')[0] ?? 'YYYY-MM-DD'} />
                            <UserDataLine title={'Address'} userData={row?.Address ?? '-'} />
                            <UserDataLine title={'Emergency Contact'} userData={row?.EmergNum ?? DEFAULT_CONTACT} />
                            <Spacer />
                            <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>Medical Information</ThemedText>
                            <UserDataLine title={'Blood Type'} userData={row?.BloodType ?? '-'} />
                            <UserDataLine title={'Genetic Conditions'} userData={row?.GeneticCond ?? '-'} />
                            <UserDataLine title={'Chronic Illness'} userData={row?.ChronicIll ?? '-'} />
                            <UserDataLine title={'Allergies'} userData={row?.Allergies ?? '-'} />
                            <UserDataLine title={'Medication'} userData={row?.Medications ?? '-'} />
                            <Spacer />
                            <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>Medical Records</ThemedText>
                            <UserDataLine title={'Recent Screening Date'} userData={row?.RecentScreenDate?.split('T')[0] ?? 'YYYY-MM-DD'} />
                            <UserDataLine title={'Recent Screening Info'} userData={row?.RecentScreenInfo ?? '-'} />
                            <UserDataLine title={'Caregiver ID'} userData={row?.CaregiverID ?? '-'} />
                        </View>


                        <Spacer />

                        {/* Button to 'handle the editing of user info */}
                        <ThemedButton primary onPress={handleEditPress}>
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 500, fontSize: 16 }}>
                                Edit health information?
                            </Text>
                        </ThemedButton>

                        <Spacer/>

                        {/*maps section of the profile tab*/}
                        <ThemedText
                            title
                            style={styles.heading}
                        >
                            Need to find assistance?
                        </ThemedText>
                        <View
                            style={{
                                flexDirection:'row',
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: theme.navBackground,
                                padding: 10,
                                borderRadius: 10,
                                margin: 10
                                }}
                        >
                            <ThemedButton
                                onPress={()=>{setLocation('Pharmacy')}}
                                style={[
                                    location === 'Pharmacy' ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                    {
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
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
                                    Pharmacy
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
                                    Hospital
                                </Text>
                            </ThemedButton>
                            <ThemedButton
                                onPress={()=>{setLocation('Clinic')}}
                                style={[
                                    location === 'Clinic' ? {backgroundColor: Colors.primary} : {backgroundColor: theme.buttonColor},
                                    {
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
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
                                    Clinic
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
                                    Find nearby {location}
                                </ThemedText>
                            </View>
                        </Pressable>

                        <Spacer/>

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
                                            Edit Health information
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
                                                    Personal Information
                                                </ThemedText>
                                            </Pressable>
                                            {showBaseInfo &&
                                                <>
                                                    <UserEditLine
                                                        title={'Full Name:'}
                                                        placeholderText={'...'}
                                                        value={formData.FullName}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, FullName: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Date of Birth:'}
                                                        placeholderText={'...'}
                                                        value={formData.DOB}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, DOB: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Address:'}
                                                        placeholderText={'...'}
                                                        value={formData.Address}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, Address: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Emergency Contact:'}
                                                        placeholderText={'...'}
                                                        value={formData.EmergNum}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, EmergNum: text }))}
                                                        setKey={setKeyUp}
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
                                                    Medical Information
                                                </ThemedText>
                                            </Pressable>
                                            {showMidInfo &&
                                                <>
                                                    <UserEditLine
                                                        title={'Blood Type:'}
                                                        placeholderText={'...'}
                                                        value={formData.BloodType}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, BloodType: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Genetic Conditions:'}
                                                        placeholderText={'...'}
                                                        value={formData.GeneticCond}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, GeneticCond: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Chronic Illnesses:'}
                                                        placeholderText={'...'}
                                                        value={formData.ChronicIll}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, ChronicIll: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Allergies: '}
                                                        placeholderText={'...'}
                                                        value={formData.Allergies}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, Allergies: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Medications:'}
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
                                                    Medical Records
                                                </ThemedText>
                                            </Pressable>
                                            {showEndInfo &&
                                                <>
                                                    <UserEditLine
                                                        title={'Last Screening Date:'}
                                                        placeholderText={'...'}
                                                        value={formData.RecentScreenDate}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, RecentScreenDate: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Last Screening Info:'}
                                                        placeholderText={'...'}
                                                        value={formData.RecentScreenInfo}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, RecentScreenInfo: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                    <UserEditLine
                                                        title={'Caregiver ID:'}
                                                        placeholderText={'...'}
                                                        value={formData.CaregiverID}
                                                        onChangeText={(text) => setFormData((prev) => ({ ...prev, CaregiverID: text }))}
                                                        setKey={setKeyUp}
                                                    />
                                                </>
                                            }
                                        </View>
                                        {/*error message displayed on inputting the wrong format in DOB and LSD */}
                                        {errMessage && <Text style={styles.error}>{errMessage}</Text>}

                                        {/*custom set of modal buttons. Way too unnecessary, but I proved to myself I can make them. */}
                                        <ModalButtons
                                            styleSub={{backgroundColor: Colors.primary}}
                                            subText={'Submit'}
                                            cancText={'Cancel'}
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

                        <ThemedText title style={[styles.heading, {marginVertical: 15}]}>
                            CALL EMERGENCY CONTACT
                        </ThemedText>


                        <ThemedButton
                            primary
                            style={{minWidth: '60%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                            onPress={callNumber}
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
                    </>
                }


                {showDeps &&
                    <>
                        <ThemedText title style={[styles.heading, {fontSize: 20, marginVertical: 5}]}>
                            Add Patient ID
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
                                    Add Patient
                                </Text>
                            </ThemedButton>
                        </View>

                        {errMessage && <Text style={styles.error}>{errMessage}</Text>}

                        <Spacer/>

                        <ThemedText title style={[styles.heading, {fontSize: 24, fontWeight: 800, marginBottom: 5}]}>
                            Patients
                        </ThemedText>

                        <ThemedHr/>

                        <Spacer/>

                        {depArr.length === 0 &&
                            <ThemedText>
                                No Patients...
                            </ThemedText>
                        }

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

                        <Modal
                            visible={depModalVisible}
                            transparent={true}
                            animationType={'slide'}
                        >
                            <View
                                style={{flex:1, justifyContent: 'center'}}
                            >
                                <View
                                    style={[
                                        styles.modalView,
                                        { backgroundColor: theme.navBackground, borderColor: Colors.primary }
                                    ]}
                                >
                                    <View style={[styles.section, { backgroundColor: theme.navBackground }]}>
                                        <ThemedText title style={{ fontWeight: 'bold', fontSize: 20 }}>
                                            {selectedDep?.FullName} Information
                                        </ThemedText>
                                        <ThemedHr width={'75%'} style={{borderWidth: 1.5, marginVertical: 5}}/>
                                        <Spacer height={20} />

                                        {/* Well well well.. Anyway. Basic UserData Lines to display the medical information without a trillion lines of code in one page. Ergo, 'modularity' */}
                                        {/*vvvvvvvvv To be automated and tied to user-info db/json */}
                                        <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>Personal Information</ThemedText>
                                        <UserDataLine title={'Full name'} userData={selectedDep?.FullName ?? '-'} />
                                        <UserDataLine title={'Date of Birth'} userData={selectedDep?.DOB?.split('T')[0] ?? 'YYYY-MM-DD'} />
                                        <UserDataLine title={'Address'} userData={selectedDep?.Address ?? '-'} />
                                        <UserDataLine title={'Emergency Contact'} userData={selectedDep?.EmergNum ?? DEFAULT_CONTACT} />
                                        <Spacer />
                                        <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>Medical Information</ThemedText>
                                        <UserDataLine title={'Blood Type'} userData={selectedDep?.BloodType ?? '-'} />
                                        <UserDataLine title={'Genetic Conditions'} userData={selectedDep?.GeneticCond ?? '-'} />
                                        <UserDataLine title={'Chronic Illness'} userData={selectedDep?.ChronicIll ?? '-'} />
                                        <UserDataLine title={'Allergies'} userData={selectedDep?.Allergies ?? '-'} />
                                        <UserDataLine title={'Medication'} userData={selectedDep?.Medications ?? '-'} />
                                        <Spacer />
                                        <ThemedText title style={{marginVertical:5, fontWeight: 500, fontSize: 16}}>Medical Records</ThemedText>
                                        <UserDataLine title={'Recent Screening Date'} userData={selectedDep?.RecentScreenDate?.split('T')[0] ?? 'YYYY-MM-DD'} />
                                        <UserDataLine title={'Recent Screening Info'} userData={selectedDep?.RecentScreenInfo ?? '-'} />
                                        <UserDataLine title={'Caregiver ID'} userData={selectedDep?.CaregiverID ?? '-'} />
                                    </View>

                                    <ModalButtons
                                        subText={'Remove User'}
                                        cancText={'Exit'}
                                        onSubmit={()=>{handleDelDep(selectedDep?.$id)}}
                                        onCancel={()=>{setDepModalVisible(false)}}

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
        borderRadius: 20,
        borderWidth:5,
    },
    mapView: {
        width: '100%',
        height: '20%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
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