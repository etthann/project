import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, View, Text, Pressable, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';




export default function Home({navigation}) {
    return (
        <View style = {{flex: 1}}>
            <ScrollView style = {{backgroundColor: '#f5f5f5', marginTop: '10%', height: '100%'}}>
                <View style = {{flexDirection: 'row', alignItems:'center','height': '10%'}}>
                    <Text adjustsFontSizeToFit style = {{fontSize: 30, fontWeight:'bold',color:'black',fontStyle:'italic',left:'30%',top:'50%'}}>
                        Welcome {'\n'}
                        <Text adjustsFontSizeToFit style = {{fontSize: 15}}>placeholder</Text>
                    </Text>
                    
                </View>
            </ScrollView>
        </View>
    );
}