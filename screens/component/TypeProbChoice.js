import React, { useState, useEffect } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Button, Image } from 'react-native'


export default TypeProbChoice = ({ problem, imagesRef, audio, PRB_CHOICE1, PRB_CHOICE2, PRB_CHOICE3, PRB_CHOICE4, PRB_CORRT_ANSW, submitted, setSubmitted, currentIndex, setCurrentIndex, PRB_USER_ANSW, size }) => {

    // 4지선다 이미지 유무
    const isImage = imagesRef[PRB_CHOICE1]

    const [selectedChoice, setSelectedChoice] = useState(PRB_USER_ANSW)


    function handleChoice(choice) {
        setSelectedChoice(choice)
    }


    function setButtonColor(choice) {
        if (submitted) {
            if (choice == PRB_USER_ANSW) {
                if (choice == PRB_CORRT_ANSW) {
                    return '#BAD7E9'
                } else {
                    return "#FFACAC"
                }
            } else {
                if (choice == PRB_CORRT_ANSW) {
                    return '#BAD7E9'
                } else {
                    return "#D9D9D9"
                }
            }

        } else {
            // 유저가 고른 선택지
            if (choice == selectedChoice) {
                return "#BBD6B8"
            } else { // 그 외의 선택지
                return "#D9D9D9"
            }
        }
    }



    // 제출 버튼 클릭
    const handleSubmitProblem = () => {

        problem.push({
            PRB_USER_ANSW: selectedChoice
        })

        setSubmitted(true);
    };



    // 다음 버튼 클릭
    const handleNextProblem = () => {
        if(audio){    
            audio.stop()
        }

        setSelectedChoice(null);
        setSubmitted(false);
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // 이미 푼 문제인지 확인
        if (currentIndex + 1 < problem.length) {
            setSubmitted(true);
        }
    }


    // 이전 버튼 클릭
    const handlePreviousProblem = () => {
        if (currentIndex > 0) {

            if(audio){    
                audio.stop()
            }
            
            setCurrentIndex((prevIndex) => prevIndex - 1);
            setSubmitted(true);
        }
    };




    return (
        <View>
            {
                (isImage) ? (
                    <View style={styles.ImageRow}>
                        <View style={[styles.ImageCol, { marginVertical: 10 }]}>
                            <TouchableOpacity style={[styles.ImageButton, { borderColor: setButtonColor(1), borderWidth: 5 }]} onPress={() => handleChoice(1)} disabled={submitted}>
                                <Image
                                    style={{ height: 120 }}
                                    source={{ uri: imagesRef[PRB_CHOICE1] }}
                                    resizeMode='stretch'
                                />
                            </TouchableOpacity>

                            <View style={{ marginHorizontal: 10 }} />

                            <TouchableOpacity style={[styles.ImageButton, { borderColor: setButtonColor(2), borderWidth: 5 }]} onPress={() => handleChoice(2)} disabled={submitted}>
                                <Image
                                    style={{ height: 120 }}
                                    source={{ uri: imagesRef[PRB_CHOICE2] }}
                                    resizeMode='stretch'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.ImageCol, { marginVertical: 10 }]}>
                            <TouchableOpacity style={[styles.ImageButton, { borderColor: setButtonColor(3), borderWidth: 5 }]} onPress={() => handleChoice(3)} disabled={submitted}>
                                <Image
                                    style={{ height: 120 }}
                                    source={{ uri: imagesRef[PRB_CHOICE3] }}
                                    resizeMode='stretch'
                                />
                            </TouchableOpacity>

                            <View style={{ marginHorizontal: 10 }} />

                            <TouchableOpacity style={[styles.ImageButton, { borderColor: setButtonColor(4), borderWidth: 5 }]} onPress={() => handleChoice(4)} disabled={submitted}>
                                <Image
                                    style={{ height: 120 }}
                                    source={{ uri: imagesRef[PRB_CHOICE4] }}
                                    resizeMode='stretch'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity style={[styles.TextButton, { backgroundColor: setButtonColor(1) }]} onPress={() => handleChoice(1)} disabled={submitted}>
                            <Text>{PRB_CHOICE1}</Text>
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity style={[styles.TextButton, { backgroundColor: setButtonColor(2) }]} onPress={() => handleChoice(2)} disabled={submitted}>
                            <Text>{PRB_CHOICE2}</Text>
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity style={[styles.TextButton, { backgroundColor: setButtonColor(3) }]} onPress={() => handleChoice(3)} disabled={submitted}>
                            <Text>{PRB_CHOICE3}</Text>
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity style={[styles.TextButton, { backgroundColor: setButtonColor(4) }]} onPress={() => handleChoice(4)} disabled={submitted}>
                            <Text>{PRB_CHOICE4}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }


            <Text />
            <Text />

            <View style={styles.buttonSubmitContainer}>
                <TouchableOpacity style={[styles.button, { opacity: (selectedChoice !== null && !submitted) ? 1 : 0.5 }]} onPress={handleSubmitProblem} disabled={selectedChoice === null || submitted === true}>
                    <Text style={styles.textalign}>SUBMIT</Text>
                </TouchableOpacity>
            </View>


            <Text />
            <Text />


            <View style={styles.moveButtonContainer}>
                <TouchableOpacity style={[styles.button, styles.moveButton, currentIndex === 0 && { opacity: 0.5 }]} onPress={handlePreviousProblem} disabled={currentIndex === 0}>
                    <Text style={styles.textalign}>PREV</Text>
                </TouchableOpacity>

                <View style={styles.moveButtonSide}>
                    <Text> {currentIndex + 1} / {size} </Text>
                </View>

                <TouchableOpacity style={[styles.button, styles.moveButton, { opacity: submitted !== false ? 1 : 0.5 }]} onPress={handleNextProblem} disabled={submitted === false}>
                    <Text style={styles.textalign}>NEXT</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    // 4지선다 이미지 가로 줄
    ImageCol: {
        flexDirection: "row",
    },
    // 4자선다 이미지 세로 줄
    ImageRow: {
        flexDirection: "column"
    },

    // 4지선다 이미지
    ImageButton: {
        flex: 1
    },
    // 4지선다 텍스트
    TextButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
    },

    // 제출 버튼 상위 컨테이너
    buttonSubmitContainer: {
        alignItems: "center",
        // justifyContents: "center"
    },

    // 버튼 컨테이너 (submit / next / prev)
    button: {
        backgroundColor: '#AFB9AE',
        borderRadius: 20,

        paddingVertical: 10,
        paddingHorizontal: 30
    },

    // prev next 버튼 
    moveButton: {
        backgroundColor: '#A4BAA1',
        flex: 1
    },

    // prev next 사이의 텍스트 컨테이너 (남은 문제 수 컨테이너)
    moveButtonSide: {
        flex: 0.7,
        alignItems: "center",
        justifyContent: "center"

    },

    moveButtonContainer: {
        flexDirection: "row"
    },

    textalign: {
        textAlign: "center"
    },


})