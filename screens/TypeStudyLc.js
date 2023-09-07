import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { subscribeAuth } from "../lib/auth";
import firebase from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)

import Sound from 'react-native-sound';

import AppNameHeader from './component/AppNameHeader';
import UserContext from '../lib/UserContext';
import Loading from './component/Loading';
import AudRef from './component/AudRef';
import ProbMain from './component/ProbMain';
import ProbSub from './component/ProbSub';
import TypeProbChoice from './component/TypeProbChoice';
import MarkUserAnswer from "./component/MarkUserAnswer"


Sound.setCategory('Playback');


const audioURL = async (problem, audiosRef, audioStorage, audioCount, setIsAudReady, isComponentMounted) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {
        await audioStorage.child(`/${PRB_RSC}/${problem.AUD_REF}`).getDownloadURL().then((url) => {
            const audio = new Sound(url, null, err => {
                if (err) {
                    console.log('Failed to load the sound', err);
                    return undefined;
                }

                // 로드 성공
                // console.log(`오디오 로드 성공. ${url}`);

                audioCount.current--

                if (audioCount.current == 0 && isComponentMounted.current) {
                    setIsAudReady(true)
                }
            })


            audiosRef.current[problem.AUD_REF] = audio
        })
    } catch (err) {
        console.log(err)
    }
}

const imagesURL = async (problem, imagesRef, imageStorage) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE1}`).getDownloadURL().then((url) => {
            imagesRef.current[problem.PRB_CHOICE1] = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE2}`).getDownloadURL().then((url) => {
            imagesRef.current[problem.PRB_CHOICE2] = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE3}`).getDownloadURL().then((url) => {
            imagesRef.current[problem.PRB_CHOICE3] = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE4}`).getDownloadURL().then((url) => {
            imagesRef.current[problem.PRB_CHOICE4] = url
        })

    } catch (err) {

        console.log(err)

    }
}


async function loadMultimedia(problems, imagesRef, audiosRef, imageStorage, audioStorage, setIsAudReady, currentIndex, audioCount, isComponentMounted) {
    try {
        for (let i = currentIndex; i < problems.length; i++) {

            const imageIndex = problems[i].PRB_CHOICE1.search(".png")

            if (problems[i].AUD_REF) {
                await audioURL(problems[i], audiosRef, audioStorage, audioCount, setIsAudReady, isComponentMounted)
            } if (imageIndex != -1) {
                await imagesURL(problems[i], imagesRef, imageStorage)
            }

        }
    } catch (err) {
        console.log(err)
    }
}

//Listening
const TypeStudyLc = ({ navigation, route }) => {


    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);


    // 콜렉션 정의
    const problemCollection = firestore().collection('problems').doc(`LV${USER.level}`)
        .collection(route.params.source)
        .doc(route.params.paddedIndex)
        .collection('PRB_LIST');



    // 문제 
    const [problems, setProblems] = useState([]);
    const rawProblems = useRef([])

    // 이미지 및 오디오 
    const imagesRef = useRef({})
    const audiosRef = useRef({})


    // 현재 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);
    // 제출 여부
    const [submitted, setSubmitted] = useState(false);

    // 유저 답안 리스트
    const prbchoice = useRef([])


    // 마지막 문제를 가르킴 (5문제씩 읽어옴)
    const [Last, setLast] = useState(null)


    // 이미지 준비 상태
    const [isImageReady, setIsImageReady] = useState(false);
    // 오디오 준비 상태
    const [isAudReady, setIsAudReady] = useState(false)
    // 더이상 문제가 없는지 확인 - 문제풀이 결과화면으로 이동
    const [prbstatus, setprbstatus] = useState(true);




    // 푼 문제 개수 카운팅
    const [totalProblem, setTotalProblem] = useState(0);
    // 맞은 문제 개수 카운팅
    const [CorrectProb, setCorrectProb] = useState(0);
    // 오디오 카운팅
    const audioCount = useRef(0)



    useEffect(() => {

        // unmount
        return () => {
            isComponentMounted.current = false

            // 모든 오디오 release 해줌
            Object.keys(audiosRef.current).forEach((key) => {
                audiosRef.current[key].release()
            })


            // 복습 업로드 연결
            // console.log(rawProblems.current)
            // console.log(prbchoice.current)
            USER.updateUserWrongColl(rawProblems.current, prbchoice.current)
        }

    }, [])


    useEffect(() => {

        // 문제가 없을 경우 더 가져옴
        if (problems.length === currentIndex) {
            audioCount.current = 0

            loadProblems()


            // 화면 준비상태
            if(isComponentMounted.current){
                setIsImageReady(false)
                setIsAudReady(false)
            }
           
        }

    }, [currentIndex]);


    useEffect(() => {

        // 문제가 load되었다면 멀티미디어를 불러옴
        if (problems.length) {

            // console.log(problems)
            // console.log(audioCount.current)
            loadMultimedia(problems, imagesRef, audiosRef, imageStorage, audioStorage, setIsAudReady, currentIndex, audioCount, isComponentMounted).then(() => {
                
                if(isComponentMounted.current){
                    setIsImageReady(true)
                }
                
            })

        }

    }, [problems])


    useEffect(() => {
        if (isImageReady && isAudReady) {
            console.log("멀티미디어 로드 완료")
        } else if (isImageReady) {
            console.log("오디오 로드중")
        } else if (isAudReady) {
            console.log("이미지 로드중")
        } else {
            console.log("멀티미디어 로드중")
        }
    }, [isAudReady, isImageReady])



    useEffect(() => {
        if (!prbstatus) {
            navigation.replace("Result", { CORRT_CNT: CorrectProb, ALL_CNT: totalProblem, PATH: "Home" })
        }
    }, [prbstatus])





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

                if (doc._data.AUD_REF) {
                    audioCount.current++
                }
            });
            if (temp_snapshot.empty && isComponentMounted.current) {
                setprbstatus(false);
            }

            if (prblist.length > 0 && prbstatus == true) {
                const lastDoc = temp_snapshot.docs[temp_snapshot.docs.length - 1];
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




    if (!isImageReady || !isAudReady || currentIndex == problems.length) {
        return (
            <Loading />
        )
    }
    else {
        return (
            <ScrollView>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setprbstatus(false)}>
                        <View>
                            <Image
                                source={require('../assets/out-icon.png')}
                                style={styles.outButton}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                {
                    prbchoice.current[currentIndex] && 
                        <MarkUserAnswer 
                            PRB_CORRT_ANSW={problems[currentIndex].PRB_CORRT_ANSW}
                            PRB_USER_ANSW={prbchoice.current[currentIndex].PRB_USER_ANSW}
                        />
                }

                <View style={styles.container}>


                    <ProbMain 
                        PRB_NUM={currentIndex + 1} 
                        PRB_MAIN_CONT={problems[currentIndex].PRB_MAIN_CONT} 
                    />

                    <AudRef audio={audiosRef.current[problems[currentIndex].AUD_REF]} />

                    <ProbSub PRB_SUB_CONT={problems[currentIndex].PRB_SUB_CONT} />

                    <TypeProbChoice

                        problem={prbchoice.current}
                        imagesRef={imagesRef.current}

                        audio={audiosRef.current[problems[currentIndex].AUD_REF]} // 오디오 제어

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

export default TypeStudyLc;