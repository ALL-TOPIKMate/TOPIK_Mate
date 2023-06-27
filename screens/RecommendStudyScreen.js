import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)


import Sound from 'react-native-sound';

Sound.setCategory('Playback');



import RecommendProb from './component/RecommendProb';
import Loading from './component/Loading';



const audioURL = async(problemList, audioStorage) =>{
    const PRB_RSC = problemList.PRB_ID.substr(0, problemList.PRB_ID.length-3)

    try{
        await audioStorage.child(`/${PRB_RSC}/${problemList.AUD_REF}`).getDownloadURL().then((url)=>{
            problemList.AUD_URL = new Sound(url, null, err => {
                    if (err) {
                        console.log('Failed to load the sound', err);
                        return undefined;
                    }
                    
                // 로드 성공
                console.log(`오디오 로드 성공. ${url}`);
            })
            // console.log(`콜백함수 안 ${url}`)
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
            // console.log(`콜백함수 안 ${url}`)
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

const loadMultimedia = async (problemList, audioStorage, imageStorage, setLoadedProblem) =>{
    /*try{
        let size = problemList.length

        for(var i=0; i<size; i++){
            const imageIndex = problemList[i].PRB_CHOICE1.search(".png")

            if(problemList[i].AUD_REF){
                await audioURL(problemList[i], audioStorage)
            }if(problemList[i].IMG_REF){
                await imageURL(problemList[i], imageStorage)
            }if(imageIndex != -1){
                await imagesURL(problemList[i], imageStorage)
            }
        }
    }catch(err){
        console.log(err)
    }
    */
    // console.log(problemList)

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
    
    // 4지선다 컴포넌트에서 사용자가 고른 답을 저장
    const choiceRef = useRef(0);
    
    // 유저 답안 기록
    const answerRef = useRef([]);


    // 맞은 답 렌더링
    const [correct, setCorrect] = useState(-1);
    // 맞은 답 개수
    const correctCount = useRef(0)
    // 푼 문제 개수 
    const problemCount = useRef(0)

    // loading 시간 
    const [ready, setReady] = useState(false);


    // 추천문제 인덱스 및 정답 수 load
    const userIndex = route.params.userRecommendInfo.userIndex    
    const userCorrect = route.params.userRecommendInfo.userCorrect




    // recommend collection firebase update
    const updateUserAnswer = async () =>{
        await recommendCollection.doc("Recommend").update({
            userIndex: Number(userIndex) + Number(problemCount.current),
            userCorrect: Number(userCorrect)+Number(correctCount.current)
        })
    }


    // MOUNT 
    useEffect(()=> {
        // promise 객체를 반환하는 함수
        dataLoading();

        

        return () => {
            console.log("문제 풀이 완료")

            // update Recommend document's field
            updateUserAnswer()

            // update RecommendScreen
            route.params.setUserRecommendInfo({
                userIndex: Number(userIndex) + Number(problemCount.current),
                userCorrect: Number(userCorrect)+Number(correctCount.current)
            })

            //navigation.navigate("Result", {CORRT_CNT: correctCount.current, ALL_CNT: problemCount.current, PATH: "Recommend"})
        }
    }, []);


    useEffect(()=>{
        let show = false
        // 문제 풀이 화면에서 나갈시, 
        const beforeRemove = navigation.addListener("beforeRemove", (e)=> {
            if(show){
                
            }     
            
            show = true
            e.preventDefault()

            // console.log(navigation.getState())
            navigation.navigate("Result", {CORRT_CNT: correctCount.current, ALL_CNT: problemCount.current, PATH: "Recommend"})
        })


        return beforeRemove
    }, [navigation])
    

    // 문제 데이터 load
    const dataLoading = async () =>{
        try{
            let dataList = []
            const data = await recommendCollection.where("PRB_ID", ">=", "").orderBy("PRB_ID").get()

            data.forEach((doc)=>{
                if(doc._data.PRB_ID)
                    dataList.push(doc._data)
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
            loadMultimedia(loadedProblem, audioStorage, imageStorage, setLoadedProblem).then(()=>{
                setReady(true)
            })
        }
    }, [loadedProblem])
    


    useEffect(()=>{
        if(ready){ // 모든 이미지, 오디오 데이터가 로드되었을 때
            // console.log(loadedProblem)
        }
    }, [ready])


    
    useEffect(()=>{
        // 다음 문제를 넘길 때 이전 문제 기록
        if(nextBtn>0 && choiceRef.current != 0){

            loadedProblem[nextBtn-1].PRB_USER_ANSW = choiceRef.current

     
            if(loadedProblem[nextBtn-1].PRB_CORRT_ANSW == loadedProblem[nextBtn-1].PRB_USER_ANSW){ 
        
                // 유저가 답안을 맞췄을 경우

                const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn-1].PRB_SECT}_TAG`); sectTadDoc.set({})
                

                const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn-1].TAG);

                console.log(tagDoc.get()._data)
            
                tagDoc.collection("PRB_LIST").doc(loadedProblem[nextBtn-1].PRB_ID).delete().then((err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("success to delete data")
                    }

                })
                
                
                // 정답 카운트
                correctCount.current++
            }else{

                // 유저가 답안을 틀렸을 경우


                const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn-1].PRB_SECT}_TAG`); sectTadDoc.set({})
                

                const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn-1].TAG); tagDoc.set({})

            
                let problem = {}

                Object.keys(loadedProblem[nextBtn-1]).forEach((key) => {
                    if(key !== "AUD_URL" && key !== "PRB_CHOICE_URL1" && key !== "PRB_CHOICE_URL2" && key !== "PRB_CHOICE_URL3"&& key !== "PRB_CHOICE_URL4" && key != "IMG_URL" && key != "PRB_USER_ANSW"){
                        problem[key] = loadedProblem[nextBtn - 1][key]
                    }
                })
                



                tagDoc.collection("PRB_LIST").doc(loadedProblem[nextBtn-1].PRB_ID).set(problem).then((err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("success to uploading data")
                        // console.log(loadedProblem[nextBtn-1].PRB_ID)
                    }
                })

            }


            problemCount.current++
        }
        
        if(nextBtn > 0 && nextBtn == loadedProblem.length){
            setCorrect(userCorrect + correctCount.current)
            return 
        }

        choiceRef.current = 0;
    }, [nextBtn])
    

    return (
        <View style = {{flex: 1}}>

            {
                (ready === false) ? 
                    (<Loading />) : 
                        ( correct == -1 && nextBtn < 10)? 
                            ( <RecommendProb problem = {loadedProblem[nextBtn]} nextBtn={nextBtn} setNextBtn = {setNextBtn} choiceRef = {choiceRef} key = {nextBtn} /> ) :
                            ( navigation.navigate("Result", {CORRT_CNT: correctCount.current, ALL_CNT: problemCount.current, PATH: "Recommend"}) )
        
            }

        </View>
    );
}

export default RecommendStudyScreen;