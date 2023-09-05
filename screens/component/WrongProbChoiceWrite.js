import React, { useState, useEffect, useRef } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import { splitProblemAnswer } from '../../lib/utils';


// 뷰 박스 컨테이너
function ViewBox({text}){
    return (
        <View style ={styles.viewBox}>
            <Text>{text}</Text>
        </View>
    )
}


export default WrongProbChoiceWrite = ({ PRB_CORRT_ANSW, PRB_USER_ANSW, PRB_USER_ANSW2, SCORE, PRB_POINT, ERROR_CONT , nextBtn, setNextBtn, size, TAG }) => {
    return (
        <View>
            {
                TAG == "001" || TAG == "002" ? 
                <View>
                    <Text style={styles.text}>㉠</Text>
                    <View style = {styles.alignRow}>
                        <Text style={[styles.text, styles.textLeft]}>Your Answer</Text>
                        <Text style={[styles.text, styles.textRight]}>Score: {SCORE} / 5</Text>
                    </View>
                    <ViewBox text = {PRB_USER_ANSW} />
                
                    <Text />

                    <Text style={styles.text}>Best Answer</Text>
                    <ViewBox text = {splitProblemAnswer(PRB_CORRT_ANSW).text1} />
    
                    <Text />

                    <Text style={styles.text}>㉡</Text>
                    <View style = {styles.alignRow}>
                        <Text style={[styles.text, styles.textLeft]}>Your Answer</Text>
                        <Text style={[styles.text, styles.textRight]}>Score: {SCORE} / 5</Text>
                    </View>
                    <ViewBox text = {PRB_USER_ANSW2} />
                
                    <Text />

                    <Text style={styles.text}>Best Answer</Text>
                    <ViewBox text = {splitProblemAnswer(PRB_CORRT_ANSW).text2} />
                </View>: 
                <View>
                    <View style = {styles.alignRow}>
                        <Text style={[styles.text, styles.textLeft]}>Your Answer</Text>
                        <Text style={[styles.text, styles.textRight]}>Score: {SCORE} / {PRB_POINT}</Text>
                    </View>
                    <ViewBox text = {PRB_USER_ANSW} />
                
                    <Text />

                    <Text style={styles.text}>Best Answer</Text>
                    <ViewBox text = {PRB_CORRT_ANSW} /> 
                </View>
            }
            
            <Text style={styles.text}>감점 요인</Text>
            <ViewBox text = {ERROR_CONT} />

            <Text />
            <Text />

            <View style={styles.moveButtonContainer}>
                <TouchableOpacity onPress={() => { setNextBtn(nextBtn - 1) }} disabled={ nextBtn == 0 } style={[styles.btn, { backgroundColor: (nextBtn == 0) ? ("#D9D9D9") : ("#94AF9F") }]}>
                    <Text style={{ color: "black", textAlign: "center" }}>PREV</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setNextBtn(nextBtn + 1) }} disabled={ nextBtn == size - 1 } style={[styles.btn, { backgroundColor: (nextBtn == size - 1) ? ("#D9D9D9") : ("#94AF9F") }]}>
                    <Text style={{ color: "black", textAlign: "center" }}>NEXT TO</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBox: {
        backgroundColor: "#D9D9D9",
        padding: 10,
        minHeight: 128,

        borderWidth: 1,
        borderColor: "black",
        flexShrink: 1,
        marginVertical: 14
    },

    // prev next 버튼
    btn: {
        width: 100,
        paddingVertical: 16,
        borderRadius: 20
    },

    // prev, next 버튼의 상위 컨테이너
    moveButtonContainer: {
        flexDirection: "row", 
        justifyContent: "space-between"
    },

    // 가로 정렬
    alignRow: {
        flexDirection: "row"
    },
    // 텍스트 왼쪽 정렬
    textLeft: {
        flex: 1,
        textAlign: "left"
    },
    // 텍스트 오른쪽 정렬
    textRight: {
        flex: 1,
        textAlign: "right"
    },

    text: {
        fontSize: 18
    }
})