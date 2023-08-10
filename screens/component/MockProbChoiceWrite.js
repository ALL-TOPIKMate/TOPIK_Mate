import React, { useState, useEffect } from 'react'
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const MockProbChoiceWrite = ({ problem, choice, choice2, setChoice, setChoice2, index, setIndex, setDirection, probListLength }) => {

    // 사용자 선택 저장
    const [click, setClick] = useState(choice);
    const [click2, setClick2] = useState(choice2)

    useEffect(() => {
        setClick(choice);
    }, [choice]);

    useEffect(() => {
        setClick2(choice2);
    }, [choice2]);


    return (
        <View>
            {
                problem.TAG === '001' || problem.TAG === '002' // 입력창이 두 개 필요함
                    ? <View>
                        <Text>㉠</Text>
                        <TextInput
                            onChangeText={(text) => { setClick(text) }}
                            placeholder='Enter your answer here'
                            value={click}
                            style={styles.inputBox}
                            multiline={true}
                        />
                        <Text>㉡</Text>
                        <TextInput
                            onChangeText={(text) => { setClick2(text) }}
                            placeholder='Enter your answer here'
                            value={click2}
                            style={styles.inputBox}
                            multiline={true}
                        />
                    </View>
                    : <View>
                        <TextInput
                            onChangeText={(text) => { setClick(text) }}
                            placeholder='Enter your answer here'
                            value={click}
                            style={styles.inputBox}
                            multiline={true}
                        />
                    </View>
            }

            <Text />
            <View style={styles.controlButttonContainer}>

                {/* 이전 버튼 */}
                <TouchableOpacity
                    disabled={index === 0}
                    onPress={() => {
                        setChoice(click);
                        setChoice2(click2);
                        setClick(undefined);
                        setClick2(undefined);
                        setDirection(1);
                        setIndex(index - 1);
                    }}
                    style={[styles.controlButton, styles.choiceButton, { backgroundColor: index == 0 ? '#D9D9D9' : '#94AF9F' }]}>
                    <Text>PREV</Text>
                </TouchableOpacity>


                {/* 다음 버튼 */}
                <TouchableOpacity
                    onPress={() => {
                        setChoice(click);
                        setChoice2(click2);
                        setClick(undefined);
                        setClick2(undefined);
                        setDirection(-1);
                        setIndex(index + 1);
                    }}
                    style={[styles.controlButton, styles.choiceButton, { backgroundColor: '#94AF9F' }]}>
                    <Text>
                        {
                            index === probListLength - 1
                                ? "SUBMIT"
                                : "NEXT"
                        }
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}



const styles = StyleSheet.create({
    // 쓰기 영역
    inputBox: {
        padding: 10,
        borderColor: '#C1C0B9',
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,

        flexShrink: 1,
    },
    
    // 이전 다음 버튼을 감싸는 View 컨테이너 - Vuew
    controlButttonContainer: {
        flexDirection: "row", 
        justifyContent: "center",
        height: 200
    },

    // 이전 or 다음 버튼 - prev next
    controlButton: {
        width: 100,
        height: 60,
        marginHorizontal: 10
    },

    
    choiceButton:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
    },
})
export default MockProbChoiceWrite
