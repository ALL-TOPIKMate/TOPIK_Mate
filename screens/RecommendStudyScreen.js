import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)


import Sound from 'react-native-sound';

Sound.setCategory('Playback');



import RecommendProb from './component/RecommendProb';
import Loading from './component/Loading';



const audioURL = async(problemList, audioStorage, countAudio, setReadyAudio) =>{
    const PRB_RSC = problemList.PRB_ID.substr(0, problemList.PRB_ID.length-3)

    try{
        await audioStorage.child(`/${PRB_RSC}/${problemList.AUD_REF}`).getDownloadURL().then((url)=>{
            problemList.AUD_URL = new Sound(url, null, err => {
                if (err) {
                    console.log('Failed to load the sound', err);
                    return undefined;
                }
                
            // 로드 성공
            // console.log(`오디오 로드 성공. ${url}`);

            countAudio.current -= 1
            
            if(countAudio.current == 0){
                setReadyAudio(true)
            }
        })
    })
    }catch(err){
        console.log(err)
    }
}

const imageURL = async (problemList, imageStorage) =>{
    const PRB_RSC = problemList.PRB_ID.substr(0, problemList.PRB_ID.length-3)
    
    try{
        await imageStorage.child(`/${PRB_RSC}/${problemList.IMG_REF}`).getDownloadURL().then((url)=>{
            problemList.IMG_URL = url
        })
    }catch(err){
        console.log(err)
    }
}

const imagesURL = async (problemList, imageStorage) =>{
    const PRB_RSC = problemList.PRB_ID.substr(0, problemList.PRB_ID.length-3)
    
    try{

        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE1}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE_URL1 = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE2}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE_URL2 = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE3}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE_URL3 = url
        })
        
        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE4}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE_URL4 = url
        })

    }catch(err){

        console.log(err)

    }
}

const loadMultimedia = async (problemList, audioStorage, imageStorage, setLoadedProblem, countAudio, setReadyAudio) =>{
    // try{
    //     let size = problemList.length

    //     for(var i=0; i<size; i++){
    //         const imageIndex = problemList[i].PRB_CHOICE1.search(".png")

    //         if(problemList[i].AUD_REF){
    //             await audioURL(problemList[i], audioStorage, countAudio, setReadyAudio)
    //         }if(problemList[i].IMG_REF){
    //             await imageURL(problemList[i], imageStorage)
    //         }if(imageIndex != -1){
    //             await imagesURL(problemList[i], imageStorage)
    //         }
    //     }
    // }catch(err){
    //     console.log(err)
    // }
    



    setLoadedProblem(problemList)
}

const RecommendStudyScreen = ({route, navigation}) =>{

    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);

    // 콜렉션 불러오기
    const querySnapshot = route.params.querySnapshot
    const recommendCollection = querySnapshot.doc(route.params.userInfo.userId).collection("recommend")
    const wrongCollection = querySnapshot.doc(route.params.userInfo.userId).collection(`wrong_lv${route.params.userInfo.myLevel}`)




    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json

    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(route.params.userRecommendInfo.userIndex);
    
    // 제출 감지
    const [isSubmit, setIsSubmit] = useState(false)
    



    // 맞은 답 개수
    const correctCount = useRef(0)
    // 푼 문제 개수 
    const problemCount = useRef(0)




    // loading 화면
    // 멀티미디어 로드 상태
    const [readyProblem, setReadyProblem] = useState(false)
    // 오디오 객체 생성 상태
    const [readyAudio, setReadyAudio] = useState(false)


    // 오디오 개수 카운팅
    const countAudio = useRef(0)




    // 추천문제 인덱스 및 정답 수 load
    const userIndex = route.params.userRecommendInfo.userIndex    
    const userCorrect = route.params.userRecommendInfo.userCorrect



    // MOUNT 
    useEffect(()=> {
        // promise 객체를 반환하는 함수
        dataLoading();

        

        // UNMOUNT
        return () => {

            // firebase update
            updateUserAnswer()


            // RecommendScreen update
            route.params.setUserRecommendInfo({
                userIndex: Number(userIndex) + Number(problemCount.current),
                userCorrect: Number(userCorrect)+Number(correctCount.current)
            })

        }

    }, []);



    
    // recommend collection firebase update
    const updateUserAnswer = async () =>{
        await recommendCollection.doc("Recommend").update({
            userIndex: Number(userIndex) + Number(problemCount.current),
            userCorrect: Number(userCorrect)+Number(correctCount.current)
        })
    }



    useEffect(()=>{
        let isChanged = false


       // 문제 풀이 화면에서 나갈시, 
        const beforeRemove = navigation.addListener("beforeRemove", (e)=> {
            
            // 결과화면으로 대체 (replace)
            // 결과화면에서 나갈 때 해당 화면도 언마운트처리가 필요함
            // 화면 정리를 위해 뒤로가기를 막지 않음 
            // VVV 
            if(isChanged){
                return 
            }

            isChanged = true
 

            // 뒤로가기 막음
            e.preventDefault()

            // 해당 화면에서 결과화면으로 대체
            navigation.replace("Result", {CORRT_CNT: correctCount.current, ALL_CNT: problemCount.current, PATH: "Recommend"})
        })

        return () => beforeRemove

    }, [navigation])





    // 문제 데이터 load
    const dataLoading = async () =>{
        try{

            let dataList = []
            const data = await recommendCollection.where("PRB_ID", ">=", "").orderBy("PRB_ID").get()


            data.forEach((doc)=>{
                if(doc._data.PRB_ID){
                    dataList.push(doc._data)
                }
                
                if(doc._data.AUD_REF){ 
                    countAudio.current++
                }
            })


            // console.log(dataList)
            setLoadedProblem(dataList)

        }catch(error){

            console.log(error.message);
        
        }    
    }

    

    // 모든 문제를 불러온 후 멀티미디어 생성하기
    useEffect(()=>{

        if(loadedProblem.length){

            loadMultimedia(loadedProblem, audioStorage, imageStorage, setLoadedProblem, countAudio, setReadyAudio).then(()=>{
                
                // 멀티미디어 로드 완료
                setReadyProblem(true)
                setReadyAudio(true)
            })

        }

    }, [loadedProblem])
    


    // 멀티미디어와 오디오 생성 상태를 출력
    useEffect(()=>{

        if(readyProblem && readyAudio){
            console.log("문제 로드 및 객체 생성 완료")
        }else if(readyProblem){
            console.log("오디오 객체 생성중")
        }else if(readyAudio){
            console.log("멀티미디어 문제 로드중")
        }

    }, [readyProblem, readyAudio])

    

    // 문제 제출시 채점
    useEffect(()=>{
       

        // 제출 버튼 클릭
       
       if(loadedProblem.length && loadedProblem[nextBtn].PRB_USER_ANSW){

        
            // 유저가 답안을 맞췄을 경우
            if(loadedProblem[nextBtn].PRB_CORRT_ANSW == loadedProblem[nextBtn].PRB_USER_ANSW){ 
        

                const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn].PRB_SECT}_TAG`); sectTadDoc.set({})
                

                const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn].TAG);

            
                tagDoc.collection("PRB_LIST").doc(loadedProblem[nextBtn].PRB_ID).delete().then((err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("success to delete data")
                    }

                })
                
                
                // 정답 카운트
                correctCount.current++


            }else{ // 유저가 답안을 틀렸을 경우


                const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn].PRB_SECT}_TAG`); sectTadDoc.set({})
                

                const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn].TAG); tagDoc.set({})

            
                let problem = {}

                Object.keys(loadedProblem[nextBtn]).forEach((key) => {
                    if(key !== "AUD_URL" && key !== "PRB_CHOICE_URL1" && key !== "PRB_CHOICE_URL2" && key !== "PRB_CHOICE_URL3" && key !== "PRB_CHOICE_URL4" && key != "IMG_URL" && key != "PRB_USER_ANSW"){
                        problem[key] = loadedProblem[nextBtn][key]
                    }
                })
                



                tagDoc.collection("PRB_LIST").doc(loadedProblem[nextBtn].PRB_ID).set(problem).then((err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("success to uploading data")
                        // console.log(loadedProblem[nextBtn].PRB_ID)
                    }
                })

            }


            problemCount.current++
        }
       
        
    }, [isSubmit])
    

    if(readyProblem === false || readyAudio === false) {
        return (
            <Loading />
        )
    }else if(nextBtn < loadedProblem.length){
        return (

            <RecommendProb 
                problem = {loadedProblem[nextBtn]} 

                nextBtn={nextBtn} 
                setNextBtn = {setNextBtn} 

                isSubmit = {isSubmit} 
                setIsSubmit = {setIsSubmit}
                
                key = {`RECOMMENDSCREEN${nextBtn}`} 
            />
            
        )
    }else if(nextBtn == loadedProblem.length){
        navigation.replace("Result", {CORRT_CNT: correctCount.current, ALL_CNT: problemCount.current, PATH: "Recommend"})
        
        return (
            <></>
        )
    }else{
        return null
    }


}

export default RecommendStudyScreen;