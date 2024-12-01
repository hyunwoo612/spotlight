import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types/navigation';
import Start from './components/start/start';
import Signup from './components/signup/Signup';
import Select from './components/select/Select';
// import Edit from './components/signup/Edit';

const Stack =  createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start"
      screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Select" component={Select} />
        {/* <Stack.Screen name="Select" component={Edit} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
