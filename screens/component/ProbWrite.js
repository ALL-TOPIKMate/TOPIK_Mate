import React, {useState, useEffect} from 'react';

import {View, StyleSheet, Button, TextInput} from 'react-native'

export default ProbWrite = (props) => {

    // 제출 여부를 확인하여 렌더링
    // const [subBtn, setSubBtn] = useState(false);
    // 유저가 입력한 답
    const [input, setInput] = useState('');

    return (
        <View style = {{flex: 5}}>
            <TextInput 
                onChangeText = {(text) => {setInput(text)}}  
                style = {styles.input}
                placeholder='Enter your answer here' />
    
            <Button 
                onPress = {() => {props.textRef.current = input; props.setNextBtn(props.nextBtn+1)}} 
                title='SUBMIT'
                style={styles.button}/>
            {/* {!subBtn ? <Button title = "SUBMIT"/> :  <Button onPress = {() => {props.setNextBtn(props.nextBtn+1)}} title = "NEXT TO"/>} */}
          
        </View>  
    );

}

const styles = StyleSheet.create({
    button:{
        flex: 3,
        // flexDirection: "row",
        // justifyContent: "center",
        borderRadius: 10,
        padding: 16,
        backgroundColor: '#BBD6B8',
    },

    input: {
        flex: 3,
        height: 10,
        borderColor: "#000000",
        borderWidth: 1
    }
})