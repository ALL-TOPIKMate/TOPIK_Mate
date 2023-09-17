import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, BackHandler, Alert } from 'react-native'
import { checkUserSession, subscribeAuth } from './lib/auth';
import UserContext from "./lib/UserContext"
import auth from "@react-native-firebase/auth";

// load navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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
import TypeStudyRc from './screens/TypeStudyRc';
import TypeStudyLc from './screens/TypeStudyLc';
import TypeStudyWr from './screens/TypeStudyWr';
import WrongStudyScreen from './screens/WrongStudyScreen';
import WriteHistoryScreen from "./screens/WriteHistoryScreen";
import Notice from "./screens/Notice";
import Myaccount from "./screens/Myaccount";
import Inquiry from "./screens/Inquiry";
import InfoApp from './screens/InfoApp';
import WriteHistoryListScreen from './screens/WriteHistoryListScreen';
import ResultScreen from './screens/ResultScreen';
import SplashScreen from './screens/SplashScreen';
import LevelScreen from './screens/LevelScreen';
import LevelTestScreen from './screens/LevelTestScreen';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const Home = ({route, navigation}) =>{

  
  // useEffect(()=>{

  //   // 뒤로가기를 누를 경우 감지 -> 홈화면일 경우, 앱 종료
  //   const backHandler = BackHandler.addEventListener("hardWareBackPress", ()=>{

  //     // console.log(navigation.getState())
  //     const index = navigation.getState().index
  //     const path = navigation.getState().routes[index].name

  //     // console.log(path)
     
  //     if(path == "Home"){
  //       Alert.alert("Quit", "Are you sure you want to quit the app??", [
  //         {
  //           text: "No quit"
  //         },
  //         {
  //           text: "Quit",
  //           onPress: () =>{BackHandler.exitApp()},
  //         }
  //       ])
        
        
  //       return true
  //     }
        
  //     // 홈 화면이 아닌 경우, 기존 뒤로가기 실행
  //     return false
  //   })



  //   return () => backHandler.remove()
  // }, [])
  

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
            })}
        >
            <Tab.Screen name = "Recommend" component = {RecommendScreen}/>
            <Tab.Screen name = "Mocktest" component = {MocktestScreen}/>
            <Tab.Screen name = "Type" component = {TypeScreen}/>   
            <Tab.Screen name = "Wrong" component = {WrongScreen}/>
            <Tab.Screen name = "Info" component = {InfoScreen}/>
        </Tab.Navigator>
    );
}

const HomeStackScreen = () => {
    return (
        <Stack.Navigator initialRouteName = 'Home'>
            <HomeStack.Screen name = "Home" component = {Home} options = {({route})=>({headerBackVisible: false, title: "TOPIK MATE", })}/>
            <HomeStack.Screen name="InfoSetting" component = {InfoSetting}/>
            <HomeStack.Screen name = "RecommendStudy" component = {RecommendStudyScreen}/>
            <HomeStack.Screen name="MockStudy" component = {MockStudyScreen}/>
            <HomeStack.Screen name = "MockList" component = {MockListScreen}/>
            <HomeStack.Screen name="TypeStudyRc" component = {TypeStudyRc}/>
            <HomeStack.Screen name="TypeStudyLc" component = {TypeStudyLc}/>
            <HomeStack.Screen name="TypeStudyWr" component = {TypeStudyWr}/>
            <HomeStack.Screen name="WrongStudy" component = {WrongStudyScreen}/>
            <HomeStack.Screen name="WriteHistory" component = {WriteHistoryScreen}/>
            <HomeStack.Screen name="Notice" component={Notice}/>
            <HomeStack.Screen name="Myaccount" component={Myaccount}/>
            <HomeStack.Screen name="Inquiry" component={Inquiry}/>
            <HomeStack.Screen name="InfoApp" component={InfoApp}/>
            <HomeStack.Screen name="WriteHistoryList" component = {WriteHistoryListScreen}/>
            <HomeStack.Screen name = "Result" component = {ResultScreen} />
        </Stack.Navigator>
    )
}


const AuthStackScreen =  () => {
    return (
        <Stack.Navigator initialRouteName = 'Signin'>
            <AuthStack.Screen name = "Signin" component = {SigninScreen}/>
            <AuthStack.Screen name = "Signup" component = {SignupScreen}/>
            <AuthStack.Screen name = "Level" component = {LevelScreen} />
            <AuthStack.Screen name = "LevelTest" component = {LevelTestScreen} />
        </Stack.Navigator>
    )
}


const App = () => {
    
    // 유저 전역변수
    const USER = useContext(UserContext)
    


    return (
        <UserContext.Provider value = {USER}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Splash">
                <Stack.Screen name = "Splash" component = {SplashScreen} options = { () => ({ headerShown : false }) } />
                <Stack.Screen name = "HomeStack" component = {HomeStackScreen} options = { () => ({ headerShown : false }) } />
                <Stack.Screen name = "AuthStack" component = {AuthStackScreen} options = { () => ({ headerShown : false }) } />
            </Stack.Navigator>
        </NavigationContainer>    
        </UserContext.Provider>
  );
}


export default App;