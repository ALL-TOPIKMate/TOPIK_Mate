import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Loading from './component/Loading';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)



import Sound from 'react-native-sound';

Sound.setCategory('Playback');



import WrongProb from './component/WrongProb';
import Result from "./component/Result";




const audioURL = async(problemList, audioStorage) =>{
    const PRB_RSC = problemList.PRB_ID.substr(0, problemList.PRB_ID.length-3)

    try{
        await audioStorage.child(`/${PRB_RSC}/${problemList.AUD_REF}`).getDownloadURL().then((url)=>{
            problemList.AUD_REF = new Sound(url, null, err => {
            if (err) {
                console.log('Failed to load the sound', err);
                return undefined;
            }
        
            // 로드 성공
            console.log(`오디오 로드 성공. ${url}`);
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
            problemList.IMG_REF = url
            // console.log(`콜백함수 안 ${url}`)
        })
    }catch(err){
        console.log(err)
    }
}

const imagesURL = async (problemList, imageStorage) =>{
    const PRB_RSC = problemList.PRB_ID.substr(0, problemList.PRB_ID.length-3)
    
    try{
        problemList.isImage = true

        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE1}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE1 = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE2}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE2 = url
        })

        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE3}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE3 = url
        })
        
        await imageStorage.child(`/${PRB_RSC}/${problemList.PRB_CHOICE4}`).getDownloadURL().then((url) => {
            problemList.PRB_CHOICE4 = url
        })

    }catch(err){
        console.log(err)
    }
}

const loadMultimedia = async (problemList, audioStorage, imageStorage) =>{
    try{
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
}





// route.params.key = {"select", "random", "write"}
// route.params.userTag로 유형을 나눔

// write인 경우 userTag, order
// select, random인 경우 userTag 

const WrongStudyScreen = ({route, navigation}) =>{

    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);



    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json


    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(route.params.order); // WR 영역에 의한 order 값 셋팅
    
    
    // 문제 풀이 후 맞은 문제 렌더링
    const [correct, setCorrect] = useState(0);

    // 맞은 문제 카운팅
    const correctCount = useRef(0)
    // 푼 문제 카운팅 
    const problemCount = useRef(0)


    // 4지선다 컴포넌트에서 사용자가 고른 답을 저장
    const choiceRef = useRef(0);

    

    

    // 문제를 불러오기 전일때 false
    const [ready, setReady] = useState(false) 



    // 현재 userTag의 인덱스를 가르킴 ex. [{tagName: 001, section: "LS"} ,{tagName: 003, section: "LS"}, {tagName: 002, section: "RD"}]
    const typeRef = useRef(0);

    // 로드한 데이터의 마지막 문제를 가르킴
    const lastVisible = useRef(null);

    
    // 유저의 복습하기 콜렉션을 load
    const querySnapshot = route.params.querySnapshot
    const wrongCollection = (route.params.key !== "write") ? (querySnapshot.doc(route.params.userInfo.userId).collection(`wrong_lv${route.params.userInfo.myLevel}`)) : null
    

    useEffect(()=>{
        if(route.params.key == "select" || route.params.key == "random"){ 
            loadProblem()
        }else if(route.params.key =="write"){
            allLoadProblem()
        }

        return () => {
            console.log("복습하기 화면에서 나감")
        }
    }, [])


    // 쓰기 영역 - 최대 10문제를 한번에 불러옴
    const allLoadProblem = () =>{
        
        async function dataLoading(){
            try{
                let problemList = []

                const data = await querySnapshot.get(); // 요청한 데이터가 반환되면 다음 줄 실행
                

                data.docs.forEach((doc) => {if(doc._data.DATE) problemList.push(doc._data)})
            

                // 멀티미디어 load
                await loadMultimedia(problemList, audioStorage, imageStorage)

                setLoadedProblem(problemList)

            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading().then(()=>{
            setReady(true)
        })
    }


    // 듣기, 읽기 영역 - 한 유형에 대해 5문제씩 불러옴
    const loadProblem = () =>{
        async function dataLoading(){
            try{

                // 1. startAfter 사용시 orderBy와 함께 사용
                // 2. where절에서 지정한 column과 orderBy에서 지정한 column은 동일한 column을 가져야 함
                // 3. where에서는 범위를 지정해야 한다. (== 연산자 사용 불가)
                
                const data = (lastVisible.current) ? (
                    await wrongCollection.doc(`${route.params.userTag[typeRef.current].section}_TAG`).collection("PRB_TAG").doc(route.params.userTag[typeRef.current].tagName).collection("PRB_LIST")
                        .where("PRB_ID", ">=", "").orderBy("PRB_ID").startAfter(lastVisible.current).limit(5).get()) : (
                    await wrongCollection.doc(`${route.params.userTag[typeRef.current].section}_TAG`).collection("PRB_TAG").doc(route.params.userTag[typeRef.current].tagName).collection("PRB_LIST")
                        .where("PRB_ID", ">=", "").orderBy("PRB_ID").limit(5).get())
                    


                let rawData = data.docs.map((doc, index)=> {return {...doc.data()}})
                
                if(rawData.length == 0){ 
                    typeRef.current++ // 다른 유형의 문제를 load

                    if(typeRef.current>=route.params.userTag.length){  // 유저가 선택한 모든 유형의 문제를 푼 경우
                        setNextBtn(-1)
                        console.log("모든 문제를 풀었습니다.")

                        return 
                    }
                
                    const data = await wrongCollection.doc(`${route.params.userTag[typeRef.current].section}_TAG`).collection("PRB_TAG").doc(route.params.userTag[typeRef.current].tagName).collection("PRB_LIST")
                        .where("PRB_ID", ">=", "").orderBy("PRB_ID").limit(5).get()

                    rawData = data.docs.map((doc, index)=> {return {...doc.data()}})
                }

                
                lastVisible.current = rawData[rawData.length-1].PRB_ID


                // 멀티미디어 load
                await loadMultimedia(rawData, audioStorage, imageStorage)

                // data setting
                setLoadedProblem([...loadedProblem, ...rawData])
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading().then(()=>{
            setReady(true)
        })
    }


    useEffect(()=>{

        if(route.params.key === "write"){
            return 
        }
         
        else if(nextBtn === -1){ // 모든 문제를 풀었을 경우
        
            setCorrect(correctCount.current)

            return
        }

        if(nextBtn == loadedProblem.length && nextBtn > 0){ // 문제를 다 풀었을 경우, 더 가져옴
            setReady(false)
            loadProblem()
        }


        if(nextBtn > 0 && loadedProblem[nextBtn-1].PRB_USER_ANSW===undefined){ // 다음 문제를 풀기 전, 유저 답안을 기록

            loadedProblem[nextBtn-1].PRB_USER_ANSW = choiceRef.current


            // 문제를 맞았을 경우
            if(loadedProblem[nextBtn - 1].PRB_USER_ANSW == loadedProblem[nextBtn - 1].PRB_CORRT_ANSW){



                
                const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn-1].PRB_SECT}_TAG`); sectTadDoc.set({})
                

                const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn-1].TAG); tagDoc.set({})

            
                tagDoc.collection("PRB_LIST").doc(loadedProblem[nextBtn-1].PRB_ID).delete().then((err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("success to delete data")
                    }

                })

        }

        problemCount.current++
    }
        

        if(nextBtn >= 0 && loadedProblem.length){
            // console.log(loadedProblem[nextBtn])
        }
        
        choiceRef.current = 0;


    }, [nextBtn])

    return (
        <View style = {{flex: 1}}>
            {   
                (nextBtn == -1) ? (
                    <Result CORRT_CNT = {correct} ALL_CNT = {problemCount.current} navigation = {navigation} PATH = "Wrong"/>
                ): 
                    ((loadedProblem.length && nextBtn < loadedProblem.length && ready) ? 
                        <WrongProb 
                            problem = {loadedProblem[nextBtn]}
                            nextBtn = {nextBtn}
                            setNextBtn = {setNextBtn}
    
                            choiceRef = {choiceRef}
                            
                            section = {route.params.key}
                            size = {loadedProblem.length} // WR 영역일경우

                            key = {nextBtn}
                        />
                    : <Loading />) 
            }
            
        </View>
    );
}


export default WrongStudyScreen;