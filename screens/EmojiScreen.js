import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase/firebase";
import { onValue, set, ref } from "firebase/database";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Emoji({ navigation }) {

    const [friendId, setFriendId] = useState("")

    useEffect(() => {
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
            <ScrollView style={{ backgroundColor: 'pink', flex: 1, }}>
                <EmojiContainer emojiNumber={0} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={1} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={2} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={3} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={4} sendEmoji={sendEmoji} />
                <EmojiContainer emojiNumber={5} sendEmoji={sendEmoji} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    emojiContainer: {
        width: wp('80%'),
        height: wp('50%'),
        left: wp('10%'),
        borderRadius: wp('10%'),
        borderWidth: wp('1%'),
        backgroundColor: 'white',
        marginVertical: hp('9%')
    }
})


function EmojiContainer({ emojiNumber, sendEmoji }) {
    const emoji = () => {
        switch (emojiNumber) {
            case 0:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{...styles.emojiContainer,height:hp('35%'),justifyContent:'center'}}>
                        <Image source={require('../assets/peach_and_gomu/needAttention.png')} style={{ resizeMode: 'contain' }} />
                    </TouchableOpacity>
                );
            case 1:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{ ...styles.emojiContainer, bottom: hp('10%'), justifyContent: 'center', height: hp('60%') }}>
                        <Image source={require('../assets/peach_and_gomu/goodnight.png')} style={{ resizeMode: 'contain', width: '100%', alignSelf: 'center' }} />
                    </TouchableOpacity>
                );
            case 2:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{ ...styles.emojiContainer, justifyContent: 'center', height: hp('50%'), bottom: hp('20%') }}>
                        <Image source={require('../assets/peach_and_gomu/cry.png')} style={{ resizeMode: 'contain', width: '100%' }} />
                    </TouchableOpacity>
                )
            case 3:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{ ...styles.emojiContainer, justifyContent: 'center', bottom: hp('29%') }}>
                        <Image source={require('../assets/peach_and_gomu/happy.png')} style={{ resizeMode: 'contain', width: '100%' }} />
                    </TouchableOpacity>
                );
            case 4:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{ ...styles.emojiContainer, justifyContent: 'center', bottom: hp('35%'), height: hp('35%') }}>
                        <Image source={require('../assets/peach_and_gomu/angry.png')} style={{ resizeMode: 'contain', width: '100%', height: hp('40%') }} />
                    </TouchableOpacity>
                );
            case 5:
                return (
                    <TouchableOpacity onPress={() => { sendEmoji(emojiNumber) }} style={{ ...styles.emojiContainer, justifyContent: 'center', bottom: hp('35%'), height: hp('45%') }}>
                        <Image source={require('../assets/peach_and_gomu/goodmorning.png')} style={{ resizeMode: 'contain', width: '100%', height: hp('40%') }} />
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
