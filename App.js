import React from 'react';


// load navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


// bottom tabs navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// load Component
import RecommendScreen from './screens/RecommendScreen';
import MocktestScreen from "./screens/MocktestScreen";
import TypeScreen from "./screens/TypeScreen";
import WrongScreen from "./screens/WrongScreen";
import InfoScreen from "./screens/InfoScreen";

import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import StudyScreen from "./screens/StudyScreen";
import MockStudyScreen from "./screens/MockStudyScreen";
import MockListScreen from "./screens/MockListScreen";
import TypeQuestScreen from "./screens/TypeQuestScreen";
import TypeQuestScreenLc from "./screens/TypeQuestScreenLc";
import WrongStudyScreen from './screens/WrongStudyScreen';
import WriteHistoryScreen from "./screens/WriteHistoryScreen";
import WriteHistoryListScreen from './screens/WriteHistoryListScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const Home = () =>{
    return (
      <Tab.Navigator>
          <Tab.Screen name = "Recommend" component = {RecommendScreen}/>
          <Tab.Screen name = "Mocktest" component = {MocktestScreen}/>
          <Tab.Screen name = "Type" component = {TypeScreen}/>   
          <Tab.Screen name = "Wrong" component = {WrongScreen}/>
          <Tab.Screen name = "Info" component = {InfoScreen}/>
      </Tab.Navigator>
    );
}


const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Signin'>
          <Stack.Screen name = "Home" component = {Home}/>
          <Stack.Screen name = "Signin" component = {SigninScreen}/>
          <Stack.Screen name = "Signup" component = {SignupScreen}/>
          <Stack.Screen name = "Study" component = {StudyScreen}/>
          <Stack.Screen name="MockStudy" component = {MockStudyScreen}/>
          <Stack.Screen name = "MockList" component = {MockListScreen}/>
          <Stack.Screen name="TypeQuest" component = {TypeQuestScreen}/>
          <Stack.Screen name="TypeQuestLc" component = {TypeQuestScreenLc}/>
          <Stack.Screen name="WrongStudy" component = {WrongStudyScreen}/>
          <Stack.Screen name="WriteHistory" component = {WriteHistoryScreen}/>
          <Stack.Screen name="WriteHistoryList" component = {WriteHistoryListScreen}/>
        </Stack.Navigator>
      </NavigationContainer>    
  );
}


export default App;

