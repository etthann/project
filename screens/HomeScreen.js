import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Modal,
    Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileModal from '../components/ProfileModal';
import AddFriendModal from '../components/AddFriendModal';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get, update, remove, child, set } from 'firebase/database';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export default function Home({ navigation }) {
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [friend, setFriend] = useState(false);
    const [openFriendModalValue, setOpenFriendModalValue] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [notificationModal, setNotificationModal] = useState(false);
    const [newNotification, setNewNotification] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendName, setFriendName] = useState('');
    const [friendProfilePicture, setFriendProfilePicture] = useState('');
    const [emojiRecieved, setEmojiRecieved] = useState('');
    const [emojiContainer, setEmojiContainer] = useState(false);
    const [id, setId] = useState('');
    const [friendId, setFriendId] = useState('');
    const [email, setEmail] = useState('');
    const [removeFriend, setRemoveFriend] = useState(false);
    const [friendProfile, setFriendProfile] = useState(false);


    // Get the user's ID
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setId(uid);
                // Now that we have the user's ID, fetch their data
                const userRef = ref(db, `users/${uid}`);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        // Update your state variables with the user's data
                        const userData = snapshot.val();
                        setNameValue(userData.name);
                        setEmail(userData.email);
                        if (userData.friendId) {
                            setFriend(true);
                            setFriendId(userData.friendId);
                        }
                    }
                });

                onValue(ref(db, `users/${uid}/emojiRecieved/emoji`), (snapshot) => {
                    if (snapshot.exists()) {
                        const emoji = snapshot.val();
                        setEmojiRecieved(emoji);
                    }
                });

                if (friend) {
                    onValue(ref(db, `users/${friendId}`), (snapshot) => {
                        if (snapshot.exists()) {
                            setFriendName(snapshot.val().name);
                            setFriendProfilePicture(snapshot.val().profilePicture);
                        }
                    });
                }
            }
        });

        // Clean up the subscription when the component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [friend, friendId]);  // Include friend and friendId in the dependency array





    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header section */}
            <View style={{ flexDirection: 'row' }}>
                <Text adjustsFontSizeToFit style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: '7%', left: '20%' }}>
                    Welcome {nameValue ? nameValue.charAt(0).toUpperCase() + nameValue.slice(1).toLowerCase() : ''}
                </Text>
                {/* Profile button to open the profile modal */}
                <TouchableOpacity style={{ top: '70%', left: '74%', position: 'absolute' }} onPress={() => { setNotificationModal(true) }}>
                    <FriendRequests
                        notificationModal={notificationModal}
                        setNotificationModal={setNotificationModal}
                        userId={id}
                        setFriendRequests={setFriendRequests}
                        friendRequests={friendRequests}
                        setFriend={setFriend}

                    />
                    {newNotification ? (
                        <View>
                            <Ionicons name="notifications-outline" size={35} color="black" />
                            <View style={{ width: '30%', height: '25%', borderRadius: 40, backgroundColor: 'red', bottom: '65%', left: '55%' }} />
                        </View>
                    ) : (
                        <Ionicons name="notifications-outline" size={35} color="black" />
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={{ top: '65%', left: '87%', position: 'absolute' }} onPress={() => { setProfileModalVisible(true) }}>
                    <ProfileModal profileModalVisible={profileModalVisible} setProfileModalVisible={setProfileModalVisible} navigation={navigation} name={nameValue} />
                    <Ionicons name="person-circle-outline" size={40} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'black', opacity: 0.5, top: '5%' }} />

            {/* Main content */}
            <View style={styles.card}>
                <View style={{ height: '100%' }}>
                    <TouchableOpacity style={styles.circle} onPress={() => { !friend ? setOpenFriendModalValue(true) : setFriendProfile(true) }}>
                        {RemoveFriend({ id, friendId, removeFriend, setRemoveFriend, friendProfile, setFriendProfile })}
                        <AddFriendModal openFriendModalVisible={openFriendModalValue} setOpenFriendModalVisible={setOpenFriendModalValue} />
                        {friend && friendProfilePicture !== "null" ? (
                            <Image source={{ uri: friendProfilePicture }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center' }} />
                        )
                            : friend && friendProfilePicture == "null" ? (
                                <Image source={require("../assets/default_pfp.png")} style={{ alignSelf: 'center', width: '100%', height: '100%', alignSelf: 'center', justifyContent: 'center', resizeMode: 'contain' }} />
                            ) : (<Image source={require("../assets/favicon.png")} style={{ alignSelf: 'center', top: '30%' }} />)
                        }
                    </TouchableOpacity>
                    <View style={{ ...styles.circle, width: '15%', height: '24%', left: '80%', borderRadius: 10, top: '-51%' }}>
                        <TouchableOpacity style={{ width: '100%', height: '100%', borderRadius: 10 }} onPress={() => { setEmojiContainer(true) }}>
                            {emojiRecievedContainer(setEmojiContainer, emojiContainer, emojiRecieved, friendName, friend,friendProfilePicture)}
                            <Image source={require('../assets/peach_and_gomu/onPhone.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>

                </View>
                <Text adjustsFontSizeToFit style={{ fontSize: 30, left: '12%', opacity: 0.5, bottom: '30%' }}>
                    {friendName && friendName.substring(0, 1).toUpperCase() + friendName.substring(1).toLowerCase()}
                </Text>
            </View>
            <Text style={{ fontSize: 20, color: 'lightgrey', fontWeight: 'bold', alignSelf: 'center', top: '1%' }}>
                Discover:
            </Text>

            {/* Small widgets */}
            <View style={{ flexDirection: 'row' }}>
                <SmallWidget text={"Reminder:"} onPress={() => { navigation.navigate("Reminder") }} iconName={"alarm-outline"} />

                <SmallWidget text={"Send Emoji:"} onPress={() => {
                    { !friend ? alert("You need a friend to send an emoji") : navigation.navigate("Emoji") }
                }} iconName={"image"} />
            </View>
            <View style={{ top: '10%' }}>
                <Text style={{ textAlign: 'center', top: '10%', color: 'lightgrey' }}>
                    This was made by: {''}
                </Text>
                <Text style={{ textAlign: 'center', color: 'lightgrey', fontWeight: 'bold', fontStyle: 'italic' }}>
                    Ethan Ieong
                </Text>
                <View style={{ flexDirection: 'row', left: '20%' }}>
                    <Text style={{ textAlign: 'center', color: 'lightgrey', fontWeight: 'bold', fontStyle: 'italic', left: '350%' }}>Github: </Text>
                    <Text style={{ textAlign: 'center', color: 'lightgrey', fontWeight: 'bold', fontStyle: 'italic', left: '350%' }}>
                        https://github.com/etthann/ihateRN
                    </Text>
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
        alignContent: 'center',
        backgroundColor: 'pink',
        width: '35%',
        height: '25%',
        borderRadius: 10,
        left: '5%',
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
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 30,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "white",
        bottom: '6.9%',
        left: '61.5%',
    },
});


const RemoveFriend = ({ id, friendId, removeFriend, setRemoveFriend, friendProfile, setFriendProfile,friend,friendProfilePicture }) => {

    // Remove friend from user data
    const userRef = ref(db, `users/${id}`);
    const friendRef = ref(db, `users/${friendId}`);

    if (removeFriend) {
        set(ref(db, `users/${id}/friendId`), {
            friendId: null,
        });
    }

    return (
        <Modal
            animationType='fade'
            onRequestClose={() => { setFriendProfile(false) }}
            visible={friendProfile}
            transparent={true}
            statusBarTranslucent={true}
        >
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.7)', justifyContent: 'center',position: 'absolute'  }} onPress={()=>{setFriendProfile(false)}}>
                <View style={{ width: wp('80%'), height: hp('50%'), backgroundColor: 'white', borderRadius: wp('3%'), alignSelf: 'center' }}>
                    <View style={{ ...styles.circle, height: hp('20%'), left: wp('5%') }}>
                        {friend && friendProfilePicture !== "null" ? (
                            <Image source={{ uri: friendProfilePicture }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center' }} />
                        )
                            : friend && friendProfilePicture == "null" ? (
                                <Image source={require("../assets/default_pfp.png")} style={{ alignSelf: 'center', width: '100%', height: '100%', alignSelf: 'center', resizeMode: 'contain' }} />
                            ) : null
                        }
                    </View>
                    <TouchableOpacity onPress={() => setFriendProfile(false)} style = {{flexDirection: 'row', alignSelf: 'center',top: hp('25%')}}>
                        <Text>
                            Click Here to unfriend:
                        </Text>
                        <Text style={{textAlign:'center'}}> Remove Friend</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>

    );
};



function SmallWidget({ text, onPress, iconName }) {
    return (
        <TouchableOpacity
            style={styles.smallWidget}
            onPress={onPress}
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold', padding: '10%' }}>
                {text}
            </Text>
            {iconName == 'image' ? (
                <Image source={require('../assets/peach_and_gomu/happy.png')} style={{ width: '100%', resizeMode: 'contain', bottom: '150%' }} />
            ) : (<Ionicons name={iconName} size={40} color="purple" style={{ alignSelf: 'center' }} />)}

        </TouchableOpacity>
    );
}

function FriendRequests({ notificationModal, setNotificationModal, userId, friendRequests, setFriend, setFriendRequests }) {
    const id = userId;

    useEffect(() => {
        // Function to fetch friend requests when the user logs in
        const fetchFriendRequests = async () => {
            const user = auth.currentUser; // Get the current user

            if (user) {
                // User is logged in, fetch friend requests
                try {
                    const snapshot = await get(ref(db, `users/${id}/incomingRequests`));
                    if (snapshot.exists()) {
                        const keys = Object.keys(snapshot.val());
                        var idArray = [];
                        for (let r = 0; r < keys.length; r++) {
                            var values = keys[r];
                            if (idArray.indexOf(values) !== -1) {
                                console.log("Copy");
                            } else {
                                friendRequests[r] = keys[r];
                            }
                            idArray.push(values);
                        }
                    } else {
                        console.log("No data available");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        // Listen for changes in authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User has logged in, fetch friend requests
                fetchFriendRequests();
            }
        });

        // Cleanup the subscription when the component unmounts
        return () => {
            unsubscribe();
        };

    }, [id, friendRequests]);

    return (

        <Modal animationType='fade' onRequestClose={() => { setNotificationModal(false) }} visible={notificationModal} transparent={true} statusBarTranslucent={true}>
            <TouchableOpacity style={{ backgroundColor: 'transparent', flex: 1 }} onPress={() => { setNotificationModal(false) }} />
            <View style={{ ...styles.triangle, backgroundColor: 'transparent', bottom: '87%', left: '76%', }} />
            <View style={{ height: '30%', width: '60%', backgroundColor: 'white', position: 'absolute', top: '11%', alignSelf: 'flex-end', right: '1%', borderRadius: 20, }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                    Friend Requests
                </Text>
                <ScrollView style={{ width: '100' }}>
                    {notificationModal && friendRequests.map((request, index) => {
                        return (
                            <PromiseRenderer key={index} userRef={ref(db, `users/${request}`)} id={userId} friendRequests={friendRequests} setFriend={setFriend} setFriendRequests={setFriendRequests} setNotificationModal={setNotificationModal} />
                        );
                    })}
                </ScrollView>
            </View>

        </Modal>
    )
}

function AcceptFriendRequests({ name, profilePicture, friendIdValue, id, friendRequests, setFriend, setNotificationModal, setFriendRequests }) {

    const Decision = ({ decision }) => {
        const userRef = ref(db, `users/${id}`);
        const requestRef = ref(db, `users/${friendIdValue}`);


        if (decision === "Decline") {
            // Remove friend request entries
            Promise.all([
                remove(userRef.child(`incomingRequests/${friendIdValue}`)),
                remove(requestRef.child(`outgoingRequests/${id}`)),
            ])
                .then(() => {
                    console.log("Friend request declined and removed.");
                })
                .catch((error) => {
                    console.error("Error removing requests:", error);
                });
        } else {
            // Accept friend request
            const userIncomingRequestsRef = child(userRef, `incomingRequests/${friendIdValue}`);
            const friendOutgoingRequestsRef = child(requestRef, `outgoingRequests/${id}`);
            setFriend(true);

            // Update user data and incoming requests status
            Promise.all([
                update(userRef, { friendId: friendIdValue }),
                update(userIncomingRequestsRef, { status: "Accepted" }),
            ])
                .then(() => {

                    return Promise.all([
                        update(requestRef, { friendId: id }),
                        update(friendOutgoingRequestsRef, { status: "Accepted" }),
                    ]);
                })
                .catch((error) => {
                    console.error("Error accepting friend request:", error);
                });
        }
        setNotificationModal(false)
        setFriendRequests(friendRequests.filter(requestId => requestId !== friendIdValue));
    };


    useEffect(() => {
        // Update filteredFriendRequests when friendRequests changes
        setFriendRequests(friendRequests);

    }, [friendRequests]);

    return (
        <View style={{ marginBottom: '10%', borderWidth: 0.3, height: '100%', borderColor: 'pink' }}>
            <View style={{ top: 0, backgroundColor: 'white', width: '100%', }}>
                <SafeAreaView style={{ width: '90%', backgroundColor: 'white', alignSelf: 'center', flexDirection: 'row', marginBottom: '6%', }}>
                    <View style={{ ...styles.circle, backgroundColor: 'white', height: '130%', width: '25%' }}>
                        {profilePicture != 'null' ? (
                            <Image source={profilePicture} style={{ alignSelf: 'center', top: '30%', resizeMode: 'contain' }} />
                        ) : (<Image source={'assets/placeholderLogo.png'} style={{ alignSelf: 'center', resizeMode: 'contain', top: '30%' }} />)}
                    </View>
                    <Text style={{ left: '20%', top: '5%' }}>
                        <Text style={{ fontSize: 20 }}>
                            {name}
                        </Text>
                        {'\n'}sent you a friend request
                    </Text>
                </SafeAreaView>
                <View style={{ flexDirection: 'row', bottom: '1%' }}>
                    <Pressable style={{ left: '35%', position: 'absolute', top: '10%' }} onPress={() => Decision("Decline")}>
                        <Text style={{ color: 'red' }}>
                            Decline
                        </Text>
                    </Pressable>
                    <Pressable style={{ left: '65%', top: '86%', position: 'absolute', }} onPress={() => Decision("Accept")}>
                        <Text style={{ color: 'green' }}>
                            Accept
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

function PromiseRenderer({ userRef, id, friendRequests, setFriend, setNotificationModal, setFriendRequests }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setUserData(snapshot.val());
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [userRef]);

    if (userData) {
        return (
            <>
                {friendRequests.includes(userData.id) && (
                    <AcceptFriendRequests
                        name={userData.name}
                        profilePicture={userData.profilePicture}
                        friendIdValue={userData.id}
                        id={id}
                        friendRequests={friendRequests}
                        setFriend={setFriend}
                        setNotificationModal={setNotificationModal}
                        setFriendRequests={setFriendRequests}
                    />
                )}
            </>
        );
    } else {
        return null; // You can render a loading indicator or handle the absence of data as needed
    }
}

const emojiRecievedContainer = (setEmojiContainer, emojiContainer, emojiNumber, friendName) => {
    return (
        <Modal
            animationType='fade'
            onRequestClose={() => { setEmojiContainer(false) }}
            visible={emojiContainer}
            transparent={true}
            statusBarTranslucent={true}
        >
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.7)', justifyContent: 'center' }} onPress={() => { setEmojiContainer(false) }}>
                <View style={{ width: '80%', height: '50%', backgroundColor: 'white', alignSelf: 'center', borderRadius: 20, flexDirection: 'column' }}>
                    {emojiNumber == 0 ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Text adjustsFontSizeToFit style={{ textAlign: 'center', bottom: '10%', fontSize: 20 }}>
                                You have a new message from {friendName}
                            </Text>
                            <Image source={require("../assets/peach_and_gomu/needAttention.png")} style={{ alignSelf: 'center' }} />
                        </View>
                    ) : emojiNumber == 1 ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Image source={require("../assets/peach_and_gomu/goodnight.png")} style={{ alignSelf: 'center' }} />
                        </View>
                    ) : emojiNumber == 2 ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Image source={require("../assets/peach_and_gomu/cry.png")} style={{ alignSelf: 'center' }} />
                        </View>
                    ) : emojiNumber == 3 ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Image source={require("../assets/peach_and_gomu/happy.png")} style={{ alignSelf: 'center' }} />
                        </View>
                    ) : emojiNumber == 4 ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Image source={require("../assets/peach_and_gomu/angry.png")} style={{ alignSelf: 'center' }} />
                        </View>
                    ) : emojiNumber == 5 ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Image source={require("../assets/peach_and_gomu/goodmorning.png")} style={{ alignSelf: 'center' }} />
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        </Modal>
    )

}