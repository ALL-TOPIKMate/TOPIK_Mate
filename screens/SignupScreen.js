import React, {useState} from 'react';

import {Button, View ,TextInput, StyleSheet} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const SignupScreen = ({navigation}) =>{
    const [id, onChangeId] = React.useState('');
    const [pw, onChangePw] =React.useState('');

    return (
        <View>
            <AppNameHeader/>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeId}
                    value={id}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePw}
                    value={pw}
                />
                
                <Button title = "회원가입" onPress={()=> navigation.navigate("Signin")}/> 
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