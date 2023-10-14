import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable, ScrollView, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import ProfileModal from '../components/ProfileModal';

export default function Home({ navigation }) {
    
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: '7%', left: '20%' }}>
                    Welcome
                </Text>
                <TouchableOpacity style={{ top: '6%', left: '500%' }} onPress={() => {setProfileModalVisible(true)}}>
                    <ProfileModal profileModalVisible = {profileModalVisible} setProfileModalVisible={setProfileModalVisible} />
                    <Ionicons name="person-circle-outline" size={40} color="black" />
                </TouchableOpacity>  
            </View>
            <View style={{ height: 1, backgroundColor: 'black', opacity: 0.5, top: '5%' }} />
            <View style={styles.card}>
                <View style={{ height: '100%' }}>
                    <TouchableOpacity style={styles.circle} onPress={() => {}}>
                        <Image source={require("../assets/favicon.png")} style={{ alignSelf: 'center', top: '30%' }} />
                    </TouchableOpacity>
                    <ContactFriend object={"heart"} method={placeholder} bordercolor={"red"} index={4} />
                    <ContactFriend object={"chatbox-outline"} method={placeholder} index={3} />
                    <ContactFriend object={"videocam-outline"} method={placeholder} index={2} />
                    <ContactFriend object={"call-outline"} method={placeholder} index={1} />

                    <OnlineIndicator />
                </View>
                <Text adjustsFontSizeToFit style={{ fontSize: 30, left: '12%', opacity: 0.5, bottom: '30%' }}>
                    Add Friend
                </Text>
            </View>
            <Text style={{ fontSize: 20, color: 'lightgrey', fontWeight: 'bold', alignSelf: 'center', top: '1%' }}>
                Discover:
            </Text>
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
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const checkOnlineStatus = async () => {
            const netInfo = await NetInfo.fetch();
            setIsOnline(netInfo.isConnected);
        };

        checkOnlineStatus();

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Determine the dot color based on online status
    const dotColor = isOnline ? 'green' : 'grey';

    return <View style={[styles.dot, { backgroundColor: dotColor, width: '10%', height: '15.6%', borderRadius: 200, left: '30%', bottom: '105%', borderWidth: 1, top: '-11%' }]} />;
};

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

