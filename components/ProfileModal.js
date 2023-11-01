// Import necessary components and libraries
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { get, child, ref } from "firebase/database";

// Create the ProfileModal component
export default function ProfileModal({ profileModalVisible, setProfileModalVisible, navigation, name }) {
    // Initialize state for profile picture
    const [profilePicture, setProfilePicture] = useState("null");


    useEffect(() => {
        // Get the profile picture from the database
        get(child(ref(db), `users/${auth.currentUser.uid}/profilePicture`)).then((snapshot) => {
            if (snapshot.exists() && snapshot.val() !== "null") {
                setProfilePicture(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    // Function to pick an image from the device
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            allowsEditing: true,
            quality: 1,
        });

        // Update the profile picture if an image is selected
        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    }

    return (
        <Modal animationType="fade" transparent={true} visible={profileModalVisible} onRequestClose={() => setProfileModalVisible(false)}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                {/* Header section */}
                <View style={{ width: '100%', height: '20%', flexDirection: 'row', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: 'black' }}>
                    <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                        <Feather name="chevron-left" size={30} color="white" style={{ position: 'absolute', left: 10, top: 11 }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, left: '40%', top: '3%' }}>Profile</Text>
                </View>

                {/* Profile picture section */}
                <TouchableOpacity onPress={() => pickImage()} style={{ position: 'absolute', height: '13%', width: '25%', alignSelf: 'center', top: '10%' }}>
                    <View style={{ backgroundColor: 'pink', width: '100%', height: '100%', borderRadius: 25, alignSelf: 'center', top: '25%', position: 'absolute' }}>
                        {profilePicture !== "null" ? (
                            <Image source={{ uri: profilePicture }} style={{ width: '100%', height: '100%', borderRadius: 15, position: 'absolute' }} />
                        ) : (
                            <Ionicons name="md-person-outline" size={80} color="black" style={{ alignSelf: 'center', justifyContent: 'center', position: 'absolute' }} />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Profile information */}
                <Text style={{ fontSize: 20, textAlign: 'center', top: '8%' }}>{name}</Text>
                <Text style={{ top: '11%', left: '5%', marginBottom: '5%' }}>Account</Text>

                {/* Render profile options */}
                <ProfileOptions icon={'pencil-outline'} text={"Edit Profile"} />
                <ProfileOptions icon={"settings-outline"} text={"Settings"} />
                <ProfileOptions icon={"notifications-outline"} text={"Notifications"} />
                <ProfileOptions icon={"log-out-outline"} text={"Log Out"} onPress={() => LogOut({ navigation })} />
            </SafeAreaView>
        </Modal>
    );
}

// Component for rendering profile options
function ProfileOptions({ icon, text, onPress }) {
    return (
        <View style={{ top: '10%', marginBottom: '2%' }}>
            <TouchableOpacity style={{ width: '100%', height: 50 }} onPress={onPress}>
                <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={icon} size={30} style={{ marginLeft: 20, color: 'purple' }} />
                    <Text style={{ fontSize: 18, marginLeft: 20 }}>{text}</Text>
                    <Feather name="chevron-right" size={30} color="lightgrey" style={{ position: 'absolute', right: 20 }} />
                </View>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: 'black', alignSelf: 'flex-end', width: '84%' }} />
        </View>
    );
}

const LogOut = ({ navigation }) => {
    signOut(auth)
        .then(() => {
            console.log("Signed out");
            navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        });
}
