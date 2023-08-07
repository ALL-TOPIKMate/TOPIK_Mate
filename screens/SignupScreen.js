import React, { useState, useContext } from 'react';

import { signUp } from "../lib/auth";
import firestore from '@react-native-firebase/firestore';
import { Button, View ,TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import { CommonActions } from '@react-navigation/native'; // CommonActions 추가

import UserContext from '../lib/UserContext';
import AppNameHeader from './component/AppNameHeader'




const resultMessages = {
    "auth/email-already-in-use": "이미 가입된 이메일입니다.",
    "auth/wrong-password": "잘못된 비밀번호입니다.",
    "auth/user-not-found": "존재하지 않는 계정입니다.",
    "auth/invalid-email": "유효하지 않은 이메일 주소입니다."
}


const SignupScreen = ({ navigation }) =>{
    
    const USER = useContext(UserContext)

    const [form, setForm] = useState({
        email: "",
        password: "",
        
    });
    

    
    const readUser = async() => {
        await USER.initUserInfo()
    }


    // 랜덤 난수 생성
    const random = (length = 8) => {
        return Math.random().toString(16).substring(2, length);
    };


    // 회원가입 함수
    const signUpSubmit = async () => { 
        
        const {email, password} = form;
        const info = {email, password};

        const nickname=(random(10));
        const my_level = 1;

        try {
            const {user} = await signUp(info);
            const u_uid = user.uid

            console.log(user);
            console.log('닉네임', nickname);
            console.log('나의 레벨', my_level);
            
            // 유저 구조
            const UserDoc = firestore().collection("users").doc(u_uid)
            UserDoc.set({ email, nickname, my_level, u_uid})
            

            // 복습 문제 구조
            const WrongLv1Coll = UserDoc.collection("wrong_lv1")
            WrongLv1Coll.doc('LS_TAG').set({}); WrongLv1Coll.doc('LS_TAG').collection("PRB_TAG").doc("Wrong").set({})
            WrongLv1Coll.doc('RD_TAG').set({}); WrongLv1Coll.doc('RD_TAG').collection("PRB_TAG").doc("Wrong").set({})
            
            const WrongLv2Coll = UserDoc.collection("wrong_lv2")
            WrongLv2Coll.doc('LS_TAG').set({});  WrongLv2Coll.doc('LS_TAG').collection("PRB_TAG").doc("Wrong").set({})
            WrongLv2Coll.doc('RD_TAG').set({});  WrongLv2Coll.doc('RD_TAG').collection("PRB_TAG").doc("Wrong").set({})
            WrongLv2Coll.doc('WR_TAG').set({});  WrongLv2Coll.doc('WR_TAG').collection("PRB_TAG").doc("Wrong").set({})


            // 추천 문제 구조
            UserDoc.collection("recommend").doc('Recommend').set({ userCorrect: 0, userIndex: 10 })


             // initialize uid, email
             USER.initUser(user)
             readUser().then(()=>{
                 navigation.dispatch(
                     CommonActions.reset({
                       index: 0,
                       routes: [{ name: 'HomeStack' }]
                     })
                   );
 
             })
            
            return user;
        } catch (e) {
            const alertMessage = resultMessages[e.code] ? 
            resultMessages[e.code] : "알 수 없는 이유로 회원가입에 실패하였습니다.";

            Alert.alert("회원가입 실패", alertMessage);
        }

    }

    
    return (
        <View style={styles.container}>
            <AppNameHeader/>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({displayName: form.displayName, email: value, password: form.password})}
                    value={form.email}
                    placeholder="이메일"
                />
                
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({displayName: form.displayName, email: form.email, password: value})}
                    value={form.password}
                    placeholder="비밀번호"
                    secureTextEntry={true}
                />
                
                <TouchableOpacity style={styles.button} onPress={()=> signUpSubmit()}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BBD6B8', // 원하는 배경색으로 변경
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      backgroundColor: 'white',
    },
    button: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 10,
        margin: 10,
        width: 250,
        alignSelf: 'center'
    },
    buttonText:{
        color: 'black',
        textAlign: 'center',
    },
  });



export default SignupScreen;