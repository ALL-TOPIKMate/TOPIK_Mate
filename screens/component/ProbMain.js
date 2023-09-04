import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'

const ProbMain = ({ PRB_NUM, PRB_MAIN_CONT, PRB_CORRT_ANSW, PRB_USER_ANSW }) =>{
    
    return (
        <View>
            {
                // 채점 결과 
                PRB_USER_ANSW &&
                    <View style = {PRB_USER_ANSW == PRB_CORRT_ANSW ? styles.correct: styles.incorrect} />
            }

            <View style = {styles.titleBox}>
                <Text style = {styles.number}>Q{PRB_NUM}</Text>
                <Text style = {styles.title}> {PRB_MAIN_CONT} </Text>
            </View>

            <Text />
        </View>
    );          
}


const styles = StyleSheet.create({
    titleBox: {
        flexDirection: "row",
        alignItems: "center",

        marginVertical: 32,
    },
    number:{
        fontSize: 24,
        fontWeight: 'bold',
        color: "#000000",

        // transform: [{rotate: "45deg"}],
    },
    title: {
        fontSize: 15,
        paddingHorizontal: 10,
        color: "#000000",

        flexShrink: 1
    },

    // 유저가 답을 맞췄을 겨우
    correct: {
        width: 50,
        height: 50,

        borderColor: "red",
        borderWidth: 5,
        borderRadius: 25,
       
        // 번호 컴포넌트 위에 채점 결과 float
        position: "absolute",
        top: 30,
        left: -3,
        
    },

    incorrect: {
        width: 70,
        borderColor: "red",
        borderBottomWidth: 6,

        transform: [{rotate: "-45deg"}],

        // 번호 컴포넌트 위에 채점 결과 float
        position: "absolute",
        top: 50,
        left: -15,
    }
})


export default ProbMain