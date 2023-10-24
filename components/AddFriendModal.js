import { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Image, Button, Touchable, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../firebase/firebase";
import * as Clipboard from 'expo-clipboard';
import { child,get, onValue, ref, set, update } from "firebase/database";



export default function AddFriendModal({ openFriendModalVisible, setOpenFriendModalVisible }) {

    const [friendCode, setFriendCode] = useState("");

    const [id, setId] = useState("null");


    const addFriend = () => {
        onValue(ref(db,`users/${friendCode}`),(snapshot)=> {
            if (snapshot.exists()) {
                set(ref(db, `users/${id}/outgoingRequests/${friendCode}`)), {
                    status: "pending",
                }
                set(ref(db, `users/${friendCode}/incomingRequests/${id}`)), {
                    status: "pending",
                }
                Alert.alert("Friend Request Sent");
            }
        });
    }
    

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setId(uid);
            }
        })
    }, [])

    return (
        <GestureRecognizer onSwipeDown={() => setOpenFriendModalVisible(false)}>
            <Modal animationType="slide-up" visible={openFriendModalVisible} onRequestClose={() => { setOpenFriendModalVisible(false) }} transparent={true}>
                <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' }}>
                    <View style={{ height: '30%', }}>
                        <TouchableOpacity onPress={() => { setOpenFriendModalVisible(false) }} style={{ flex: 1 }} />
                    </View>
                    <View style={{ height: '1%', width: '15%', backgroundColor: 'white', borderRadius: 10, alignSelf: 'center', bottom: '3%' }} />
                    <View style={{ width: '100%', height: '90%', alignSelf: 'center', backgroundColor: '#d3d3d3', borderTopStartRadius: 20, borderTopEndRadius: 20 }}>
                        <Text style={{ textAlign: 'center', fontSize: 50, top: '3%' }}>
                            Add Friend
                        </Text>
                        <Image source={require("../assets/couple.png")} style={{ resizeMode: 'contain', width: '70%', height: '50%', justifyContent: 'center', alignSelf: 'center' }} />
                        <TextInput value={friendCode} onChangeText={(value) => { setFriendCode(value) }} style={{ width: '80%', height: '8%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 15, top: '60%', textAlign: 'center', position: 'absolute' }} placeholder="Enter Friend's Code" />
                        <View style={{ width: '80%', justifyContent: 'center', alignSelf: 'center', top: '10%', }}>
                            <Button onPress={addFriend} title="Add Friend" color={"#f194ff"} accessibilityLabel="Click Here to Submit Friend Code" />
                        </View>
                        <TouchableOpacity onPress={() => { copyToClipboard(id) }} style={{ justifyContent: 'center', textAlign: 'center', alignSelf: 'center', position: 'absolute', top: '78%' }}>
                            <Text>
                                Your Code: {id}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </SafeAreaView>
            </Modal>
        </GestureRecognizer>
    );
}

const copyToClipboard = async (id) => {
    try {
        await Clipboard.setStringAsync(id);
        Alert.alert("Copied To Clipboard");
    } catch (error) {
        console.log(error);
    }

};