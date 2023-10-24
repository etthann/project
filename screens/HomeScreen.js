import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable, ScrollView, Modal } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import ProfileModal from '../components/ProfileModal';
import AddFriendModal from '../components/AddFriendModal';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {

    // Profile modal
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    // Friend modal
    const [friend, setFriend] = useState(false);
    const [openFriendModalValue, setOpenFriendModalValue] = useState(false);

    // Name and email values
    const [nameValue, setNameValue] = useState("");
    const [email, setEmail] = useState("");

    // User ID
    const [id, setId] = useState("");

    useEffect(() => {
        getData("name",setNameValue);
        console.log("Name value:", nameValue)
    }, [])

    

    // Get the user's ID
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setId(uid);
            }
        })
        // Get the user's name and email
        onValue(ref(db, `users/${id}`), (snapshot) => {
            const data = snapshot.val();
            setNameValue(data.name);
            setEmail(data.email);
            if (data.FriendId !== "") {
                setFriend(false);
            }
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            
            {/* Header section */}
            <View style={{ flexDirection: 'row' }}>
                <Text adjustsFontSizeToFit style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: '7%', left: '20%' }}>
                    Welcome {nameValue ? nameValue.charAt(0).toUpperCase() + nameValue.slice(1).toLowerCase() : ''}
                </Text>
                {/* Profile button to open the profile modal */}
                <TouchableOpacity style={{ top: '70%', left: '74%',position: 'absolute'}} onPress={() => {}}>
                    <Ionicons name = "notifications-outline" size = {35} color = "black"/>

                </TouchableOpacity>
                <TouchableOpacity style={{ top: '65%', left: '87%',position: 'absolute'}} onPress={() => { setProfileModalVisible(true) }}>
                    <ProfileModal profileModalVisible={profileModalVisible} setProfileModalVisible={setProfileModalVisible} navigation={navigation} name = {nameValue}/>
                    <Ionicons name="person-circle-outline" size={40} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'black', opacity: 0.5, top: '5%' }} />

            {/* Main content */}
            <View style={styles.card}>
                <View style={{ height: '100%' }}>
                    <TouchableOpacity style={styles.circle} onPress={() => { {!friend ? (setOpenFriendModalValue(true)) : (alert("You already have a friend"))}}}>
                        <AddFriendModal openFriendModalVisible={openFriendModalValue} setOpenFriendModalVisible={setOpenFriendModalValue} />
                        <Image source={require("../assets/favicon.png")} style={{ alignSelf: 'center', top: '30%' }} />
                    </TouchableOpacity>
                    {/* Contact friends and icons */}
                    <ContactFriend object={"heart"} method={placeholder} bordercolor={"red"} index={4} />
                    <ContactFriend object={"chatbox-outline"} method={placeholder} index={3} />
                    <ContactFriend object={"videocam-outline"} method={placeholder} index={2} />
                    <ContactFriend object={"call-outline"} method={placeholder} index={1} />

                    {/* Online status indicator */}
                    <OnlineIndicator />
                </View>
                <Text adjustsFontSizeToFit style={{ fontSize: 30, left: '12%', opacity: 0.5, bottom: '30%' }}>
                    Add Friend
                </Text>
            </View>
            <Text style={{ fontSize: 20, color: 'lightgrey', fontWeight: 'bold', alignSelf: 'center', top: '1%' }}>
                Discover:
            </Text>

            {/* Small widgets */}
            <View style={{ flexDirection: 'row' }}>
                <SmallWidget text={"Reminder:"} onPress={placeholder} iconName={"alarm-outline"} />
                <SmallWidget text={"Calendar:"} onPress={placeholder} iconName={"calendar-outline"} />
            </View>
            <View style={{ top: '10%' }}>
                <Text style={{ textAlign: 'center', top: '10%', color: 'lightgrey', }}>
                    This was made by: {''}
                </Text>
                <Text style={{ textAlign: 'center', color: 'lightgrey', fontWeight: 'bold', fontStyle: 'italic', }}>
                    Ethan Ieong
                </Text>
                <View style={{ flexDirection: 'row', left: '20%' }}>
                    <Text style={{ textAlign: 'center', color: 'lightgrey', fontWeight: 'bold', fontStyle: 'italic', left: '350%' }}>Github: </Text>
                    <Text style={{ textAlign: 'center', color: 'lightgrey', fontWeight: 'bold', fontStyle: 'italic', left: '350%' }}>https://github.com/etthann/ihateRN</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '80%',
        height: '30%',
        backgroundColor: 'lightblue',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: '5%',
        marginTop: '20%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    circle: {
        backgroundColor: 'white',
        width: '40%',
        height: '60%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 100,
        top: '3%',
        left: '3%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    smallWidget: {
        backgroundColor: 'pink',
        width: '35%',
        height: '110%',
        borderRadius: 10,
        left: '32%',
        top: '5%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginHorizontal: '4%',
    },
})

const placeholder = () => {
    console.log("hi")
}

const OnlineIndicator = () => {
    // State for online status
    const [isOnline, setIsOnline] = useState(false);

    // Check online status
    useEffect(() => {
        // Check online status
        const checkOnlineStatus = async () => {
            // Get the network state
            const netInfo = await NetInfo.fetch();
            // Set the online status
            setIsOnline(netInfo.isConnected);
        };

        // Check online status
        checkOnlineStatus();

        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            // Set the online status
            setIsOnline(state.isConnected);
        });

        return () => {
            // Unsubscribe from network state updates
            unsubscribe();
        };
    }, []);

    // Determine the dot color based on online status
    const dotColor = isOnline ? 'green' : 'grey';

    // Render the dot
    return <View style={[styles.dot, { backgroundColor: dotColor, width: '10%', height: '15.6%', borderRadius: 200, left: '30%', bottom: '105%', borderWidth: 1, top: '-11%' }]} />;
};

// Component for rendering contact icons
function ContactFriend({ method, object, bordercolor, index }) {
    const positionStyle = {
        position: 'absolute',
        bottom: `${index * 20 - 10}%`, // Adjust this value to space the icons vertically
        left: '80%',
    };

    return (
        <TouchableOpacity onPress={method} style={positionStyle}>
            <Ionicons name={object} size={40} color={bordercolor} />
        </TouchableOpacity>
    );
}


function SmallWidget({ text, onPress, iconName }) {
    return (
        <TouchableOpacity
            style={styles.smallWidget}
            onPress={onPress}
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold', padding: '10%' }}>
                {text}
            </Text>
            <Ionicons name={iconName} size={40} color="purple" style={{ alignSelf: 'center' }} />
        </TouchableOpacity>
    );
}

const getData = async (value, setNameValue) => {
    try {
        const val = await AsyncStorage.getItem(value);
        if (val !== null && val !== undefined) {
            setNameValue(val);
            console.log("Value retrieved from AsyncStorage:", val);
        } else {
            console.log("Value retrieved from AsyncStorage is null or undefined")
        }
    } catch (error) {
        console.log("Error while retrieving value from AsyncStorage:", error);
    }
}


const friendRequestNotification = async ({id}) => {
    onValue(ref(db,`users/${id}/incomingRequests`),(snapshot) => {
        const data = snapshot.val();
    })
}

function FriendRequests () {
    return (
        <Modal>
            
        </Modal>
    )
}