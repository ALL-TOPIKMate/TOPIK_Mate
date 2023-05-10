import React, {useState} from 'react';
import {Alert} from 'react-native';
import {signUp } from "../lib/auth";

import {Button, View ,TextInput, StyleSheet} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const SignupScreen = ({navigation}) =>{
    //const [id, onChangeId] = React.useState('');
    //const [pw, onChangePw] =React.useState('');
    //const [pwck, onChangePwck] =React.useState('');
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
        try {
          const {user} = await signUp(info);
          console.log(user);
          navigation.navigate('Home')
        } catch (e) {
            const alertMessage = resultMessages[e.code] ? 
            resultMessages[e.code] : "알 수 없는 이유로 회원가입에 실패하였습니다.";
            Alert.alert("회원가입 실패", alertMessage);
        }
    }
    
    return (
        <View>
            <AppNameHeader/>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({email: value, password: form.password})}
                    value={form.email}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(value)=>setForm({email: form.email, password: value})}
                    value={form.password}
                />
                
                
                <Button title = "회원가입" onPress={()=> signUpSubmit()}/> 
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });



export default SignupScreen;