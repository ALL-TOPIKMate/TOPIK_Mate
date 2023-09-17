import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native'


import MockAudRef from "./MockAudRef"
import ProbMain from "./ProbMain";
import ImgRef from "./ImgRef"
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';
import LevelProbChoice from './LevelProbChoice';


export default LevelProb = ({ problem, userData, audios, images, setIndex, size, index }) => {

    const audio = audios[problem.AUD_REF]

    useEffect(() => {

        return () => {
            // 오디오 정리
            if (audio) {
                audio.release()
            }
        }

    }, [])


    return (
        <ScrollView style={styles.container}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <Text>{size - index}문제 남았습니다</Text>
                <TouchableOpacity onPress={() => {
                    Alert.alert("레벨테스트 종료", "중단하시겠습니까?", [
                        { text: "yes", onPress: () => setIndex(size + 1) },
                        { text: "no" }
                    ])
                }}>
                    <Text>
                        그만 풀기
                    </Text>
                </TouchableOpacity>
            </View>

            {
                problem.AUD_REF ?
                    <MockAudRef audio={audio} /> : null
            }

            {
                problem.PRB_MAIN_CONT ?
                    <ProbMain PRB_MAIN_CONT={problem.PRB_MAIN_CONT} PRB_NUM={problem.PRB_NUM} /> : null
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


            <LevelProbChoice
                userData={userData}
                PRB_CHOICE1={problem.PRB_CHOICE1}
                PRB_CHOICE2={problem.PRB_CHOICE2}
                PRB_CHOICE3={problem.PRB_CHOICE3}
                PRB_CHOICE4={problem.PRB_CHOICE4}

                images={images}

                setIndex={setIndex}
                size={size}

            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
})