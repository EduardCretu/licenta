import { StyleSheet, Text, View, Modal, ScrollView, Image, Pressable, Linking, Platform } from 'react-native'
// imports related to avatar
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom component imports
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedView from '../../components/ThemedView'
import ThemedButton from '../../components/ThemedButton'
import ThemedHr from '../../components/ThemedHr'
import UserDataLine from '../../components/UserDataLine'
import UserEditLine from '../../components/UserEditLine'
import ModalButtons from '../../components/ModalButtons'
// state, hooks and context imports
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useMedInfo } from '../../contexts/MedInfoContext'
// color imports
import { Colors } from '../../constants/colors'

// async storage consts
const IMG_KEY = 'user_profile_image'
const DEFAULT_AVATAR = require('../../assets/img/default-avatar.png')



// Profile tab page handling displaying user info
const Profile = () => {
    // avatar related consts. Can you tell im adding them last?
    const [imageUri, setImageUri] = useState(null);
    const [imageError, setImageError] = useState(false);

    // few state const. I should have probably used error, setError, but I could not be bothered
    const [editInfo, setEditInfo] = useState(false);
    const [errMessage, setErrMessage] = useState(null)

    // hooking the contexts
    const { user } = useUser();
    const { theme } = useTheme();
    const { medInfo, fetchMedInfoById, updateMedInfo } = useMedInfo();

    // formatting medInfo to be readable
    const row = medInfo?.rows?.[0]

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
    });

    // quick little function to fetch saved image URI from storage
    const loadImage = async () => {
        const saved = await AsyncStorage.getItem(IMG_KEY);
        if (saved) {
            setImageUri(saved);
        }
    };

    // function to pick user PFP with allowance for editing and set ratio of 1:1
    const pickImage = async () => {
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
    }, []);

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
            BloodType: row?.BloodType ?? null,
            GeneticCond: row?.GeneticCond ?? null,
            ChronicIll: row?.ChronicIll ?? null,
            Allergies: row?.Allergies ?? null,
            Medications: row?.Medications ?? null,
            RecentScreenDate: row?.RecentScreenDate?.split('T')[0] ?? null,
            RecentScreenInfo: row?.RecentScreenInfo ?? null,
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
        // reset the error bool/message
        setErrMessage(null)
        // check DOB and LSD for non-null, invalid dates
        if (formData.DOB || formData.RecentScreenDate) {
            let err = '';
            if (formData.DOB && !isValidYYYYMMDD(formData.DOB)) {
                err += 'Date must be in YYYY-MM-DD format\n';
            }
            if (formData.RecentScreenDate && !isValidYYYYMMDD(formData.RecentScreenDate)) {
                err += 'Last Screening Date must be in YYYY-MM-DD format\n';
            }
            // return early ONLY if there are errors
            if (err) {
                setErrMessage(err);
                return;
            }
        }
        // call update function with params ID and data.
        await updateMedInfo(user.$id, formData)
        // close the edit window
        setEditInfo(false)
        // refetch row for updated content
        await fetchMedInfoById(user.$id)

    }

    // function to exit and cancel changes
    function handleCancelPress() {
        // close window, error and reset local obj data to fetched or null.
        setEditInfo(false)
        setErrMessage(false)
        setFormData({
            FullName: row?.FullName ?? null,
            DOB: row?.DOB?.split('T')[0] ?? null,
            Address: row?.Address ?? null,
            BloodType: row?.BloodType ?? null,
            GeneticCond: row?.GeneticCond ?? null,
            ChronicIll: row?.ChronicIll ?? null,
            Allergies: row?.Allergies ?? null,
            Medications: row?.Medications ?? null,
            RecentScreenDate: row?.RecentScreenDate?.split('T')[0] ?? null,
            RecentScreenInfo: row?.RecentScreenInfo ?? null,
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

    // little function which redirects user toward maps with a 'pharmacy' query
    const openMaps = async () => {
        // console.log(Platform.OS)
        // check if user is on IOS or android and adjust query accordingly
        const url = Platform.OS === 'ios' ? `http://maps.apple.com/?q=pharmacy` : `https://www.google.com/maps/search/?api=1&query=pharmacy`;
        try {
            await Linking.openURL(url);
        }
        catch (err) {
            console.log(err)
        }
    };


    // the components itself, should probs add a ScrollView
    return (
        <ThemedView safe style={styles.container}>
            <ScrollView
                style={{backgroundColor: theme.background, width: '100%', height: '100%' }}
                // vvv another coconut.png
                contentContainerStyle={{alignItems: 'center'}}
                endFillColor={theme.background}
                showsVerticalScrollIndicator={false}
            >
                <Spacer />
                {/* user Header with username & avatar */}
                <View style={[styles.usernameSection, { flexDirection: 'row' }]}>

                <Pressable onPress={pickImage}>
                    <Image source={
                        (imageUri && !imageError) ? { uri: imageUri } : DEFAULT_AVATAR }
                        style={styles.avatar}
                    />
                </Pressable>

                    <ThemedText title={true} style={styles.heading}>
                        {user.email}
                    </ThemedText>
                </View>

                <ThemedHr />

                <Spacer />

                {/*Beginning of user Info card */}
                <View style={[styles.section, { backgroundColor: theme.navBackground }]}>
                    <ThemedText title style={{ fontWeight: 'bold', fontSize: 20 }}>
                        User Information
                    </ThemedText>
                    <Spacer height={20} />

                    {/* Well well well.. Anyway. Basic UserData Lines to display the medical information without a trillion lines of code in one page. Ergo, 'modularity' */}
                    {/*vvvvvvvvv To be automated and tied to user-info db/json */}
                    <UserDataLine title={'Full name'} userData={row?.FullName ?? 'N/A'} />
                    <UserDataLine title={'Date of Birth'} userData={row?.DOB?.split('T')[0] ?? 'YYYY-MM-DD'} />
                    <UserDataLine title={'Address'} userData={row?.Address ?? 'N/A'} />
                    <Spacer />
                    <UserDataLine title={'Blood Type'} userData={row?.BloodType ?? 'N/A'} />
                    <UserDataLine title={'Genetic Conditions'} userData={row?.GeneticCond ?? 'N/A'} />
                    <UserDataLine title={'Chronic Illness'} userData={row?.ChronicIll ?? 'N/A'} />
                    <UserDataLine title={'allergies'} userData={row?.Allergies ?? 'N/A'} />
                    <UserDataLine title={'Medication'} userData={row?.Medications ?? 'N/A'} />
                    <Spacer />
                    <UserDataLine title={'Recent Screening Date'} userData={row?.RecentScreenDate?.split('T')[0] ?? 'YYYY-MM-DD'} />
                    <UserDataLine title={'Recent Screening Info'} userData={row?.RecentScreenInfo ?? 'N/A'} />
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
                    Need to get to a Pharmacy?
                </ThemedText>

                <Spacer/>

                {/*Pressable Icon to send user to Mapws app to find pharmacy*/}
                <Pressable
                    onPress={openMaps}
                    style={[
                        styles.mapPressable,
                        {
                            backgroundColor: theme.uiBackground,
                            borderColor: theme.navBackground,
                        }]}
                >
                    <Image
                        source={require('../../assets/img/mapsRedirectIcon.png')}
                        style={{height: '90%', width: '90%'}}
                    />
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
                            Find Nearby Pharmacies
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

                    <View style={styles.centeredView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* I wanted to make this as compact as <UserDataLine/> but failed miserably */}
                            <View style={[styles.modalView, {backgroundColor: theme.navBackground}]}>
                                <Text style={{ color: theme.text, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>
                                    Edit Health information
                                </Text>
                                <UserEditLine
                                    title={'Full Name:'}
                                    placeholderText={'N/A'}
                                    value={formData.FullName}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, FullName: text }))}
                                />
                                <UserEditLine
                                    title={'Date of Birth:'}
                                    placeholderText={'N/A'}
                                    value={formData.DOB}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, DOB: text }))}

                                />
                                <UserEditLine
                                    title={'Address:'}
                                    placeholderText={'N/A'}
                                    value={formData.Address}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, Address: text }))}
                                />
                                <Spacer height={20}/>
                                <UserEditLine
                                    title={'Blood Type:'}
                                    placeholderText={'N/A'}
                                    value={formData.BloodType}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, BloodType: text }))}
                                />
                                <UserEditLine
                                    title={'Genetic Conditions:'}
                                    placeholderText={'N/A'}
                                    value={formData.GeneticCond}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, GeneticCond: text }))}
                                />
                                <UserEditLine
                                    title={'Chronic Illnesses:'}
                                    placeholderText={'N/A'}
                                    value={formData.ChronicIll}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, ChronicIll: text }))}
                                />
                                <UserEditLine
                                    title={'Medications:'}
                                    placeholderText={'N/A'}
                                    value={formData.Medications}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, Medications: text }))}
                                />
                                <Spacer height={20}/>
                                <UserEditLine
                                    title={'Last Screening Date:'}
                                    placeholderText={'N/A'}
                                    value={formData.RecentScreenDate}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, RecentScreenDate: text }))}
                                />
                                <UserEditLine
                                    title={'Last Screening Info:'}
                                    placeholderText={'N/A'}
                                    value={formData.RecentScreenInfo}
                                    onChangeText={(text) => setFormData((prev) => ({ ...prev, RecentScreenInfo: text }))}
                                />

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
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>
        </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
// Basic CSS
    container: {
        flex: 1,
        //justifyContent: "center",
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
        height: 300,
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
        justifyContent: 'center',
    },
    modalView: {
        margin: 10,
        borderRadius: 20,
        padding: 15,
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
    }
})