import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, View, Text, Pressable, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';




export default function Home({ navigation }) {


    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#f5f5f5', marginTop: '10%', height: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', 'height': '10%' }}>
                    <Text adjustsFontSizeToFit style={{ fontSize: 30, fontWeight: 'bold', color: 'black', fontStyle: 'italic', left: '30%', top: '50%' }}>
                        Welcome {'\n'}
                        <Text adjustsFontSizeToFit style={{ fontSize: 15 }}>placeholder</Text>
                    </Text>
                    <View style={{ position: 'absolute', right: '20%', top: '15%', width: '30%', height: '20%', borderRadius: Dimensions.get('window').height / 30, resizeMode: 'contain' }}>
                        <Ionicons name={"person-circle-outline"} size={Dimensions.get('window').height / 10} color="purple" style={{ alignSelf: 'center', top: '20%', }} />
                    </View>
                    <View style={styles.card}>
                        <Pressable style={styles.circle} onPress={() => { console.log('hi') }}>
                            <Image source={require('../assets/placeholderLogo.png')} style={{ resizeMode: 'contain', width: 100, height: 100, alignSelf: 'center', marginTop: Dimensions.get('window').height / 20 }} />
                        </Pressable>
                    </View>
                    <View style = {{flexDirection:'row',justifyContent:'center',top:'3%',width:'90%',height:'40%',borderRadius:Dimensions.get('window').height/20,alignSelf: 'center'}}>
                        <ContactWidget name = {"chatbox-outline"} size={Dimensions.get('window').height / 20} color="purple" style={{ alignSelf: 'center', marginTop: Dimensions.get('window').height / 40 }} onPress={()=>{console.log('Hello')}}/>
                        <ContactWidget name = {"videocam-outline"} size={Dimensions.get('window').height / 20} color="purple" style={{ alignSelf: 'center', marginTop: Dimensions.get('window').height / 40 }} onPress={()=>{console.log('Hello')}}/>
                        <ContactWidget name = {"call-outline"} size={Dimensions.get('window').height / 20} color="purple" style={{ alignSelf: 'center', marginTop: Dimensions.get('window').height / 40 }} onPress={()=>{console.log('Hello')}}/>
                        <ContactWidget image={true} size={Dimensions.get('window').height / 20} color="purple" style={{ alignSelf: 'center', marginTop: Dimensions.get('window').height / 40 }} onPress={()=>{console.log('Hello')}}/>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width / 1.1,
        height: Dimensions.get('window').height / 2.2,
        backgroundColor: 'lightblue',
        borderRadius: Dimensions.get('window').height / 20,
        alignSelf: 'center',
        marginBottom: Dimensions.get('window').height / 20,
        marginTop: Dimensions.get('window').height / 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },circle: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width / 2,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: Dimensions.get('window').height / 4,
        marginTop: Dimensions.get('window').height / 50,
        marginLeft: Dimensions.get('window').width / 20,
        alignSelf: 'center',
        right: Dimensions.get('window').width / 35,
        padding: Dimensions.get('window').height / 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },contactWidget: {
        backgroundColor: 'pink',
        width: Dimensions.get('window').width / 6,
        height: Dimensions.get('window').width / 6,
        borderRadius: Dimensions.get('window').height / 12,
        alignSelf: 'center',
        marginLeft: Dimensions.get('window').width / 20,
        shadowColor: "#000",
        justifyContent: 'space-between',
        shadowOffset: {
            width: 0,
            height: 1,
        },
    
}})

function ContactWidget({name,onPress,image})  {
    return(
        <TouchableOpacity style = {styles.contactWidget} onPress={onPress}>
            {!image ? (
                <Ionicons name = {name} size = {Dimensions.get('window').height/20} color = "purple" style = {{alignSelf:'center',top:Dimensions.get('window').height/40}} />): 
                <Image source={require('../assets/splash.png')} color="purple" style={{ resizeMode: 'contain', width: Dimensions.get('window').height / 11, bottom: Dimensions.get('window').height / 30, right: Dimensions.get('window').height / 200, }} />}
        </TouchableOpacity>
    );
}