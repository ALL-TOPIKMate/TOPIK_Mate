import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import storage, { getStorage } from '@react-native-firebase/storage'
import { checkUserSession, createUserSession } from '../lib/auth';

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
import { settingUserStudyTime } from '../lib/utils';


// 이어서 풀기 - 유저가 마지막에 푼 문제 기록 
const updateUserLastVisible = async(lastKey, lastVal) => {
    const user = await checkUserSession()

    user[lastKey] = lastVal

    await createUserSession(user)

    console.log(await checkUserSession())
}


//Reading
const TypeStudyRc = ({ navigation, route }) => {

    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 학습화면에서 머무른 시간 = 학습시간으로 간주
    const USERTIMER = useRef(0)


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



    // 마지막 문제를 가르킴 (5문제씩 읽어옴) - load problem 
    const last = useRef(route.params.lastVisible)
    // 제출 후 문제를 가르킴 (이어서 풀기 기록) - setting session 
    const lastprbRef = useRef(route.params.lastVisible)
    // 해당 섹션의 유형정보 (이어서 풀기) - setting session
    const sectTag = `RD_${route.params.paddedIndex}`



    // 전체 문제 푼 개수
    const [totalProblem, setTotalProblem] = useState(0);
    // 맞은 문제 개수
    const [CorrectProb, setCorrectProb] = useState(0);
    // 문제풀이시간 카운팅
    const startTime = useRef(0)

    // 문제 끝
    const [prbstatus, setprbstatus] = useState(true);

    // 화면 준비상태 (이미지 로드 완료시 true)
    const [isReady, setIsReady] = useState(false)
    



    useEffect(() => {
        
        USERTIMER.current = Date.now()

        // unmount
        return () => {
            isComponentMounted.current = false
            

            // wrong
            USER.updateUserWrongColl(rawProblems.current, prbchoice.current)
            // history
            USER.updateHistoryColl(prbchoice.current)


            
            // 이어서 풀기 - 유형학습 마지막 문제 저장
            updateUserLastVisible(sectTag, lastprbRef.current)

            
            
            // 유저의 학습시간 업데이트
            settingUserStudyTime(Date.now() - USERTIMER.current)
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

        startTime.current = Date.now()

    }, [currentIndex])



    // 5문제씩 읽어오기
    const loadProblems = async () => {
        try {
            const prblist = [];

            // 이어서 불러오기
            let query = problemCollection.orderBy('__name__').limit(5);
            if (last.current) {
                query = query.startAfter(last.current);
            }
            const temp_snapshot = await query.get();

            // 데이터 반환
            temp_snapshot.forEach((doc) => {
                const data = doc.data();
                prblist.push(data);
            });


            // 문제가 없을경우
            if (temp_snapshot.empty && isComponentMounted.current) {
                setprbstatus(false);
            }


            // 문제가 있을경우
            if (prblist.length > 0 && prbstatus == true) {
                const lastDoc = temp_snapshot.docs[temp_snapshot.docs.length - 1];
                if (lastDoc) {
                    const lastDocId = lastDoc.id;

                    last.current = lastDocId
                } else {
                    last.current = null
                }

                // 불러온 문제 셋팅
                if (isComponentMounted.current) {
                    setProblems([...problems, ...prblist]);
                }

            } else {
                console.log('No more problems to load.');

                last.current = null
                lastprbRef.current = null // 모든 문제를 다 풀었을 경우 이어서 풀기 리셋      

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
                PRB_USER_ANSW: prbchoice.current[currentIndex].PRB_USER_ANSW,
                ELAPSED_TIME: Date.now() - startTime.current
            }

            
            // 원본 문제 복사
            rawProblems.current.push(problems[currentIndex])

            if (prbchoice.current[currentIndex].PRB_USER_ANSW == prbchoice.current[currentIndex].PRB_CORRT_ANSW) { //맞춘 갯수 저장
                setCorrectProb(prevCorrectProb => prevCorrectProb + 1);
            }

            setTotalProblem(prevTotalProblem => prevTotalProblem + 1); // 전체 문제 갯수 저장


            // 문제 제출시 기록
            lastprbRef.current = problems[currentIndex].PRB_ID
        }

    }, [submitted])


    useEffect(() => {
        
        if(isReady){
            startTime.current = Date.now()
        }

    }, [isReady])

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