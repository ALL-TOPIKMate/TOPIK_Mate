import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


import ProbMain from './ProbMain';
import ImgRef from './ImgRef';
import ProbScrpt from './ProbScrpt';
import ProbTxt from './ProbTxt';
import ProbSub from './ProbSub';
import MockProbChoice from './MockProbChoice';
import MockProbChoiceWrite from './MockProbChoiceWrite';
import MockAudRef from './MockAudRef';



const MockProb = ({ problem, choice, setChoice, choice2, setChoice2, index, setIndex, setIsEnd, probListLength, setDirection, images, audios }) => {


    // 오디오 파일이 있으면 audio Object 가져오기
    let audio = undefined;
    if (problem.AUD_REF in audios.current) {
        audio = audios.current[problem.AUD_REF].URL;
    }



    // 언마운트 시 자원 삭제
    useEffect(() => {
        return () => {
            if (audio !== undefined) {
                console.log("오디오 멈춤")
                audio.stop() // 오디오 일시정지, release시 오디오 재생 불가능
            }
        };
    }, []);


    return (
        <View>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setIsEnd(true);
                    }}
                    style={styles.exitBtn}>
                    <Text>Exit</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View>
                    {/* 오디오 */}
                    {
                        problem.AUD_REF in audios.current
                            ? <MockAudRef audio = { audio }/>
                            : null
                    }

                    {/* ProbMain */}
                    <ProbMain PRB_MAIN_CONT={problem.PRB_MAIN_CONT} PRB_NUM={problem.PRB_NUM} />


                    {/* 이미지 */}
                    {
                        problem.IMG_REF in images.current
                            ? <ImgRef IMG_REF={images.current[problem.IMG_REF].url} />
                            : null
                    }

                    {/* 문항, 지문 텍스트 */}
                    {
                        problem.PRB_TXT !== ''
                            ? <ProbTxt PRB_TXT={problem.PRB_TXT} />
                            : null
                    }
                    {
                        problem.PRB_SUB_CONT !== ''
                            ? <ProbSub PRB_SUB_CONT={problem.PRB_SUB_CONT} />
                            : null
                    }
                    {
                        problem.PRB_SCRPT !== ''
                            ? <ProbScrpt PRB_SCRPT={problem.PRB_SCRPT} />
                            : null
                    }
                </View>


                <View>
                    {
                        problem.PRB_SECT === "LS" || problem.PRB_SECT === "RD"
                            ? <MockProbChoice
                                problem={problem}
                                images={images}
                                choice={choice}
                                // choice2={choice2}
                                setChoice={setChoice}
                                setChoice2={setChoice2}
                                index={index}
                                setIndex={setIndex}
                                setDirection={setDirection}
                                probListLength={probListLength}

                                buttonDisabled = {false}
                            />
                            :
                                <MockProbChoiceWrite
                                    problem={problem}
                                    choice={choice}
                                    choice2={choice2}
                                    setChoice={setChoice}
                                    setChoice2={setChoice2}
                                    index={index}
                                    setIndex={setIndex}
                                    setDirection={setDirection}
                                    probListLength={probListLength}
                                />
                            
                    }

                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    // 나가기 버튼
    exitBtn: {
        width: 50,
        left: 300,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#D9D9D9',
    },
})

export default MockProb;
