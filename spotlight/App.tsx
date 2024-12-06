import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types/navigation';
import { AuthProvider } from './context/AuthContext'; 
import Start from './components/start/start';
import Signup from './components/signup/Signup';
import Select from './components/select/Select';
import Login from './components/login/login';
import Home from './components/home/Home';
import Test from './components/test/Test';
// import Edit from './components/signup/Edit';

const Stack =  createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start"
        screenOptions={{
            headerShown: false,
          }} >
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Select" component={Select} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Test" component={Test} />
          {/* <Stack.Screen name="Select" component={Edit} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
