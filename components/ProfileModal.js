import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';

export default function ProfileModal ({profileModalVisibile, setProfileModalVisible}) {

    const [profilePicture, setProfilePicture] = useState("null");

    return (
        <Modal animationSlide = {"fade-in"} onRequestClose = {!profileModalVisibile}>
            <View style = {{flex: 1 }}>
                <View style = {{backgroundCaolor: 'black', width: '100%', height: '20%', flexDirection: 'row', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                    <Feather name="chevron-left" size={30} color="black" style={{ position: 'absolute', left: 10, top: 11, }}/>
                    <Text style = {{color: 'black', fontSize: 20, left: '40%',top: '3%'}}>Profile</Text>
                </View>
                <TouchableOpacity onPress={() => pickImage()} style={{ position: 'absolute', height: '13%', width: '25%',alignSelf: 'center', top: '10%' }}>
                    <View style = {{backgroundColor: 'pink', width: '100%', height: '100%', borderRadius: 25, alignSelf: 'center', top: '25%', position: 'absolute'}}>
                        {profilePicture != "null"    ? (
                            <Image source = {{uri: profilePicture}} style = {{width: '100%', height: '100%', borderRadius: 15, position: 'absolute'}}/>
                        ) : (
                            <Ionicons name="md-person-outline" size={80} color="black" style = {{alignSelf: 'center', justifyContent: 'center', position: 'absolute'}} />
                        )}
                    </View>
                </TouchableOpacity>
                <Text style = {{fontSize: 20, textAlign: 'center', top: '8%'}}>Person's Name</Text>
                <Text style = {{top: '11%', left: '5%',marginBottom: '5%'}}>Account</Text>
                <ProfileOptions icon = {'pencil-outline'} text = {"Edit Profile"}/>
                <ProfileOptions icon = {"settings-outline"} text = {"Settings"}/>
                <ProfileOptions icon = {"notifications-outline"} text = {"Notifications"}/>
                <ProfileOptions icon = {"log-out-outline"} text = {"Log Out"}/>
            </View>
        </Modal>
    );
}

const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        allowsEditing: true,
        quality: 1,
    });

    if (!result.cancelled) {
        setProfilePicture(result.assets[0].uri);
    }

}

function ProfileOptions ({ icon, text }) {
    return (
        <View style = {{top: '10%', marginBottom: '2%'}}>
            <TouchableOpacity style={{ width: '100%', height: 50, }}>
                <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={icon} size={30} style={{ marginLeft: 20, color: 'purple' }}/>
                    <Text style={{ fontSize: 18, marginLeft: 20 }}>{text}</Text>
                    <Feather name="chevron-right" size={30} color="lightgrey" style={{ position: 'absolute', right: 20 }}/>
                </View>
            </TouchableOpacity>
            <View style={{ height: '0.5%', backgroundColor: 'black', alignSelf: 'flex-end', width: '84%' }}/>
        </View>
    );
}
