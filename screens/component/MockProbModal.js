import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native'

import ProbMain from './ProbMain';
import ImgRef from './ImgRef';
import ProbTxt from './ProbTxt';
import ProbSub from './ProbSub';
import ProbScrpt from './ProbScrpt';
import MockProbChoice from './MockProbChoice';
import MarkUserAnswer from "./MarkUserAnswer"


const MockProbModal = ({ problem, index, setVisible, images, audios }) => {

    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={true}
            onRequestClose={() => {
                setVisible(false)
                console.log("modal appearance")
            }
            }>
            <ScrollView>
                {/* MarkUserAnswer */}
                <MarkUserAnswer 
                    PRB_CORRT_ANSW={problem[index].PRB_CORRT_ANSW}
                    PRB_USER_ANSW={problem[index].PRB_USER_ANSW || "0"} // 문제를 풀지 않은경우 0
                />

                <View style={styles.container}>
                    
                {/* ProbMain */}
                <ProbMain 
                    PRB_MAIN_CONT={problem[index].PRB_MAIN_CONT} 
                    PRB_NUM={problem[index].PRB_NUM} 
                />

                {/* 이미지 */}
                {
                    problem[index].IMG_REF in images.current
                        ? <ImgRef IMG_REF={images.current[problem[index].IMG_REF].url} />
                        : null
                }

                {/* 문항, 지문 텍스트 */}
                {
                    problem[index].PRB_TXT !== ''
                        ? <ProbTxt PRB_TXT={problem[index].PRB_TXT} />
                        : null
                }
                {
                    problem[index].PRB_SUB_CONT !== ''
                        ? <ProbSub PRB_SUB_CONT={problem[index].PRB_SUB_CONT} />
                        : null
                }
                {
                    problem[index].PRB_SCRPT !== ''
                        ? <ProbScrpt PRB_SCRPT={problem[index].PRB_SCRPT} />
                        : null
                }



                {
                    problem[index].PRB_SECT === "LS" || problem[index].PRB_SECT === "RD"
                        ? <MockProbChoice
                            problem={problem[index]}
                            images={images}
                            index={index}

                            buttonDisabled={true}
                            setVisible={setVisible}
                        // problem, images, choice, setChoice, setChoice2, index, setIndex, setDirection, probListLength, buttonDisabled
                        />

                        : null
                }

                </View>
            </ScrollView>
        </Modal>
    );

};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },

})

export default MockProbModal;
