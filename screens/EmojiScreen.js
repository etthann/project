import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from "../firebase/firebase";
import { onValue, set, ref, push } from "firebase/database";

export default function Emoji({ navigation }) {

    const [friendId, setFriendId] = useState("")

    useEffect(()=> {
        const unsubscribe = onValue(ref(db, `users/${auth.currentUser.uid}`), (snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                setFriendId(data.friendId);
                
            }
        });
        return () => unsubscribe();
    })

    const sendEmoji = (emojiNumber) => {
        set(ref(db, `users/${friendId}/emojiRecieved`), {
                emoji: emojiNumber,
        })
    }
    
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white', height: '10%', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }} style={{ marginTop: 'auto', left: '30%' }}>
                    <Ionicons name="arrow-back" size={35} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', flex: 1, marginTop: 'auto' }}>Send an Emoji ❤️</Text>
            </View>
            <ScrollView style={{ backgroundColor: 'pink',flex: 1, }}>
                <EmojiContainer emojiNumber={0} sendEmoji={sendEmoji}/>
                <EmojiContainer emojiNumber={1} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={2} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={3} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={4} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={5} sendEmoji={sendEmoji} /> 
            </ScrollView>
        </SafeAreaView>
    );
}

function EmojiContainer({ emojiNumber, sendEmoji }) {
    const emoji = () => {
        switch (emojiNumber) {
            case 0:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{width: '80%', height: '30%', left: '10%', borderRadius: 20, borderWidth: 1, backgroundColor: 'white', marginVertical: '10%' }}>
                        <Image source={require('../assets/peach_and_gomu/needAttention.png')} style={{ resizeMode: 'contain'}} />
                    </TouchableOpacity>
                );
            case 1:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{width: '80%', height: '40%', left: '10%', borderRadius: 20, borderWidth: 1, backgroundColor: 'white',justifyContent: 'center',bottom: '51%'}}>
                        <Image source={require('../assets/peach_and_gomu/goodnight.png')} style={{ resizeMode: 'contain', width: '60%',alignSelf: 'center'}} />
                    </TouchableOpacity>
                );
            case 2:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{width: '80%', height: '40%', left: '10%', borderRadius: 20, borderWidth: 1, backgroundColor: 'white',justifyContent: 'center',bottom: '107%'}}>
                        <Image source={require('../assets/peach_and_gomu/cry.png')} style={{ resizeMode: 'contain',width: '90%'}} />
                    </TouchableOpacity>
                )
            case 3:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{width: '80%', height: '40%', left: '10%', borderRadius: 20, borderWidth: 1, backgroundColor: 'white',justifyContent: 'center',bottom: '164%'}}>
                        <Image source={require('../assets/peach_and_gomu/happy.png')} style={{ resizeMode: 'contain',width: '100%'}} />
                    </TouchableOpacity>
                );
            case 4:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{width: '80%', height: '40%', left: '10%', borderRadius: 20, borderWidth: 1, backgroundColor: 'white',justifyContent: 'center',bottom: '220%'}}>
                        <Image source={require('../assets/peach_and_gomu/angry.png')} style={{ resizeMode: 'contain',width: '100%'}} />
                    </TouchableOpacity>
                );
                case 5:
                    return (
                        <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{width: '80%', height: '35%', left: '10%', borderRadius: 20, borderWidth: 1, backgroundColor: 'white', justifyContent: 'center', bottom: '315%' }}>
                            <Image source={require('../assets/peach_and_gomu/goodmorning.png')} style={{ resizeMode: 'contain',width: '100%'}} />
                        </TouchableOpacity>
                    );
                
        }
    }
    return (
        <View>
            {emoji(emojiNumber)}
        </View>
    );
}
