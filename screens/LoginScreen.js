import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {

    //Login Credential Values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Login Error Values
    const errorLoginMessages = ["Your credentials aren't found in our database. Please try again.", "Your email is invalid. Please try again.", "Your password is incorrect. Please try again.", "You have tried to login too many times. Please try again later."]
    const [errorValue, setErrorValue] = useState(0);

    return (
        //to avoid the notch on the phones and round edges
        <SafeAreaView style={{ flex: 1 }}>
            {/* The logo and text */}
            <View style={{ width: '60%', height: '30%', left: '22%', top: '16%', bottom: '10%' }}>
                <Image
                    style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                    source={
                        require('../assets/placeholderLogo.png')
                    } />
                <Text adjustsFontSizeToFit style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'red' }}>Placeholder Logo</Text>
                <Text adjustsFontSizeToFit style={{ textAlign: 'center', top: '6%', fontWeight: 'bold', right: '7' }}>Account loginLogic</Text>
            </View>

            {/* Allow user to enter email  */}
            <View style={styles.loginCredentialContainer}>
                <Ionicons adjustsFontSizeToFit name="mail" color="#3b444b" size={20} style={{ right: '2%' }} />
                <UserInput placeholder={"E-mail"} value={email} setValue={setEmail} secureText={false} />
            </View>
            {/* Allow user to enter password */}
            <View style={styles.loginCredentialContainer}>
                <Ionicons adjustsFontSizeToFit name="lock-closed" color="#3b444b" size={20} style={{ right: '2%' }} />
                <UserInput placeholder={"Password"} value={password} setValue={setPassword} secureText={true} />
            </View>
            {/* Login Button */}
            <View style={styles.loginButton}>
                <Button title="Login" onPress={() => { loginLogic(setErrorValue = { setErrorValue }, navigation = {navigation}) }} />
                {/* If there is an error, display the error message */}
                {errorValue !== 0 ? (
                    <Text style={styles.errorMessage}>
                        {errorLoginMessages[errorValue - 1]}
                    </Text>
                ) : null}
            </View>
            {/* Allow user to register */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text>
                    Don't have an account?
                </Text>
                {/* Navigate to the register screen */}
                <TouchableOpacity onPress={navigateToRegister(navigation = {navigation})}>
                    <Text style={{ color: '#AD40AF', fontSize: 'italic', fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
                {/* Allow users to sign in with Apple */}
                <View style={styles.socialMediaSignIn}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../assets/apple.png')}/>
                </View>
                {/* Allow users to sign in with Google */}
                <View style={styles.socialMediaSignIn}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../assets/google.png')}/>
                </View>
                {/* Allow users to sign in with Meta */}
                <View style={styles.socialMediaSignIn}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../assets/meta.png')}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loginCredentialContainer: {
        backgroundColor: 'white',
        width: '80%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '3%',
        marginLeft: '12%',
        padding: '2%',
        paddingHorizontal: '3%',
        flexDirection: 'row',
        alignItems: 'center',
    }, loginButton: {
        resizeMode: 'contain',
        borderRadius: 1,
        width: '80%',
        height: '5%',
        backgroundColor: '#ADD8E6',
        marginVertical: '7%',
        marginHorizontal: '12%',
    }, errorMessage: {
        fontSize: 12,
        marginTop: '1%',
        marginHorizontal: '1%',
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center'
    }, socialMediaSignIn: {
        borderColor: '#D3D3D3',
        width: '13%',
        height: '20%',
        borderRadius: 4,
        borderWidth: 1,
        marginVertical: '8%',
        marginHorizontal: '11%',
    },
})

const navigateToHome = ({ navigation }) => {
    //Navigate to the home screen
    navigation.navigate('Home');
};

const navigateToRegister = ({ navigation }) => {
    //Navigate to the register screen
    navigation.navigate('Register');
}

const loginLogic = async (setErrorValue, navigation) => {
    try {
        //Sign in with the email and password
        await signInWithEmailAndPassword(auth, emailValue, passwordValues);
        //Navigate to the home screen
        navigateToHome(navigation);

    } catch (error) { //If there is an error, set the error value to the corresponding error message
        if (error.code === 'auth/user-not-found') {
            setErrorValue(1);
        } else if (error.code === 'auth/invalid-email') {
            setErrorValue(2);
        } else if (error.code === 'auth/wrong-password') {
            setErrorValue(1);
        } else if (error.code === 'auth/too-many-requests') {
            setErrorValue(3);
        }
    }
};

function UserInput(placeholder, value, setValue, secureText) {
    //Allow user to enter text
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            secureTextEntry={secureText}
        />
    )
}

