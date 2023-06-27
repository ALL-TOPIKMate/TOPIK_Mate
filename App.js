import React, {useRef, useState, useEffect} from 'react';
import {Image, BackHandler, Alert} from 'react-native'


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
import InfoSetting from "./screens/InfoSetting";

import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import RecommendStudyScreen from "./screens/RecommendStudyScreen";
import MockStudyScreen from "./screens/MockStudyScreen";
import MockListScreen from "./screens/MockListScreen";
import TypeQuestScreen from "./screens/TypeQuestScreen";
import TypeQuestScreenLc from "./screens/TypeQuestScreenLc";
import TypeQuestScreenWr from "./screens/TypeQuestScreenWr";
import WrongStudyScreen from './screens/WrongStudyScreen';
import WriteHistoryScreen from "./screens/WriteHistoryScreen";
import Notice from "./screens/Notice";
import Myaccount from "./screens/Myaccount";
import Inquiry from "./screens/Inquiry";
import InfoApp from './screens/InfoApp';
import WriteHistoryListScreen from './screens/WriteHistoryListScreen';
import ResultScreen from './screens/ResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const Home = ({route, navigation}) =>{

  
  useEffect(()=>{

    // 뒤로가기를 누를 경우 감지 -> 홈화면일 경우, 앱 종료
    const backHandler = BackHandler.addEventListener("hardWareBackPress", ()=>{

      // console.log(navigation.getState())
      const index = navigation.getState().index
      const path = navigation.getState().routes[index].name

      // console.log(path)
     
      if(path == "Home"){
        Alert.alert("Quit", "Are you sure you want to quit the app??", [
          {
            text: "No quit"
          },
          {
            text: "Quit",
            onPress: () =>{BackHandler.exitApp()},
          }
        ])
        
        
        return true
      }
        
      // 홈 화면이 아닌 경우, 기존 뒤로가기 실행
      return false
    })



    return () => backHandler.remove()
  }, [])
  

    return (
      <Tab.Navigator 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) =>{
              let iconImage
              if(route.name === "Recommend"){
                iconImage = require("./assets/home.png")
              }else if(route.name === "Mocktest"){
                iconImage = require("./assets/mocktest.png")
              }else if(route.name === "Type"){
                iconImage = require("./assets/type.png")
              }else if(route.name === "Wrong"){
                iconImage = require("./assets/wrong.png")
              }else{ // Info
                iconImage = require("./assets/info.png")
              }

              return <Image source = {iconImage} style = {{width: 23, height: 23}} resizeMode='contain' />
            },
          
            headerShown: false,
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
            tabBarActiveBackgroundColor: "#94AF9F",
            // tabBarInactiveBackgroundColor: "#D9D9D9"
            tabBarLabelStyle: {fontSize: 12, fontWeight: "bold"},

            tabBarStyle:{ height: 64}
          })
        }
      >
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
          <Stack.Screen name = "Home" component = {Home} options = {({route})=>({headerBackVisible: false, title: "TOPIK MATE", })}/>
          <Stack.Screen name = "Signin" component = {SigninScreen}/>
          <Stack.Screen name = "Signup" component = {SignupScreen}/>
          <Stack.Screen name="InfoSetting" component = {InfoSetting}/>


          <Stack.Screen name = "RecommendStudy" component = {RecommendStudyScreen}/>
          <Stack.Screen name="MockStudy" component = {MockStudyScreen}/>
          <Stack.Screen name = "MockList" component = {MockListScreen}/>
          <Stack.Screen name = "Type" component={TypeScreen}/>
          <Stack.Screen name="TypeQuest" component = {TypeQuestScreen}/>
          <Stack.Screen name="TypeQuestLc" component = {TypeQuestScreenLc}/>
          <Stack.Screen name="TypeQuestWr" component = {TypeQuestScreenWr}/>
          <Stack.Screen name="WrongStudy" component = {WrongStudyScreen}/>
          <Stack.Screen name="WriteHistory" component = {WriteHistoryScreen}/>
          <Stack.Screen name="Notice" component={Notice}/>
          <Stack.Screen name="Myaccount" component={Myaccount}/>
          <Stack.Screen name="Inquiry" component={Inquiry}/>
          <Stack.Screen name="InfoApp" component={InfoApp}/>
          <Stack.Screen name="WriteHistoryList" component = {WriteHistoryListScreen}/>
          <Stack.Screen name = "Result" component = {ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>    
  );
}


export default App;