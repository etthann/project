import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function Login({ navigation }) {

    //Login Credential Values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Login Error Values
    const errorLoginMessages = ["Your credentials aren't found in our database. Please try again.", "Your email is invalid. Please try again.", "Your password is incorrect. Please try again.", "You have tried to login too many times. Please try again later."]
    const [errorValue, setErrorValue] = useState(0);

    const loginLogic = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigate to the home screen
            navigateToHome({ navigation });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + "\n" + errorMessage);
            if (errorCode === 'auth/user-not-found') {
                setErrorValue(1);
            } else if (errorCode === 'auth/invalid-email') {
                setErrorValue(2);
            } else if (errorCode === 'auth/wrong-password') {
                setErrorValue(3); // Change the error code for wrong password
            } else if (errorCode === 'auth/too-many-requests') {
                setErrorValue(4); // Change the error code for too many requests
            } else if (errorCode === 'auth/invalid-login-credentials') {
                setErrorValue(2)
            }
        }
    };


    return (
        //to avoid the notch on the phones and round edges
        <View style={{ flex: 1,backgroundColor:'white' }}>
            {/* The logo and text */}
            <View style={{ width: wp('60%'), height: hp('30%'), left: wp('22%'), top: hp('4%'), bottom: hp('10%') }}>
                <Image
                    style={{ alignSelf: 'center', height: hp('25%'), resizeMode: 'contain' }}
                    source={
                        require('../assets/peach_and_gomu/heart.png')
                    } />
                <Text adjustsFontSizeToFit style={{ fontSize: wp('7%'), fontWeight: 'bold', left: wp('3%'), textAlign: 'center', color: 'red' }}>LoveLink ❤️</Text>
                <Text adjustsFontSizeToFit style={{ textAlign: 'center', top: hp('2%'), fontWeight: 'bold' }}>Account Login</Text>
            </View>

            {/* Allow user to enter email  */}
            <View style={styles.loginCredentialContainer}>
                <Ionicons adjustsFontSizeToFit name="mail" color="#3b444b" size={wp('5%')}/>
                <UserInput placeholder={1} value={email} setValue={setEmail} secureText={false} />
            </View>
            {/* Allow user to enter password */}
            <View style={styles.loginCredentialContainer}>
                <Ionicons adjustsFontSizeToFit name="lock-closed" color="#3b444b" size={wp('5%')} />
                <UserInput placeholder={2} value={password} setValue={setPassword} secureText={true} />
            </View>
            {/* Login Button */}
            <View style={styles.loginButton}>
                <Button title="Login" onPress={() => { loginLogic() }} />
                {/* If there is an error, display the error message */}
                {errorValue !== 0 ? (
                    <Text style={styles.errorMessage}>
                        {errorLoginMessages[errorValue - 1]}
                    </Text>
                ) : null}
            </View>
            {/* Allow user to register */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', top: hp('10%') }}>
                <Text>
                    Don't have an account?
                </Text>
                {/* Navigate to the register screen */}
                <TouchableOpacity onPress={() => { navigateToRegister({navigation}) }}>
                    <Text style={{ color: '#AD40AF', fontStyle: 'italic', fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginCredentialContainer: {
        backgroundColor: 'white',
        width: wp('80%'),
        borderColor: '#e8e8e8',
        borderWidth: wp('0.5%'),
        borderRadius: wp('5%'),
        top: hp('9%'),
        left: wp('10%'),
        padding: wp('1.5%'),
        paddingHorizontal: wp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp('1%'),
    }, loginButton: {
        resizeMode: 'contain',
        width: wp('80%'),
        height: hp('5%'),
        top: hp('6%'),
        backgroundColor: '#ADD8E6',
        marginVertical: hp('4%'),
        alignSelf: 'center'
    }, errorMessage: {
        fontSize: wp('3%'),
        marginTop: hp('1%'),
        marginHorizontal: wp('1%'),
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

const navigateToHome = ({ navigation, userId }) => {
    //Navigate to the home screen
    navigation.navigate('Home', { userId });
};

const navigateToRegister = ({ navigation }) => {
    //Navigate to the register screen
    navigation.navigate('Register');
};

function UserInput({ placeholder, value, setValue, secureText }) {
    const placeholderValue = placeholder === 1 ? ' E-mail' : 'Password';

    return (
        <TextInput
            placeholder={placeholderValue + "                                                                                                                                                                                   "}
            value={value}
            onChangeText={(text) => setValue(text)} // Use the 'text' parameter to set the value
            secureTextEntry={secureText}
        />
    );
};
