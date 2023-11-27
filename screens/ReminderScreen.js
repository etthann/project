import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, TextInput, StyleSheet, Platform } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { onValue, set, ref, push } from "firebase/database";
import Ionicons from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";

export default function Reminder({navigation}) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [description, setDescription] = useState("");
    const [userUID, setUID] = useState("");
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        setUID(auth.currentUser.uid);
        retrieveRemindersFromFirebase(); // Fetch reminders on component mount
    }, []);

    const chooseDate = () => {
        setShowDatePicker(true);
    };

    const chooseTime = () => {
        setShowTimePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const storeReminder = () => {
        const remindersRef = ref(db, `users/${userUID}/reminders/`);
        const newReminderRef = push(remindersRef);

        const newReminder = {
            descriptionText: description,
            date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
            time: `${time.getHours()}:${time.getMinutes()} ${am_pm()}`
        };

        set(newReminderRef, newReminder);

        // Update the state to include the new reminder
        setReminders([...reminders, newReminder]);

        // Schedule a notification for the reminder time
        scheduleNotification(newReminder);
    };

    const scheduleNotification = (reminder) => {
        const reminderTime = new Date(reminder.date + ' ' + reminder.time);
        const currentTime = new Date();

        // Calculate the time difference in milliseconds
        const timeDiff = reminderTime - currentTime;

        if (timeDiff > 0) {
            // Schedule a notification
            PushNotification.localNotificationSchedule({
                message: `Reminder: ${reminder.descriptionText}`,
                date: new Date(Date.now() + timeDiff),
            });
        } else {
            // The reminder time has already passed
            Alert.alert('Invalid Time', 'The selected time has already passed.');
        }
    };

    const retrieveRemindersFromFirebase = () => {
        const remindersRef = ref(db, `users/${userUID}/reminders`);
        onValue(remindersRef, (snapshot) => {
            const remindersData = snapshot.val();
            if (remindersData) {
                const remindersArray = Object.values(remindersData);
                setReminders(remindersArray);
            }
        });
    };

    const am_pm = () => {
        return time.getHours() >= 12 ? "PM" : "AM";
    };

    const minutes = () => {
        return time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ width: '100%', height: '15%', backgroundColor: 'white', borderBottomEndRadius: 30, borderBottomStartRadius: 30 }}>
                <TouchableOpacity style={{ marginTop: 30, marginLeft: 20, width: '8%', borderRadius: 100, }} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="arrow-back" size={35} color="black"/>
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
                    <ScrollView style={{ width: '90%', height: 200, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 20 }}>
                        {reminders.map((reminder, index) => (
                            <View key={index} style = {{backgroundColor: 'pink', borderWidth: 1,borderRadius: 15, marginVertical: 5}}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                                    Description: {reminder.descriptionText}
                                </Text>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                                    Date: {reminder.date}
                                </Text>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                                    Time: {reminder.time}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={{ marginTop: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>
                        Add Reminders:
                    </Text>
                    <ScrollView style={{
                        width: '90%', height: 170, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 20
                    }}>

                        <TextInput value={description} onChangeText={(textValue) => { setDescription(textValue) }} style={{ marginLeft: 20, marginTop: 20, fontSize: 15, fontWeight: 'bold', width: '80%' }} placeholder="Enter Reminder" />
                        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Date: </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    width: '80%',
                                    left: '30%',
                                    borderRadius: 10,
                                    borderWidth: 1,
                                }}
                                onPress={chooseDate}
                            >
                                <Text style={{ textAlign: 'center' }}>{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</Text>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                mode="date"
                                value={date}
                                onChange={handleDateChange}
                            />
                        )}
                        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Time: </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    width: '80%',
                                    left: '30%',
                                    borderRadius: 10,
                                    borderWidth: 1,
                                }}
                                onPress={chooseTime}
                            >
                                <Text style={{ textAlign: 'center' }}>{time.getHours()}:{minutes()} {am_pm()}</Text>
                            </TouchableOpacity>
                        </View>
                        {showTimePicker && (
                            <DateTimePicker
                                mode="time"
                                value={time}
                                onChange={handleTimeChange}
                            />
                        )}
                        <TouchableOpacity onPress={() => { storeReminder() }} style={{ backgroundColor: '#841584', padding: 10, borderRadius: 5, marginVertical: 15 }}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Create</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}
