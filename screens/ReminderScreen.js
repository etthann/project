import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, TextInput, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { set } from "firebase/database";

export default function Reminder() {

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const chooseDate = () => {
        <DateTimePicker mode="date" value={date} onChange={(event, setDate) => {
            const currentDate = event || date;
            setDate(currentDate);
        }} />
    }
    const chooseTime = () => {
        <DateTimePicker mode="time" value={time} onChange={(event, setTimea) => {
            const currentDate = event || time;
            setTime(currentDate);
        }} />
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ width: '100%', height: '15%', backgroundColor: 'white', borderBottomEndRadius: 30, borderBottomStartRadius: 30 }}>
                <TouchableOpacity style={{ marginTop: 30, marginLeft: 20, width: '8%', borderRadius: 100, }} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="arrow-back" size={35} color="black" />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: 'bold', bottom: '39%' }}>
                    Reminder
                </Text>
            </View>
            {/* Body */}
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                        Current Reminders:
                    </Text>
                    <ScrollView style={{ width: '90%', height: 100, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 20 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                            2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                            3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ marginTop: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                        Add Reminders:
                    </Text>
                    <ScrollView style = {{
                        width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 20
                    }}>

                        <TextInput style = {{marginLeft: 20, marginTop: 20, fontSize: 15, fontWeight: 'bold', width: '80%'}} placeholder = "Enter Reminder"/>
                        <View style = {{flexDirection: 'row', marginTop: 20, marginLeft: 20}}>
                            <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Date: </Text>
                            <TouchableOpacity style = {{backgroundColor: 'white', width: '80%',left: '30%',borderRadius: 10,borderWidth: 1}} onPress={chooseDate}>
                                <Text style = {{textAlign: 'center'}}>
                                    {date.toString()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flexDirection: 'row', marginTop: 20, marginLeft: 20}}>
                            <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Time: </Text>
                            <TouchableOpacity style = {{backgroundColor: 'white', width: '80%',left: '30%',borderRadius: 10,borderWidth: 1}} onPress={chooseTime}>
                                <Text style = {{textAlign: 'center'}}>
                                    {time.toString()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}