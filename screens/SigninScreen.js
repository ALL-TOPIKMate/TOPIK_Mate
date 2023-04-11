import React, {useState} from 'react';

import {Button, View ,TextInput, StyleSheet, Text} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const SigninScreen = ({navigation}) =>{
    const [id, onChangeId] = React.useState('');
    const [pw, onChangePw] =React.useState('');

    return (
        <View>
            <AppNameHeader/>
               <TextInput
                    style = {styles.input}
                    onChangeText={onChangeId}
                    value={id}
                />
                <TextInput
                    style = {styles.input}
                    onChangeText={onChangePw}
                    value={pw}
                />

                <Button title = "로그인" onPress={()=> navigation.navigate("Home")}/>  
                <Text/>
                <Button title = "간편로그인 구글" onPress={()=> navigation.navigate("Home")}/> 
                <Text/>
                <Button title = "회원가입" onPress={()=> navigation.push("Signup")}/>  
                <Text/>
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



export default SigninScreen;