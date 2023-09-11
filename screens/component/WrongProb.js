import React, { useState, useEffect, useRef } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { typeName } from '../../lib/utils';

import ProbMain from "./ProbMain";
import ImgRef from "./ImgRef"
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';
import WrongProbChoice from './WrongProbChoice';
import WrongProbChoiceWrite from './WrongProbChoiceWrite';
import AudRef from './AudRef';
import MarkUserAnswer from "./MarkUserAnswer"


export default WrongProb = ({ problem, images, audio, nextBtn, setNextBtn, isSubmit, setIsSubmit, setResultscreen, level, tag, section, userProblems, size }) => {

    useEffect(() => {

        return () => {
            if (audio) {
                console.log("오디오 멈춤")
                audio.stop()
            }
        }
    }, [])


    return (
        <View>
            <ScrollView>
                {
                    // 유저가 문제를 풀었다면 정답 표시
                    userProblems.current[nextBtn] &&
                    <View style = {{top: 10}}>
                    <MarkUserAnswer
                        PRB_CORRT_ANSW={problem.PRB_CORRT_ANSW}
                        PRB_USER_ANSW={userProblems.current[nextBtn].PRB_USER_ANSW}
                    />
                    </View>
                    
                }

                <View style={styles.container}>
                    {
                        problem.PRB_SECT != "WR" &&
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>
                                {typeName(level, section, tag)}
                            </Text>

                            <TouchableOpacity onPress = {() => { 
                                Alert.alert("학습 종료", "학습을 종료하시겠습니까?", [
                                    {text: "yes", onPress: () => setResultscreen(true)}, 
                                    {text: "no"}
                                ])}}>
                                <Text>exit</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {
                        problem.PRB_MAIN_CONT ?
                            <ProbMain PRB_MAIN_CONT={problem.PRB_MAIN_CONT} PRB_NUM={problem.PRB_NUM} /> : null
                    }

                    {
                        problem.AUD_REF ?
                            <AudRef audio={audio} /> : null
                    }

                    {
                        problem.IMG_REF ?
                            <ImgRef IMG_REF={images[problem.IMG_REF]} /> : null
                    }

                    {
                        problem.PRB_TXT ?
                            <ProbTxt PRB_TXT={problem.PRB_TXT} /> : null
                    }

                    {
                        problem.PRB_SUB_CONT ?
                            <ProbSub PRB_SUB_CONT={problem.PRB_SUB_CONT} /> : null
                    }

                    {
                        problem.PRB_SCRPT ?
                            <ProbScrpt PRB_SCRPT={problem.PRB_SCRPT} /> : null
                    }

                    {
                        problem.PRB_SECT != "WR" ?
                            <WrongProbChoice
                                problemsRef={userProblems}
                                images={images}

                                PRB_CHOICE1={problem.PRB_CHOICE1}
                                PRB_CHOICE2={problem.PRB_CHOICE2}
                                PRB_CHOICE3={problem.PRB_CHOICE3}
                                PRB_CHOICE4={problem.PRB_CHOICE4}

                                PRB_CORRT_ANSW={problem.PRB_CORRT_ANSW}
                                PRB_USER_ANSW={userProblems.current[nextBtn] ? userProblems.current[nextBtn].PRB_USER_ANSW : null}

                                nextBtn={nextBtn}
                                setNextBtn={setNextBtn}

                                isSubmit={isSubmit}
                                setIsSubmit={setIsSubmit}

                            /> :
                            <WrongProbChoiceWrite
                                PRB_CORRT_ANSW={problem.PRB_CORRT_ANSW}
                                PRB_USER_ANSW={problem.PRB_USER_ANSW}
                                PRB_USER_ANSW2={problem.PRB_USER_ANSW2}

                                SCORE={problem.SCORE}
                                PRB_POINT={problem.PRB_POINT}
                                ERROR_CONT={problem.ERROR_CONT}
                                TAG={problem.TAG}

                                nextBtn={nextBtn}
                                setNextBtn={setNextBtn}

                                size={size}
                            />
                    }
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    
    // exitButton: {
    //     borderWidth: 1,
    //     padding: 5
    // }
})