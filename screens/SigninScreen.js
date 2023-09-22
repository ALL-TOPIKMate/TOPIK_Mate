import React, { useState, useEffect, useContext } from 'react';
import { Button, View ,TextInput, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native'
import { CommonActions } from '@react-navigation/native'; // CommonActions 추가


import UserContext from "../lib/UserContext"
import { signIn, checkUserSession } from "../lib/auth";





const resultMessages = {
    "auth/wrong-password": "잘못된 비밀번호입니다.",
    "auth/user-not-found": "존재하지 않는 계정입니다.",
    "auth/invalid-email": "유효하지 않은 이메일 주소입니다."
}


const checkEmail = (email) => {
    // 글자 수 제한: 1자 ~

    return email.length > 0
}

const checkPassword = (password) => {
    // 글자 수 제한: 1자 ~

    return password.length > 0
}


const ErrorText = ({text}) => {
    return (
        <Text style = {{color: "#DE0000", marginHorizontal: 12}}>
            {text}
        </Text>
    )
}


const SigninScreen = ({navigation}) =>{
    
    const USER = useContext(UserContext)

    const [form, setForm] = useState({
        email: "",
        password: "",
        
    });


    // 인풋 텍스트 에러
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")



    const readUser = async() => {
        await USER.getUserInfo()
    }



    // 로그인 함수
    const signInSubmit = async () => { 

        const {email, password} = form;
        const info = {email, password};

        setEmailError("")
        setPasswordError("")
        if(!checkEmail(email) || !checkPassword(password)){
            if(!checkEmail(email)){
                setEmailError("이메일을 입력하세요")
            }
            if(!checkPassword(password)){
                setPasswordError("패스워드를 입력하세요")
            }

            return 
        }


        try {  
            const {user} = await signIn(info); 
            
            console.log(user);
            console.log('성공')


            // initialize uid, email
            USER.initUser(user)
            readUser().then(()=>{

                console.log(`login: ${JSON.stringify(USER, null, 2)}`)
            
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'HomeStack' }]
                    })
                  );

            })
            
        } catch (e) {
            const alertMessage = resultMessages[e.code] ? 
            resultMessages[e.code] : Alert.alert("알 수 없는 이유로 로그인에 실패하였습니다.");

            setEmailError(e.code == "auth/invalid-email" || e.code == "auth/user-not-found"? alertMessage: "")
            setPasswordError(e.code == "auth/wrong-password"? alertMessage: "")
        }

    }


    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>TOPIK Mate</Text>
            </View>
            
            <View style={styles.content}>
                <View style={styles.dashContainer}>
                    <View style={styles.dash} />
                    <Text style={styles.signInText}>Sign in</Text>
                    <View style={styles.dash} />
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({ ...form, email: value})}
                    value={form.email} placeholder="이메일"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({ ...form, password: value})}
                    value={form.password} placeholder="비밀번호"
                    secureTextEntry={true}
                />
                
                {emailError.length > 0 && <ErrorText text = {emailError} /> }
                {passwordError.length > 0 && <ErrorText text = {passwordError} />}

                <TouchableOpacity style={styles.button} onPress={signInSubmit}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <View style={styles.dashContainer}>
                    <View style={styles.dash} />
                    <Text style={styles.signupText}>No account?</Text>
                    <View style={styles.dash} />
                </View>
                <TouchableOpacity style={styles.button2} onPress={()=> navigation.push("Level")}>
                    <Text style={styles.buttonText2}>Create new one</Text>
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
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: 'black'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#FFFFFF"
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
    button2: {
        backgroundColor: "#94AF9F",
        borderRadius: 8,
        padding: 10,
        margin: 10,
        width: 250,
        alignSelf: 'center'
    },
    buttonText2:{
        color: 'white',
        textAlign: 'center',
    },
    dashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    dash: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
        marginHorizontal: 10,
    },
    signInText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    signupText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    content: {
        marginTop: 80, // 컨텐츠 간격
    },
});



export default SigninScreen;