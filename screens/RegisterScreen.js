import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, Pressable, TouchableWithoutFeedback } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from '../firebase/firebase';

export default function Register({ navigation }) {

    //Register with name
    const [name, setName] = useState('');

    //Register with email
    const [email, setEmail] = useState('');

    //Register with password
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    //Error values and messages
    const [errorValue, setErrorValue] = useState(0);
    const errorRegisterMessages = [login, "Invalid email, please enter a valid email.", "Please enter a password longer than 6 characters.", password === '' ? "Please enter a valid email/password" : "An error has occured please try again", "Passwords do not match."]

    return (
        //to avoid the notch on the phones and round edges
        <SafeAreaView style={{ flex: 1 }}>
            {/* When typing avoid the keyboard from blocking the phone */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={{ flex: 1 }}>
                {/* Don't touch the keyboard and the keyboard will go down */}
                <TouchableWithoutFeedback>
                    {/* Create account text */}
                    <Text style={{ textAlign: 'center', width: '100%', fontWeight: 'bold', color: 'black', marginBottom: '15%', fontSize: 40, }}>
                        Create Account
                    </Text>

                    {/* If an error has occured print ut the message */}
                    {errorValue !== 0 ? (
                        <Text>
                            {errorRegisterMessages[errorValue - 1]}
                        </Text>) : null}

                    {/* Prompt and input containers */}
                    <RegisterCredentialContainer value={name} setValue={setName} text={"Name"} secureText={false} />
                    <RegisterCredentialContainer value={email} setValue={setEmail} text={"Email"} secureText={false} />
                    <RegisterCredentialContainer value={password} setValue={setPassword} text={"Password"} secureText={true} />
                    <RegisterCredentialContainer value={password2} setValue={setPassword2} text={"Re-Enter Password"} secureText={true} />

                    {/* Container for the confirm button */}
                    <View style={styles.confirmButton}>
                        {/* Confirm button */}
                        {/* When pressed it will call the register function which will make an account or send back an error */}
                        <Button title="Confirm" onPress={register(name = { name }, email = { email }, password = { password }, navigation = { navigation }, setErrorValue = { setErrorValue })} />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textInput: {
        flex: 0.001,
        borderColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
        width: '75%',
        height: '3%',
        marginHorizontal: '13%',
        backgroundColor: '#FFFFFF',
        padding: '2%',
    },
})



function RegisterCredentialContainer(value, setValue, text, secureText) {
    return (
        //Print the prompt and make the input container
        <View>
            <Text style={{ flex: 0.01, marginLeft: '13%', fontSize: 15, marginTop: '3%' }}>{text}:</Text>
            <TextInput placeholder={"Enter Here"} onChangeText={setValue} value={value} style={styles.textInput} secureTextEntry={secureText} />
        </View>
    )
}

const navigateToHome = ({ navigation }) => {
    //Navigate Home
    navigation.navigate('Home');
}
const navigateToLogin = ({ navigation }) => {
    //Navigate to the login page
    navigation.navigate('Login')
}

const login = () => {
    return (
        <View>
            {/* Tells the user that an account has been made with the email */}
            <Text style={styles.error}>
                The email already has an account signed up, click here to
            </Text>
            {/* Click on Login and get sent to the login page */}
            <Pressable
                onPress={navigateToLogin}
            >
                <Text>Login</Text>
            </Pressable>

        </View>
    )
}

const register = async ({ name, email, password, navigation, setErrorValue }) => {

    // If the password is the same as the re-entered password
    if (password === password2) {

        try {
            // Create an account with the email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Get the user
            const user = userCredential.user;
            // Set the user's name, email and password in the database
            set(ref(db, `users/${user.uid}`), {
                name: name,
                email: email,
                password: password
            });
            // Navigate home
            navigateToHome(navigation = { navigation });

            // If there is an error, set the error value to the corresponding error message
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setErrorValue(2);
            } if (error.code === 'auth/email-already-in-use') {
                setErrorValue(1);
            } if (error.code === 'auth/weak-password') {
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

