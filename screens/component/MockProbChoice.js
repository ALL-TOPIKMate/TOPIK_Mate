import React, { useState, useEffect } from 'react'
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


const MockProbChoice = ({ problem, images, choice, setChoice, setChoice2, index, setIndex, setDirection, probListLength, buttonDisabled, setVisible }) => {

    // 사용자 선택 저장
    const [click, setClick] = useState(choice);

    useEffect(() => {
        setClick(choice);
    }, [choice]);


    function setBtnColor(btn){
        if(buttonDisabled){ // 모달에서 불러온 4지선다 (채점)
            // 유저가 답을 맞췄을 경우
            if(problem.PRB_CORRT_ANSW == problem.PRB_USER_ANSW){
                if(btn == problem.PRB_CORRT_ANSW){
                    return "#BAD7E9"
                }else{
                    return "#D9D9D9"
                }
            }else{ // 유저가 답을 틀렸을 경우
                if(btn == problem.PRB_CORRT_ANSW){
                    return (problem.PRB_USER_ANSW ? "#BAD7E9" : "#FFACAC")
                }else if(btn == problem.PRB_USER_ANSW){
                    return "#FFACAC"
                }else{
                    return "#D9D9D9"
                }
            }
        }else{ // MockProb에서 불러온 4지선다 (버튼 선택가능)
            if(btn == click){
                return "#BBD6B8"
            }else{
                return "#D9D9D9"
            }
        }
    }



    return (
        <View>
            {
                problem.PRB_CHOICE1 in images.current
                    ? <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("1"); }} style={[styles.choiceImgConainer, { borderColor: setBtnColor("1") }]}>
                        <Image
                            style={styles.choiceImg}
                            source={{ uri: images.current[problem.PRB_CHOICE1].url }}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                    : <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("1"); }} style={[styles.choiceButton, { backgroundColor: setBtnColor("1") }]}>
                        <Text>{problem.PRB_CHOICE1}</Text>
                    </TouchableOpacity>
            }

            <Text />
            {
                problem.PRB_CHOICE2 in images.current
                    ? <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("2"); }} style={[styles.choiceImgConainer, { borderColor: setBtnColor("2") }]}>
                        <Image
                            style={styles.choiceImg}
                            source={{ uri: images.current[problem.PRB_CHOICE2].url }}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                    : <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("2"); }} style={[styles.choiceButton, { backgroundColor: setBtnColor("2") }]}>
                        <Text>{problem.PRB_CHOICE2}</Text>
                    </TouchableOpacity>
            }

            <Text />
            {
                problem.PRB_CHOICE3 in images.current
                    ? <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("3"); }} style={[styles.choiceImgConainer, { borderColor: setBtnColor("3") }]}>
                        <Image
                            style={styles.choiceImg}
                            source={{ uri: images.current[problem.PRB_CHOICE3].url }}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                    : <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("3"); }} style={[styles.choiceButton, { backgroundColor: setBtnColor("3") }]}>
                        <Text>{problem.PRB_CHOICE3}</Text>
                    </TouchableOpacity>
            }

            <Text />
            {
                problem.PRB_CHOICE4 in images.current
                    ? <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("4"); }} style={[styles.choiceImgConainer, { borderColor: setBtnColor("4") }]}>
                        <Image
                            style={styles.choiceImg}
                            source={{ uri: images.current[problem.PRB_CHOICE4].url }}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                    : <TouchableOpacity disabled = { buttonDisabled } onPress={() => { setClick("4"); }} style={[styles.choiceButton, { backgroundColor: setBtnColor("4") }]}>
                        <Text>{problem.PRB_CHOICE4}</Text>
                    </TouchableOpacity>
            }

            <Text />

            {
                // 버튼이 disabled라면 모달에서 사용하는 4지선다 컴포넌트
                // close 버튼을 보여줌
                buttonDisabled ? (
                    <View style = {styles.controlButttonContainer}>
                    <TouchableOpacity 
                      onPress = {() => {setVisible(false)}} 
                      style = {[styles.controlButton, styles.choiceButton,
                        {
                          backgroundColor: '#94AF9F',
                          width: 200
                        }]}>
                      <Text>CLOSE</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                    <View style={styles.controlButttonContainer}>
                    {/* 이전 버튼 */}
                    <TouchableOpacity
                        disabled={index === 0}
                        onPress={() => {
                            setChoice(click);
                            setChoice2(undefined);
                            setClick(undefined);
                            // setClick2(undefined);
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
                            setChoice2(undefined);
                            setClick(undefined);
                            // setClick2(undefined);
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
                )
            }
           
        </View>
    )
}

const styles = StyleSheet.create({
    // 4지선다 내부 IMG
    choiceImg: {
        height: 200
    },

    // 4지선다 Touchable 컨테이너 - Img
    choiceImgConainer: {
        borderWidth: 5
    },

    // 4지선다 Touchable 컨테이너 - Text
    choiceButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
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
    }
})

export default MockProbChoice