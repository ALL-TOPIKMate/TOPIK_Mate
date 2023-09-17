import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)
import Sound from 'react-native-sound';

import UserContext from '../lib/UserContext';
import Loading from './component/Loading';
import LevelProb from './component/LevelProb';


Sound.setCategory('Playback');




const audioURL = async (problem, audioRef, audioStorage, setReadyAudio, countAudio, isComponentMounted) => {
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

                countAudio.current -= 1

                if (countAudio.current == 0 && isComponentMounted.current) {
                    setReadyAudio(true)
                }
            })


            audioRef.current[problem.AUD_REF] = audio
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
            await audioURL(data[i], audioData, audioStorage, setIsAudioReady, audioCount, isComponentMounted)
        } if (data[i].IMG_REF) {
            await imageURL(data[i], imageData, imageStorage)
        } if (imageIndex != -1) {
            await imagesURL(data[i], imageData, imageStorage)
        }
    }


}


const LevelTestScreen = ({ navigation }) => {

    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);

    // 문제 콜렉션
    const problemColl = firestore().collection("problems")
        .doc("LV2").collection("PQ")
        .doc("0052").collection("PRB_LIST")


    // 문제 데이터셋
    const [data, setData] = useState([])
    const userData = useRef([])

    // 멀티미디어 저장
    const audioData = useRef({})
    const imageData = useRef({})


    // 멀티미디어 준비상태
    const [isAudioReady, setIsAudioReady] = useState(false)
    const [isImageReady, setIsImageReady] = useState(false)

    // 문제 번호
    const [index, setIndex] = useState(0)

    // 오디오 카운팅
    const audioCount = useRef(0)

    // 문제풀이시간 타이머
    const startTime = useRef(0)



    useEffect(() => {

        // 문제 불러오기
        problemColl.limit(5).get().then(querySnapshot => {

            let DATA = querySnapshot.docs.map(doc => {
                if (doc._data.AUD_REF) {
                    audioCount.current++
                }
                return doc.data()
            })

            if(isComponentMounted.current){
                setData(DATA)
            }
        })


        return () => {
            isComponentMounted.current = false
        }

    }, [])


    useEffect(() => {
        if (data.length) {
            // console.log(data)

            if(audioCount.current == 0 && isComponentMounted.current){
                setIsAudioReady(true)
            }

            loadMultimedia(data, imageData, audioData, imageStorage, audioStorage, setIsAudioReady, audioCount, isComponentMounted).then(() => {
                if(isComponentMounted.current){
                    setIsImageReady(true)
                }
            })

        }
    }, [data])


    useEffect(() => {

        if(index > 0 && index - 1 < data.length){

            // 유저 답안 포함한 문제 기록
            // 유저 아이디는 회원가입 후 기록
            userData.current[index - 1] = {
                PRB_ID: data[index - 1].PRB_ID,
                PRB_CORRT_ANSW: data[index - 1].PRB_CORRT_ANSW,
                TAG: data[index - 1].TAG,

                PRB_USER_ANSW: userData.current[index - 1].PRB_USER_ANSW,
                ELAPSED_TIME: Date.now() - startTime.current
            }

            // console.log(userData.current[index - 1].ELAPSED_TIME)
            startTime.current = Date.now()
        }
        if(index > 0 && index >= data.length){

            navigation.replace("Signup", {problem: userData.current})
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



    if(!isImageReady || !isAudioReady || index >= data.length){
        return <Loading />
    }else{
        return (
            <LevelProb
                problem = {data[index]}
                userData = {userData.current}
                audios = {audioData.current}
                images = {imageData.current}

                setIndex = {setIndex}

                index = {index}
                size = {data.length}

                key = {`LEVELPROB${index}`}
            />
        )
        
    }
}

export default LevelTestScreen