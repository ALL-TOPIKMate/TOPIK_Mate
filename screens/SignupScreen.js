import React, {useState} from 'react';

import {signUp } from "../lib/auth";
import firestore from '@react-native-firebase/firestore';
import {Button, View ,TextInput, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const SignupScreen = ({navigation}) =>{
    const random = (length = 8) => {
        return Math.random().toString(16).substring(2, length);
      };
    const [form, setForm] = useState({
        email: "",
        password: "",
        
    });
    const resultMessages = {
        "auth/email-already-in-use": "이미 가입된 이메일입니다.",
        "auth/wrong-password": "잘못된 비밀번호입니다.",
        "auth/user-not-found": "존재하지 않는 계정입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 주소입니다."
    }
    const signUpSubmit = async () => { // 회원가입 함수
        const {email, password} = form;
        const info = {email, password};
        const nickname=(random(10));
        const my_level = 1;

        try {
          const {user} = await signUp(info);
          const u_uid = user.uid
          console.log(user);
          console.log('닉네임',nickname);
          console.log('나의 레벨', my_level);
          
          await firestore().collection("users").doc(user.uid).set({ email, nickname, my_level, u_uid});
          await firestore().collection("users").doc(user.uid).collection("wrong_lv1").doc('LS_TAG').set({ Type: 'Wrong' });
          await firestore().collection("users").doc(user.uid).collection("wrong_lv1").doc('RD_TAG').set({ Type: 'Wrong' });
          await firestore().collection("users").doc(user.uid).collection("wrong_lv2").doc('LS_TAG').set({ Type: 'Wrong' });
          await firestore().collection("users").doc(user.uid).collection("wrong_lv2").doc('RD_TAG').set({ Type: 'Wrong' });
          await firestore().collection("users").doc(user.uid).collection("wrong_lv2").doc('WR_TAG').set({ Type: 'Wrong' });
          await firestore().collection("users").doc(user.uid).collection("recommend").doc('추천').set({ Type: 'Recom' });
          navigation.navigate('Home')
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