import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, TextInput, Platform, StyleSheet } from "react-native";
import { auth, db } from "../firebase/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { onValue, set, ref, push } from "firebase/database";
import { Ionicons } from '@expo/vector-icons';
import { Alert } from "react-native";
import * as Notifications from 'expo-notifications';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export default function Reminder({ navigation }) {
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

    useEffect(() => {
        // Set the handler function to be called when a notification is received
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
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

        const currentTime = new Date();

        // Check if the selected time has already passed
        if (new Date(newReminder.date + ' ' + newReminder.time) < currentTime) {
            Alert.alert('Invalid Time', 'The selected time has already passed.');
        } else {
            // Check for existing reminders with the same date and time
            const duplicateReminder = reminders.find(
                (reminder) => reminder.date === newReminder.date && reminder.time === newReminder.time
            );

            if (duplicateReminder) {
                // Handle the case when a reminder with the same date and time already exists
                Alert.alert('Duplicate Reminder', 'A reminder with the same date and time already exists.');
            } else {
                // Update the state to include the new reminder
                setReminders([...reminders, newReminder]);

                // Schedule a notification for the reminder time
                scheduleNotification(newReminder);

                // Store the new reminder in Firebase
                set(newReminderRef, newReminder);
            }
        }
    };

    const scheduleNotification = (reminder) => {
        const reminderTime = new Date(reminder.date + ' ' + reminder.time);
        const currentTime = new Date();

        // Calculate the time difference in milliseconds
        const timeDiff = reminderTime - currentTime;

        if (timeDiff > 0) {
            // Schedule a notification
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Reminder',
                    body: `Reminder: ${reminder.descriptionText}`,
                },
                trigger: {
                    seconds: timeDiff / 1000,
                },
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
            {/* Body */}
            <ScrollView>
                <View>
                    <Text style={{ fontSize: wp('8%'), fontWeight: 'bold', textAlign: 'center', marginTop: hp('3%') }}>
                        Current Reminders
                    </Text>
                    <ScrollView style={{ width: '90%', height: hp('35%'), backgroundColor: 'white', borderRadius: hp('2%'), marginLeft: hp('3%'), marginTop: hp('2%') }}>
                        {reminders.map((reminder, index) => (
                            <View key={index} style={{ backgroundColor: 'pink', borderWidth: hp('0.2%'), borderRadius: hp('2%'), marginVertical: wp('1.5%') }}>
                                <Text style={styles.text}>
                                    Description: {reminder.descriptionText}
                                </Text>
                                <Text style={styles.text}>
                                    Date: {reminder.date}
                                </Text>
                                <Text style={styles.text}>
                                    Time: {reminder.time}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={{ marginTop: wp('5%') }}>
                    <Text style={{ fontSize: wp('8%'), fontWeight: 'bold', textAlign: 'center', marginTop: hp('3%') }}>
                        Add Reminders
                    </Text>
                    <ScrollView style={{ width: '90%', height: hp('27%'), backgroundColor: 'white', borderRadius: hp('2%'), marginLeft: hp('3%'), marginTop: hp('2%') }}>


                        <TextInput value={description} onChangeText={(textValue) => { setDescription(textValue) }} style={{ marginLeft: wp('4.5%'), fontSize: wp('4%'), fontWeight: 'bold', width: wp('80%'),height: hp('10%') }} placeholder="Enter Reminder" />
                        <View style={{ flexDirection: 'row', marginTop: wp('2.5%'), marginLeft: wp('4.5%') }}>
                            <Text style={{ fontSize: wp('5%'), fontWeight: 'bold' }}>Date: </Text>
                            <TouchableOpacity style={styles.dateTimeInput} onPress={chooseDate}>
                                <Text style={{ textAlign: 'center' }}>{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</Text>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker mode="date" value={date} onChange={handleDateChange}/>
                        )}
                        <View style={{ flexDirection: 'row', marginLeft: wp('4.5%'), marginTop: wp('3%') }}>
                            <Text style={{ fontSize: wp('5%'), fontWeight: 'bold' }}>Time: </Text>
                            <TouchableOpacity style={styles.dateTimeInput} onPress={chooseTime}>
                                <Text style={{ textAlign: 'center' }}>{time.getHours()}:{minutes()} {am_pm()}</Text>
                            </TouchableOpacity>
                        </View>
                        {showTimePicker && (
                            <DateTimePicker mode="time" value={time} onChange={handleTimeChange}/>
                        )}
                        <TouchableOpacity onPress={() => { storeReminder() }} style={{ backgroundColor: '#841584', padding: wp('3%'), borderRadius: wp('2%'), marginVertical: wp('7%') }}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Create</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: hp('2%'), fontWeight: 'bold', marginLeft: wp('3%'), marginTop: wp('4%')
    }, dateTimeInput: {
        backgroundColor: 'white',
        width: wp('70%'),
        left: wp('1%'),
        borderRadius: wp('2%'),
        borderWidth: wp('0.5%'),
    }
})