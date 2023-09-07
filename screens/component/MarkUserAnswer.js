import React from 'react';

import { View, Text, StyleSheet, Button } from 'react-native'

export default MarkUserAnswer = ({ PRB_CORRT_ANSW, PRB_USER_ANSW }) => {

    return (
        <View>
            <View style={PRB_USER_ANSW == PRB_CORRT_ANSW ? styles.correct : styles.incorrect} />
        </View>
    );
}


const styles = StyleSheet.create({
    // 유저가 답을 맞췄을 겨우
    correct: {
        width: 64,
        height: 64,

        borderColor: "red",
        borderWidth: 8,
        borderRadius: 32,

        // 번호 컴포넌트 위에 채점 결과 float
        position: "absolute",
        left: 8,
        top: 42
    },

    incorrect: {
        width: 80,
        height: 16,
        backgroundColor: "red",

        transform: [{ rotate: "-45deg" }],

        // 번호 컴포넌트 위에 채점 결과 float
        position: "absolute",
        top: 70,
        left: -2,
    }
})
