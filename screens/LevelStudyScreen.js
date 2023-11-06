import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)
import Sound from 'react-native-sound';

import UserContext from '../lib/UserContext';
import Loading from './component/Loading';
import LevelProb from './component/LevelProb';
import { sendProblemRecommend } from '../lib/utils';

Sound.setCategory('Playback');


const updateUserField = (lvtestDoc, levelIdx, levelTag) => {

    lvtestDoc.update({
        userIndex: levelIdx,
        userLvtag: levelTag
    })

}



const audioURL = (problem, audioRef, audioStorage, setReadyAudio, countAudio, isComponentMounted) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {
        audioStorage.child(`/${PRB_RSC}/${problem.AUD_REF}`).getDownloadURL().then((url) => {
            const audio = new Sound(url, null, err => {
                if (err) {
                    console.log('Failed to load the sound', err);
                    return undefined;
                }

                // 로드 성공
                console.log(`오디오 로드 성공. ${problem.AUD_REF}`);

                countAudio.current -= 1

                if (countAudio.current == 0 && isComponentMounted.current) {
                    setReadyAudio(true)
                }
            })


            audioRef.current[problem.PRB_ID] = audio
        })
    } catch (err) {
        console.log(err)
    }
}

const imageURL = async (problem, imgRef, imageStorage) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {
        await imageStorage.child(`/${PRB_RSC}/${problem.IMG_REF}`).getDownloadURL().then((url) => {
            imgRef.current[problem.IMG_REF] = url
        })
    } catch (err) {
        console.log(err)
    }
}

const imagesURL = async (problem, imgRef, imageStorage) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE1}`).getDownloadURL().then((url) => {
            imgRef.current[problem.PRB_CHOICE1] = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE2}`).getDownloadURL().then((url) => {
            imgRef.current[problem.PRB_CHOICE2] = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE3}`).getDownloadURL().then((url) => {
            imgRef.current[problem.PRB_CHOICE3] = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problem.PRB_CHOICE4}`).getDownloadURL().then((url) => {
            imgRef.current[problem.PRB_CHOICE4] = url
        })

    } catch (err) {

        console.log(err)

    }
}

async function loadMultimedia(data, imageData, audioData, imageStorage, audioStorage, setIsAudioReady, audioCount, isComponentMounted) {
    for (let i = 0; i < data.length; i++) {
        const imageIndex = data[i].PRB_CHOICE1.search(".png")

        if (data[i].AUD_REF) {
            audioURL(data[i], audioData, audioStorage, setIsAudioReady, audioCount, isComponentMounted)
        } if (data[i].IMG_REF) {
            await imageURL(data[i], imageData, imageStorage)
        } if (imageIndex != -1) {
            await imagesURL(data[i], imageData, imageStorage)
        }
    }

    // console.log("이미지 로드 완료111")
}


const LevelStudyScreen = ({ navigation }) => {

    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);

    // 문제 콜렉션
    const problemColl = firestore().collection("lvtproblems")
        .doc(`LV${USER.level}`).collection(USER.levelTag)

    // 유저 Leveltest 도큐먼트
    const lvtestDoc = firestore().collection("users")
        .doc(USER.uid).collection("leveltest").doc("Leveltest")




    // 문제 데이터셋
    const [data, setData] = useState([])
    const prevProblem = useRef([])
    const userData = useRef([])

    // 멀티미디어 저장
    const audioData = useRef({})
    const imageData = useRef({})


    // 멀티미디어 준비상태
    const [isAudioReady, setIsAudioReady] = useState(false)
    const [isImageReady, setIsImageReady] = useState(false)

    // 문제 그만풀기
    const [resultscreen, setResultscreen] = useState(false)


    // 문제 번호
    const [index, setIndex] = useState(USER.levelIdx)

    // 오디오 카운팅
    const audioCount = useRef(0)
    // 문제풀이개수 카운팅
    const problemCount = useRef(0)

    // 문제풀이시간 타이머
    const startTime = useRef(0)


    const userIndex = USER.levelIdx


    useEffect(() => {

        // 문제 불러오기
        problemColl.get().then(querySnapshot => {
            setData(querySnapshot.docs.map(doc => {
                // 오디오 카운팅
                if(doc.data().AUD_REF){
                    audioCount.current+=1
                }

                return doc.data()
            }))
        })



        return () => {
            isComponentMounted.current = false

            // 오디오 객체 정리
            Object.keys(audioData.current).forEach(item => {
                audioData.current[item].release()
            })

            // RecommendScreen update
            USER.levelIdx = Number(userIndex) + Number(problemCount.current) 

            // firebase update
            // user field
            updateUserField(lvtestDoc, USER.levelIdx, USER.levelTag)


            // wrong
            USER.updateUserWrongColl(prevProblem.current.slice(userIndex, USER.levelIdx), userData.current.slice(userIndex, USER.levelIdx))
            
            // levelHistory
            USER.updateLevelHistoryColl(userData.current.slice(userIndex, USER.levelIdx), USER.levelIdx)
        }

    }, [])


    useEffect(() => {
        if (data.length) {
           
            // deep copy
            prevProblem.current = JSON.parse(JSON.stringify(data))
            userData.current = JSON.parse(JSON.stringify(data))

            // if(audioCount.current == 0 && isComponentMounted.current){
            //     setIsAudioReady(true)
            // }

            loadMultimedia(data, imageData, audioData, imageStorage, audioStorage, setIsAudioReady, audioCount, isComponentMounted).then(() => {
                if(isComponentMounted.current){
                    // console.log("이미지로드완료 222")
                    setIsImageReady(true)
                }
            })

        }
    }, [data])


    useEffect(() => {

        if(isAudioReady && isImageReady){
            // 문제풀이시간 기록
            userData.current[index - 1].ELAPSED_TIME = Date.now() - startTime.current


            // console.log(userData.current[index - 1].ELAPSED_TIME)
            startTime.current = Date.now()


            // 문제풀이개수 카운팅
            problemCount.current++
        
            if(index >= data.length){

                setResultscreen(true)
    
            }
        }
        
    }, [index])


    useEffect(() => {

        if(isAudioReady && isImageReady){
            // 타이머 시작
            startTime.current = Date.now()
            console.log("멀티미디어 준비 완료")
        }else if(isImageReady){
            console.log("오디오 로드중")
        }else if(isAudioReady){
            console.log("사진 로드중")
        }
        
    }, [isAudioReady, isImageReady])


    useEffect(() => {
        if(resultscreen){
            if(index == data.length){
                Alert.alert("진단고사 완료", "수고하셨습니다 잠시 후 추천문제를 풀어보세요! ", [
                    { text: "ok", onPress: () => navigation.pop() },
                ])
            }else{
                navigation.pop()
            }

        }
    }, [resultscreen])




    if(!isImageReady || !isAudioReady){
        return <Loading />
    }else if(index < data.length){
        return (
            <LevelProb
                problem = {data[index]}
                userData = {userData.current[index]}
                audios = {audioData.current}
                images = {imageData.current}

                setIndex = {setIndex}
                setResultscreen = {setResultscreen}

                index = {index}
                size = {data.length}

                key = {`LEVELPROB${index}`}
            />
        )
    }else{
        return null
    }

}

export default LevelStudyScreen