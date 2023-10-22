import React, { useState, useContext, useEffect } from 'react';

import { signUp } from "../lib/auth";
import firestore from '@react-native-firebase/firestore';
import { Button, View ,TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import { CommonActions } from '@react-navigation/native'; // CommonActions 추가

import UserContext from '../lib/UserContext';
import AppNameHeader from './component/AppNameHeader'




const resultMessages = {
    "auth/email-already-in-use": "이미 가입된 이메일입니다.",
    "auth/invalid-email": "유효하지 않은 이메일 주소입니다.",
    "auth/weak-password": "패스워드가 약합니다. 공백을 제외하여 6문자 이상 입력해주세요.",
}

// 랜덤 난수 생성 (닉네임 자동생성)
const initNickname = (length = 8) => {
    return `USER${Math.random().toString(16).substring(2, length)}`
};


const ErrorText = ({text}) => {
    return (
        <Text style = {{color: "#DE0000"}}>
            {text}
        </Text>
    )
}

const checkNickname = (nickname) => {
    // 글자 수 제한: 1자 ~ 32자 
    // 공백 제한

    return nickname.length >=1 && nickname.length<=32 && !nickname.includes(" ")
}

const checkEmail = (email) => {
    // 글자 수 제한: 1자 ~

    return email.length > 0
}

const checkPassword = (password) => {
    // 글자 수 제한: 1자 ~

    return password.length > 5 && !password.includes(" ")
}


const SignupScreen = ({ navigation, route }) =>{
    
    const USER = useContext(UserContext)

    const [form, setForm] = useState({
        nickname: initNickname(),
        email: "",
        password: "",
    });
    

    
    // 인풋 텍스트 에러
    const [nicknameError, setNicknameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")


 

    // 회원가입 함수
    const signUpSubmit = async () => { 

        const {email, password, nickname} = form;
        const info = {email, password};        
        const my_level = USER.level


        setNicknameError("")
        setEmailError("")
        setPasswordError("")
        if(!(checkNickname(nickname) && checkEmail(email) && checkPassword(password))){
            if(!checkNickname(nickname)){
                setNicknameError("공백을 제외한 문자 1자 이상 32자이하로 입력하세요")
            }
            if(!checkEmail(email)){
                setEmailError("이메일을 입력하세요")
            }
            if(!checkPassword(password)){
                setPasswordError("공백을 제외하여 6문자 이상 입력하세요")
            }
            return 
        }

        try {
            const {user} = await signUp(info)
            const u_uid = user.uid


            console.log(user);
            console.log('닉네임', nickname);
            console.log('나의 레벨', my_level);
            
            /*  유저 collection 생성  */

            // 유저 구조
            const UserDoc = firestore().collection("users").doc(u_uid)
            UserDoc.set({ email, nickname, my_level, u_uid })
            

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

            // 레벨테스트 문제 구조
            UserDoc.collection("leveltest").doc('Leveltest').set({ userIndex: 0 })

            

            /*  유저 컨텍스트   */

             // initialize uid, email
            USER.initUser(user)
            // initialize level, nickname, levelIdx, recIndex, recCorrect
            USER.setUserInfo(my_level, nickname)


            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HomeStack' }]
                })
            );
            
            return user;
        } catch (e) {

            const alertMessage = resultMessages[e.code] ? 
            resultMessages[e.code] : Alert.alert("알 수 없는 이유로 회원가입에 실패하였습니다.")

            console.log(e)

            setEmailError(e.code == "auth/email-already-in-use" || e.code == "auth/invalid-email"? alertMessage: "")
            setPasswordError(e.code == "auth/weak-password"? alertMessage: "")
        }
    }

    
    return (
        <View style={styles.container}>
            <View style = {{height: 400}}>
            <View style = {styles.inputContainer}>
                <Text style = {styles.titleText}>nickname</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({ nickname: value, email: form.email, password: form.password})}
                    value={form.nickname}
                    placeholder="닉네임을 입력하세요"
                />
                <ErrorText text = {nicknameError} />
            </View>
            <View style = {styles.inputContainer}>
                <Text style = {styles.titleText}>email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({ nickname: form.nickname, email: value, password: form.password})}
                    value={form.email}
                    placeholder="이메일을 입력하세요"
                />
                <ErrorText text = {emailError} />
            </View>
            <View style = {styles.inputContainer}>
                <Text style = {styles.titleText}>password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({ nickname: form.nickname, email: form.email, password: value})}
                    value={form.password}
                    placeholder="비밀번호를 입력하세요(8자 이상)"
                    secureTextEntry={true}
                />
                <ErrorText text = {passwordError} />
            </View>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={()=> signUpSubmit()}>
                <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
            
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BBD6B8', // 원하는 배경색으로 변경
        paddingHorizontal: 16,
        paddingVertical: 40,

        justifyContent: "space-between"
    },

    inputContainer: {
        marginBottom: 16
    },

    input: {
      height: 50,
      borderWidth: 1,
      padding: 10,
      backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: "#FFFFFF",
        padding: 14,
    },
    buttonText:{
        color: "#000000",
        textAlign: 'center',
    },

    titleText: {
        color: "#000000",
        fontSize: 16,

        paddingBottom: 4
    }
  });



export default SignupScreen;