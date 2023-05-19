import React, {useState, useEffect} from 'react';
import {subscribeAuth } from "../lib/auth";
import {View, Text} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const InfoScreen = () =>{
    const [userEmail, setUserEmail] = useState(null);
    const handleAuthStateChanged =(user) =>{
        if(user){
            console.log('로그인', user.email);
            setUserEmail(user.email);
        }
    }
    const unsubscribe = subscribeAuth(handleAuthStateChanged);
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    내 정보
                </Text>
                <Text> {userEmail} </Text>
                
            </View>
        </View>
    );
}

export default InfoScreen;