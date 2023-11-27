import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReminderScreen from './screens/ReminderScreen';
import EmojiScreen from './screens/EmojiScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, headerLeft: () => null }} />
        <Stack.Screen name="Emoji" component={EmojiScreen}/>
        <Stack.Screen name="Reminder" component={ReminderScreen}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, headerLeft: () => null }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}