import React, {useState, useEffect, useRef, useContext} from 'react';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)

import Sound from 'react-native-sound';

Sound.setCategory('Playback');


import UserContext from '../lib/UserContext';
import RecommendProb from './component/RecommendProb';
import Loading from './component/Loading';
import { settingUserStudyTime } from '../lib/utils';



// recommend collection firebase update
const updateUserAnswer = (recommendColl, index, correct) =>{
    recommendColl.doc("Recommend").update({
        userIndex: index,
        userCorrect: correct
    })
}



const audioURL = (problem, audioRef, audioStorage, countAudio, setReadyAudio, isComponentMounted) =>{
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length-3)

    try{
        audioStorage.child(`/${PRB_RSC}/${problem.AUD_REF}`).getDownloadURL().then((url)=>{
            const audio = new Sound(url, null, err => {
                if (err) {
                    console.log('Failed to load the sound', err);
                    return undefined;
                }
                
                // 로드 성공
                console.log(`${problem.AUD_REF} - ${problem.PRB_ID}오디오 로드 성공`);

                countAudio.current -= 1
                
                if(countAudio.current == 0 && isComponentMounted.current){
                    setReadyAudio(true)
                }
            })


            audioRef.current[problem.PRB_ID] = audio
        })
    }catch(err){
        console.log(err)
    }
}

const imageURL = async (problem, imgRef, imageStorage) =>{
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length-3)
    
    try{
        await imageStorage.child(`/${PRB_RSC}/${problem.IMG_REF}`).getDownloadURL().then((url)=>{
            imgRef.current[problem.IMG_REF] = url
        })
    }catch(err){
        console.log(err)
    }
}

const imagesURL = async (problem, imgRef, imageStorage) =>{
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length-3)
    
    try{

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

    }catch(err){

        console.log(err)

    }
}

const loadMultimedia = async (problem, audioRef, imgRef, audioStorage, imageStorage, countAudio, setReadyAudio, isComponentMounted) =>{
    try{
        let size = problem.length

        for(var i=0; i<size; i++){
            const imageIndex = problem[i].PRB_CHOICE1.search(".png")

            if(problem[i].AUD_REF){
                audioURL(problem[i], audioRef, audioStorage, countAudio, setReadyAudio, isComponentMounted)
            }if(problem[i].IMG_REF){
                await imageURL(problem[i], imgRef, imageStorage)
            }if(imageIndex != -1){
                await imagesURL(problem[i], imgRef, imageStorage)
            }
        }

    }catch(err){
        console.log(err)
    }
    
}



const RecommendStudyScreen = ({route, navigation}) =>{

    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)
    
    // 학습화면에서 머무른 시간 = 학습시간으로 간주
    const USERTIMER = useRef(0)
    

    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);

    
    // 콜렉션 불러오기
    const querySnapshot = firestore().collection("users").doc(USER.uid)
    const recommendColl = querySnapshot.collection("recommend")



    // 문제 로드
    const [problem, setproblem] = useState([]); 
    // 문제 데이터
    const prevProblem = useRef(null)
    // 유저 답 포함한 문제 데이터
    const userProblem = useRef(null) 


    // 멀티미디어 저장 
    const audioRef = useRef({}) // 객체
    const imgRef = useRef({}) // 다운로드 링크



    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(USER.recIndex);
    
    // 제출 감지
    const [isSubmit, setIsSubmit] = useState(false)
    



    // 맞은 답 개수
    const correctCount = useRef(0)
    // 푼 문제 개수 
    const problemCount = useRef(0)
    // 문제풀이시간 타이머
    const startTime = useRef(0)




    // loading 화면
    // 멀티미디어 로드 상태
    const [readyProblem, setReadyProblem] = useState(false)
    // 오디오 객체 생성 상태
    const [readyAudio, setReadyAudio] = useState(false)


    // 오디오 개수 카운팅
    const countAudio = useRef(0)




    // 추천문제 인덱스 및 정답 수 load
    const userIndex = Number(USER.recIndex)
    const userCorrect = Number(USER.recCorrect)


    // MOUNT 
    useEffect(()=> {
        
        USERTIMER.current = Date.now()

        // promise 객체를 반환하는 함수
        dataLoading();


        // UNMOUNT
        return () => {
            isComponentMounted.current = false


            // 오디오 객체 정리
            Object.keys(audioRef.current).forEach(item => {
                audioRef.current[item].release()
            })



            // firebase update
            // recommend field
            updateUserAnswer(recommendColl, Number(userIndex) + Number(problemCount.current), Number(userCorrect)+Number(correctCount.current))

            // wrong
            USER.updateUserWrongColl(prevProblem.current.slice(userIndex, userIndex+problemCount.current), userProblem.current.slice(userIndex, userIndex+problemCount.current))
            // history
            USER.updateHistoryColl(userProblem.current.slice(userIndex, userIndex+problemCount.current))


            // RecommendScreen update
            USER.recIndex = userIndex + Number(problemCount.current)
            USER.recCorrect = userCorrect + Number(correctCount.current)


            // 유저의 학습시간 업데이트
            settingUserStudyTime(Date.now() - USERTIMER.current)
        }

    }, []);




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


            if(isComponentMounted.current){
                setproblem(dataList)
            }
         
        }catch(error){

            console.log(error.message);
        
        }    
    }

    

    // 모든 문제를 불러온 후 멀티미디어 생성하기
    useEffect(()=>{

        if(problem.length){

            // deep copy
            prevProblem.current = JSON.parse(JSON.stringify(problem))
            userProblem.current = JSON.parse(JSON.stringify(problem))

            loadMultimedia(problem, audioRef, imgRef, audioStorage, imageStorage, countAudio, setReadyAudio, isComponentMounted).then(()=>{
                
                // 멀티미디어 로드 완료
                if(isComponentMounted.current){
                    setReadyProblem(true)
                    // setReadyAudio(true)

                    
                    // 오디오가 없을 경우
                    if (countAudio.current == 0 && isComponentMounted.current) {
                        setReadyAudio(true)
                    }
                }
            })

        }
    }, [problem])
    


    // 멀티미디어와 오디오 생성 상태를 출력
    useEffect(()=>{

        if(readyProblem && readyAudio){
            // 문제풀이시작시 시간 카운팅
            startTime.current = Date.now()

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
       if(problem.length && userProblem.current[nextBtn].PRB_USER_ANSW){

            // 문제 풀이시간 기록
            userProblem.current[nextBtn].ELAPSED_TIME = Date.now() - startTime.current

            // 유저가 답안을 맞췄을 경우
            if(problem[nextBtn].PRB_CORRT_ANSW == userProblem.current[nextBtn].PRB_USER_ANSW){ 
                // 정답 카운트
                correctCount.current++
            }


            problemCount.current++
        }
        
    }, [isSubmit])
    


    useEffect(()=>{
        if(nextBtn === problem.length && nextBtn != 0){
            navigation.replace("Result", {CORRT_CNT: correctCount.current + userCorrect, ALL_CNT: 10, PATH: "Home"})
        }

        // 문제풀이시작시 시간 카운팅
        startTime.current = Date.now()
    }, [nextBtn])
    



    if(readyProblem === false || readyAudio === false) {
        return (
            <Loading />
        )
    }else if(nextBtn < problem.length){
        return (

            <RecommendProb 
                problem = {userProblem.current[nextBtn]} // 유저답안 
                audRef = {audioRef.current}
                imgRef = {imgRef.current}


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