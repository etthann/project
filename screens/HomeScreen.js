import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, View, Text, Pressable, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Emotions from '../components/Emotions';




export default function Home({navigation}) {
    return (
        <View style = {{flex: 1}}>
            <ScrollView style = {{backgroundColor: '#f5f5f5', marginTop: '10%', height: '100%'}}>
                <View style = {{flexDirection: 'row', alignItems:'center','height': '10%'}}>

                </View>
            </ScrollView>
        </View>
    );
}