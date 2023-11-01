import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from '../firebase/firebase';

export default function Register({ navigation }) {

    //Value of the name
    const [name, setName] = useState('');

    //Value of the email
    const [email, setEmail] = useState('');

    //Register with password
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    //Error values and messages
    const [errorValue, setErrorValue] = useState(0);
    const errorRegisterMessages = ["true", "Invalid email, please enter a valid email.", "Please enter a password longer than 6 characters.", password === '' ? "Please enter a valid email/password" : "An error has occured please try again", "Passwords do not match."]

    //Value of the phone number
    const [phoneNumber, setPhoneNumber] = useState('');


    return (
        //to avoid the notch on the phones and round edges
        <SafeAreaView style={{ flex: 1 }}>
            {/* When typing avoid the keyboard from blocking the phone */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={{ flex: 1 }}>
                {/* Don't touch the keyboard and the keyboard will go down */}
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
                    <View>
                        {/* Create account text */}
                        <Text style={{ textAlign: 'center', width: '100%', fontWeight: 'bold', color: 'black', fontSize: 40, }}>
                            Create Account
                        </Text>

                        {/* If an error has occured print ut the message */}
                        {errorValue !== 0 ? (
                            <Text style={{ alignSelf: 'center', color: errorValue === 1 ? 'green' : 'red' }}>
                                {errorValue === 1 ? <View>
                                    {/* Tells the user that an account has been made with the email */}
                                    <Text style={styles.error}>
                                        The email already has an account signed up, click here to
                                    </Text>
                                    {/* Click on Login and get sent to the login page */}
                                    <Pressable
                                        onPress={() => {navigateToLogin(navigation = { navigation })}}
                                    >
                                        <Text style = {{alignSelf: 'center'}}>Login</Text>
                                    </Pressable>

                                </View> : errorRegisterMessages[errorValue - 1]}
                            </Text>
                        ) : null}

                        {/* Prompt and input containers */}
                        <RegisterCredentialContainer value={name} setValue={setName} text={0} secureText={false} />
                        <RegisterCredentialContainer value={email} setValue={setEmail} text={1} secureText={false} />
                        <RegisterCredentialContainer value={phoneNumber} setValue={setPhoneNumber} text={2} secureText={false} />
                        <RegisterCredentialContainer value={password} setValue={setPassword} text={3} secureText={true} />
                        <RegisterCredentialContainer value={password2} setValue={setPassword2} text={4} secureText={true} />


                        {/* Container for the confirm button */}
                        <View style={styles.confirmButton}>
                            {/* Confirm button */}
                            {/* When pressed it will call the register function which will make an account or send back an error */}
                            <Button title="Confirm" onPress={() => register({ name, email, password, password2, phoneNumber, navigation, setErrorValue })} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    textInput: {
        borderColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
        width: '80%',
        backgroundColor: '#FFFFFF',
        marginVertical: 9,
        alignSelf: 'center',
        padding: 7,
    }, confirmButton: {
        width: '80%',
        alignSelf: 'center',
        marginVertical: 10,
    }, error: {
        color: 'red',
        alignSelf: 'center',
        marginVertical: 10,
    }
})



function RegisterCredentialContainer({ value, setValue, text, secureText }) {
    const promptText = ["Name", "Email", "Phone", "Password", "Re-Enter Password"];

    return (
        <View>
            <Text style={{ fontSize: 15, left: '10%' }}>{promptText[text]}</Text>
            <TextInput placeholder={`${promptText[text]}:`} onChangeText={(input) => (setValue(input))} value={value} style={styles.textInput} secureTextEntry={secureText} />
            
        </View>
    );
}





const navigateToHome = ({ navigation}) => {
    //Navigate Home
    navigation.navigate('Home');
}
const navigateToLogin = ({ navigation }) => {
    //Navigate to the login page
    navigation.navigate('Login')
}

const register = async ({ name, email, password, password2, navigation, setErrorValue,phoneNumber}) => {

    // If the password is the same as the re-entered password
    if (password === password2) {

        try {
            // Create an account with the email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Get the user
            const user = userCredential.user;
            // Set the user's name, email and password in the database
            const userId = user.uid;
            await set(ref(db, `users/${userId}`), {
                name: name,
                email: email,
                friendId: "",
                phoneNumber: phoneNumber,
                profilePicture: "null",
                incomingRequests: [],
                outgoingRequests: [],
                
            });

            // Navigate home
            navigateToHome(navigation = { navigation });

            // If there is an error, set the error value to the corresponding error message
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setErrorValue(2);
            } else if (error.code === 'auth/email-already-in-use') {
                setErrorValue(1);
            } else if (error.code === 'auth/weak-password') {
                setErrorValue(3);
            } else {
                setErrorValue(4);
                console.log(error.code)
            }
        }
    } else {
        // If there are different errors than the ones stated above print the default message
        setErrorValue(5);
    }
};
