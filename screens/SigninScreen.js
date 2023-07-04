import React, {useState, useEffect} from 'react';
import {signIn, checkUserSession } from "../lib/auth";
import {Button, View ,TextInput, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native'
//import AppNameHeader from './component/AppNameHeader'

const AppNameHeader = () => {
    return (
      <Text style={styles.header}>앱 이름</Text>
    );
};
  
const SigninScreen = ({navigation}) =>{
    const [form, setForm] = useState({
        email: "",
        password: "",
        
    });
    useEffect(() => {
        checkUserSession().then((user) => {
          if (user) {
            console.log('사용자 세션 찾음:', user);
            navigation.navigate('Home');
          }
        });
      }, []);
    const resultMessages = {
        "auth/email-already-in-use": "이미 가입된 이메일입니다.",
        "auth/wrong-password": "잘못된 비밀번호입니다.",
        "auth/user-not-found": "존재하지 않는 계정입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 주소입니다."
    }
    const signInSubmit = async () => { // 로그인 함수
        const {email, password} = form;
        const info = {email, password};
        try {  
            const {user} = await signIn(info); 
            console.log(user);
            console.log('성공')
            navigation.navigate('Home')
        } catch (e) {
            const alertMessage = resultMessages[e.code] ? 
            resultMessages[e.code] : "알 수 없는 이유로 로그인에 실패하였습니다.";

            console.log(e)
          Alert.alert("로그인 실패", alertMessage);
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
                
                
                <TouchableOpacity style={styles.button} onPress={signInSubmit}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <View style={styles.dashContainer}>
                    <View style={styles.dash} />
                    <Text style={styles.signupText}>No account?</Text>
                    <View style={styles.dash} />
                </View>
                <TouchableOpacity style={styles.button2} onPress={()=> navigation.push("Signup")}>
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