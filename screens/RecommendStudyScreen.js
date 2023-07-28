import React, {useState, useEffect, useRef, useContext} from 'react';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)

import Sound from 'react-native-sound';

Sound.setCategory('Playback');


import UserContext from '../lib/UserContext';
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
    try{
        let size = problemList.length

        for(var i=0; i<size; i++){
            const imageIndex = problemList[i].PRB_CHOICE1.search(".png")

            if(problemList[i].AUD_REF){
                await audioURL(problemList[i], audioStorage, countAudio, setReadyAudio)
            }if(problemList[i].IMG_REF){
                await imageURL(problemList[i], imageStorage)
            }if(imageIndex != -1){
                await imagesURL(problemList[i], imageStorage)
            }
        }


        
        setLoadedProblem(problemList)
    }catch(err){
        console.log(err)
    }
    
}

const RecommendStudyScreen = ({route, navigation}) =>{

    const USER = useContext(UserContext)
    
    

    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);

    
    // 콜렉션 불러오기
    const querySnapshot = firestore().collection("users").doc(USER.uid)
    const recommendColl = querySnapshot.collection("recommend")
    const wrongColl_lv1 = querySnapshot.collection(`wrong_lv1`) 
    const wrongColl_lv2 = querySnapshot.collection(`wrong_lv2`)




    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json

    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(USER.recIndex);
    
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
    const userIndex = USER.recIndex
    const userCorrect = USER.recCorrect


    // MOUNT 
    useEffect(()=> {
         
        // promise 객체를 반환하는 함수
        dataLoading();
        

        // UNMOUNT
        return () => {

            // firebase update
            updateUserAnswer()


            // RecommendScreen update
            USER.recIndex = Number(userIndex) + Number(problemCount.current)
            USER.recCorrect = Number(userCorrect) + Number(correctCount.current)
        }

    }, []);



    
    // recommend collection firebase update
    const updateUserAnswer = async () =>{
        await recommendColl.doc("Recommend").update({
            userIndex: Number(userIndex) + Number(problemCount.current),
            userCorrect: Number(userCorrect)+Number(correctCount.current)
        })
    }




    // 문제 데이터 load
    const dataLoading = async () =>{
        try{

            let dataList = []
            const data = await recommendColl.where("PRB_ID", ">=", "").orderBy("PRB_ID").get()


            data.forEach((doc)=>{
                if(doc._data.PRB_ID){
                    dataList.push(doc._data)
                }
                
                if(doc._data.AUD_REF){ 
                    countAudio.current++
                }
            })


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
                //setReadyAudio(true)
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

    


    // 복습하기 콜렉션에서 유저가 맞춘 문제를 제거
    // LSTAG -> PRB_TAG -> 001 문서의 field인 PRB_LIST_COUNT를 1만큼 감소시킴
    const deleteToWrongColl = async ( wrongCollection ) =>{
        const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn].PRB_SECT}_TAG`); sectTadDoc.set({})
                

        const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn].TAG); 
        
        // field 수정
        const tagDocs = await tagDoc.get()

        const listcount = tagDocs.data().PRB_LIST_COUNT

        if(listcount){

            await tagDoc.update({
                PRB_LIST_COUNT: listcount - 1
            })

        }else{ // 필드가 존재하지 않거나 더이상 문제가 존재하지 않을경우
            
            tagDoc.set({
                PRB_LIST_COUNT: 0
            })

        }


        // delete document
        tagDoc.collection("PRB_LIST").doc(loadedProblem[nextBtn].PRB_ID).delete().then((err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("success to delete data")
            }

        })
    }


    // 복습하기 콜렉션에서 유저가 틀린문제를 추가
    // LS_TAG -> PRB_TAG -> 001 문서의 field인 PRB_LIST_COUNT를 1만큼 증가시킴
    const addToWrongColl = async ( wrongCollection ) => {
        
        const sectTadDoc = wrongCollection.doc(`${loadedProblem[nextBtn].PRB_SECT}_TAG`); sectTadDoc.set({})
                

        const tagDoc = sectTadDoc.collection("PRB_TAG").doc(loadedProblem[nextBtn].TAG); 


        // field 수정
        const tagDocs = await tagDoc.get()

        const listcount = tagDocs.data().PRB_LIST_COUNT

        if(listcount){

            await tagDoc.update({
                PRB_LIST_COUNT: listcount + 1
            })

        }else{ // 필드가 존재하지 않거나 문제가 없는 경우
            
            tagDoc.set({
                PRB_LIST_COUNT: 1
            })

        }
    

        // add document
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



    // 문제 제출시 채점
    useEffect(()=>{
       

        // 제출 버튼 클릭
       
       if(loadedProblem.length && loadedProblem[nextBtn].PRB_USER_ANSW){

            // 해당 문제의 토픽 레벨을 찾음
            const PRB_TOPIK_LEVEL = loadedProblem[nextBtn].PRB_ID[2] // ex) LV20041001
            
            const wrongCollection = PRB_TOPIK_LEVEL == 1 ? wrongColl_lv1 : wrongColl_lv2



            
            // 유저가 답안을 맞췄을 경우
            if(loadedProblem[nextBtn].PRB_CORRT_ANSW == loadedProblem[nextBtn].PRB_USER_ANSW){ 
        

                deleteToWrongColl(wrongCollection)
                
                
                // 정답 카운트
                correctCount.current++


            }else{ // 유저가 답안을 틀렸을 경우

                addToWrongColl(wrongCollection)

            }


            problemCount.current++
        }
       
        
    }, [isSubmit])
    


    useEffect(()=>{
        if(nextBtn === loadedProblem.length){
            navigation.replace("Result", {CORRT_CNT: correctCount.current + userCorrect, ALL_CNT: 10, PATH: "Home"})
        }
    }, [nextBtn])
    



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
    }else{
        return null
    }


}

export default RecommendStudyScreen;