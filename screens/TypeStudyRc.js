import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import storage, { getStorage } from '@react-native-firebase/storage'

import AppNameHeader from './component/AppNameHeader';
import UserContext from '../lib/UserContext';
import Loading from './component/Loading';
import ProbMain from './component/ProbMain';
import ProbTxt from "./component/ProbTxt";
import ImgRef from "./component/ImgRef"
import ProbSub from './component/ProbSub';
import ProbScrpt from './component/ProbScrpt';
import TypeProbChoice from './component/TypeProbChoice';
import MarkUserAnswer from './component/MarkUserAnswer';


//Reading
const TypeStudyRc = ({ navigation, route }) => {

    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 멀티미디어
    const storage = getStorage(firebase);
    const imageStorage = storage.ref().child(`/images`);


    // 유저가 고른 유형의 문제 콜렉션
    const problemCollection = firestore().collection('problems').doc(`LV${USER.level}`)
        .collection(route.params.source)
        .doc(route.params.paddedIndex)
        .collection('PRB_LIST');


    //문제 데이터 적재
    const [problems, setProblems] = useState([]);
    // 원본 문제 (손상 x)
    const rawProblems = useRef([])
    // 유저 답안
    const prbchoice = useRef([])
    // 이미지 데이터 적재
    const imagesRef = useRef({})


    const [currentIndex, setCurrentIndex] = useState(0); //현재 문제 번호
    const [submitted, setSubmitted] = useState(false); //제출여부 
    const [Last, setLast] = useState(null) //문제 기준 잡기



    // 전체 문제 푼 개수
    const [totalProblem, setTotalProblem] = useState(0);
    // 맞은 문제 개수
    const [CorrectProb, setCorrectProb] = useState(0);


    // 문제 끝
    const [prbstatus, setprbstatus] = useState(true);

    // 화면 준비상태 (이미지 로드 완료시 true)
    const [isReady, setIsReady] = useState(false)



    useEffect(() => {

        // unmount
        return () => {
            isComponentMounted.current = false
            // console.log(rawProblems.current)
            // console.log(prbchoice.current)

            // 유저 오답 반영
            USER.updateUserWrongColl(rawProblems.current, prbchoice.current)
        }

    }, [])


    useEffect(() => {
        // 문제 로드 
        if (problems.length) {
            // 이미지 로드
            ImageLoading().then(() => {
                
                if(isComponentMounted.current){
                    setIsReady(true)
                }
                
            })
        }
    }, [problems]);


    useEffect(() => {
        
        // 문제를 다 읽었을 경우 더 불러옴
        if(currentIndex == problems.length && isComponentMounted.current){

            loadProblems()
            setIsReady(false)

        }

    }, [currentIndex])



    // 5문제씩 읽어오기
    const loadProblems = async () => {
        try {
            const prblist = [];

            let query = problemCollection.orderBy('__name__').limit(5);
            if (Last) {
                query = query.startAfter(Last);
            }
            const temp_snapshot = await query.get();

            temp_snapshot.forEach((doc) => {
                const data = doc.data();
                prblist.push(data);
            });
            if (temp_snapshot.empty && isComponentMounted.current) {
                setprbstatus(false);
            }

            if (prblist.length > 0 && prbstatus == true) {
                const lastDoc = temp_snapshot.docs[temp_snapshot.docs.length - 1];
                // console.log('문제 끝: ', lastDoc.id);
                if (lastDoc) {
                    const lastDocId = lastDoc.id;

                    if(isComponentMounted.current){
                        setLast(lastDocId);
                    }
                    
                } else {
                    if(isComponentMounted.current){
                        setLast(null);
                    }
                    
                }

                if(isComponentMounted.current){
                    setProblems([...problems, ...prblist]);
                }
                

            } else {
                console.log('No more problems to load.');
                if(isComponentMounted.current){
                    setLast(null);
                }
                
            }
        } catch (error) {
            console.log(error);
        }

    };


    // IMG_REF 로드
    const ImageLoading = async () => {
        try {
            for (let curr = currentIndex; curr < problems.length; curr++) {
                if (problems[curr].IMG_REF) {

                    const prbslice = problems[curr].PRB_ID.slice(0, problems[curr].PRB_ID.length - 3)

                    await imageStorage.child(`/${prbslice}/${problems[curr].IMG_REF}`).getDownloadURL().then((url)=>{
                        imagesRef.current[problems[curr].IMG_REF] = url
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }
    }



    useEffect(() => {
        if (submitted && currentIndex == rawProblems.current.length) {

            prbchoice.current[currentIndex] = {
                ...problems[currentIndex],
                PRB_USER_ANSW: prbchoice.current[currentIndex].PRB_USER_ANSW
            }


            // 원본 문제 복사
            rawProblems.current.push(problems[currentIndex])

            if (prbchoice.current[currentIndex].PRB_USER_ANSW == prbchoice.current[currentIndex].PRB_CORRT_ANSW) { //맞춘 갯수 저장
                setCorrectProb(prevCorrectProb => prevCorrectProb + 1);
            }

            setTotalProblem(prevTotalProblem => prevTotalProblem + 1); // 전체 문제 갯수 저장


        }
    }, [submitted])


    // 문제풀이 결과화면으로 이동
    useEffect(() => {
        if (!prbstatus) {
            navigation.replace("Result", { CORRT_CNT: CorrectProb, ALL_CNT: totalProblem, PATH: "Home" })
        }
    }, [prbstatus])




    if (!isReady || currentIndex == problems.length) {
        return (
            <Loading />
        )
    } else {
        return (
            <ScrollView>
                {
                    prbchoice.current[currentIndex] && 
                    <View style = {{top: 10}}>
                        <MarkUserAnswer 
                            PRB_CORRT_ANSW={problems[currentIndex].PRB_CORRT_ANSW}
                            PRB_USER_ANSW={prbchoice.current[currentIndex].PRB_USER_ANSW}
                        />
                    </View>
                }

                <View style={styles.container}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>
                            {route.params.tag}
                        </Text>

                        <TouchableOpacity onPress={() => {
                            Alert.alert("학습 종료", "학습을 종료하시겠습니까?", [
                                { text: "yes", onPress: () =>  setprbstatus(false) },
                                { text: "no" }
                            ])
                        }}>
                            <Text>exit</Text>
                        </TouchableOpacity>
                    </View>


                    <ProbMain 
                        PRB_MAIN_CONT={problems[currentIndex].PRB_MAIN_CONT} 
                        PRB_NUM={currentIndex + 1} 
                    />

                    {
                        // IMG_REF
                        problems[currentIndex].IMG_REF ?
                            <ImgRef IMG_REF={imagesRef.current[problems[currentIndex].IMG_REF]} /> : null

                    }

                    {
                        // PRB_TXT
                        problems[currentIndex].PRB_TXT ?
                            <ProbTxt PRB_TXT={problems[currentIndex].PRB_TXT} /> : null

                    }

                    {
                        // PRB_SUB_CONT
                        problems[currentIndex].PRB_SUB_CONT ? 
                            <ProbSub PRB_SUB_CONT = {problems[currentIndex].PRB_SUB_CONT} />: null
                    }

                    {
                        // PRB_SCRPT
                        problems[currentIndex].PRB_SCRPT ? 
                            <ProbScrpt PRB_SCRPT = {problems[currentIndex].PRB_SCRPT} />: null
                    }

                    <TypeProbChoice 
                        problem={prbchoice.current}
                        imagesRef={imagesRef.current} // rc영역은 4지선다가 모두 텍스트

                        // audio={audiosRef.current[problems[currentIndex].AUD_REF]} // 오디오 제어

                        PRB_CHOICE1={problems[currentIndex].PRB_CHOICE1}
                        PRB_CHOICE2={problems[currentIndex].PRB_CHOICE2}
                        PRB_CHOICE3={problems[currentIndex].PRB_CHOICE3}
                        PRB_CHOICE4={problems[currentIndex].PRB_CHOICE4}
                        PRB_CORRT_ANSW={problems[currentIndex].PRB_CORRT_ANSW}

                        submitted={submitted}
                        setSubmitted={setSubmitted}

                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}

                        PRB_USER_ANSW={prbchoice.current[currentIndex] ? prbchoice.current[currentIndex].PRB_USER_ANSW : null}

                        size={problems.length}
                    />
                </View>
                <View style = {{ height: 50}}/>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    outButton: {
        width: 20,
        height: 20,
        right: 10,
    },
   
});

export default TypeStudyRc;