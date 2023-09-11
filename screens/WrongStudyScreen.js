import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Loading from './component/Loading';
import UserContext from '../lib/UserContext';
import WrongProb from './component/WrongProb';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)



import Sound from 'react-native-sound';

Sound.setCategory('Playback');





// 오디오 로드
const audioURL = async (problem, audiosRef, audioStorage, countAudio, setIsReadyAudio, isComponentMounted) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {

        await audioStorage.child(`/${PRB_RSC}/${problem.AUD_REF}`).getDownloadURL().then((url) => {
            const audio = new Sound(url, null, err => {

                countAudio.current--

                if (countAudio.current == 0 && isComponentMounted.current) {
                    setIsReadyAudio(true)
                }
            })

            audiosRef.current[problem.AUD_REF] = audio
        })

    } catch (err) {
        console.log(err)
    }
}

// 이미지 문제 (IMG_REF) 로드
const imageURL = async (problem, imagesRef, imageStorage) => {
    const PRB_RSC = problem.PRB_ID.substr(0, problem.PRB_ID.length - 3)

    try {

        await imageStorage.child(`/${PRB_RSC}/${problem.IMG_REF}`).getDownloadURL().then((url) => {
            imagesRef.current[problem.IMG_REF] = url
            // console.log(`콜백함수 안 ${url}`)
        })

    } catch (err) {
        console.log(err)
    }
}

// 4지선다 이미지 로드
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


// 멀티미디어 로드
const loadMultimedia = async (problem, audiosRef, imagesRef, audioStorage, imageStorage, countAudio, setIsReadyAudio, nextBtn, isComponentMounted) => {
    try {
        let size = problem.length

        for (var i = nextBtn; i < size; i++) {
            const imageIndex = problem[i].PRB_CHOICE1.search(".png")

            if (problem[i].AUD_REF) {
                await audioURL(problem[i], audiosRef, audioStorage, countAudio, setIsReadyAudio, isComponentMounted)
            } if (problem[i].IMG_REF) {
                await imageURL(problem[i], imagesRef, imageStorage)
            } if (imageIndex != -1) {
                await imagesURL(problem[i], imagesRef, imageStorage)
            }
        }

    } catch (err) {
        console.log(err)
    }

}




// 선택 학습/랜덤 학습 문제 불러오기
async function loadProblem(wrongCollection, problems, setProblems, userTag, lastVisible, typeIndex, setTypeIndex, countAudio, isComponentMounted) {
    try {
        countAudio.current = 0

        // 1. startAfter 사용시 orderBy와 함께 사용
        // 2. where절에서 지정한 column과 orderBy에서 지정한 column은 동일한 column을 가져야 함
        // 3. where에서는 범위를 지정해야 한다. (== 연산자 사용 불가)


        let data = []

        const tagColl = wrongCollection.doc(`${userTag[typeIndex].section}_TAG`)
            .collection("PRB_TAG").doc(userTag[typeIndex].tag).collection("PRB_LIST")


        await tagColl.where("PRB_ID", ">=", "").orderBy("PRB_ID").startAfter(lastVisible.current).limit(5).get().then(documentSnapshot => {
            documentSnapshot.forEach(doc => {
                data.push(doc.data())

                if (doc._data.AUD_REF) {
                    countAudio.current++
                }
            })
        })


        if (data.length == 0) {

            lastVisible.current = null

            if(isComponentMounted.current){
                setTypeIndex(typeIndex + 1)
            }
            

        } else {

            lastVisible.current = data[data.length - 1].PRB_ID

            if(isComponentMounted.current){
                setProblems([...problems, ...data])
            }
            
        }

    } catch (error) {
        console.log(error.message);
    }
}

// 쓰기히스토리 문제 한번에 불러오기
// 최대 10개의 문제
function loadProblemWr(wrongCollection, setProblems, isComponentMounted){
    try{
        
        wrongCollection.get().then( querySnapshot => {
            if(isComponentMounted.current){

                setProblems(querySnapshot.docs.map(doc => {
                    return {
                        DATE: doc.id,
                        ...doc.data()
                    }
                }))

            }
        })

    }catch(err){
        console.log(err)
    }
}



// route.params.key = {"select", "random", "write"}
// route.params.userTag로 유형을 나눔

const WrongStudyScreen = ({ route, navigation }) => {

    // 유저 정보
    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 멀티미디어
    const storage = getStorage(firebase);
    const audioStorage = storage.ref().child(`/audios`);
    const imageStorage = storage.ref().child(`/images`);



    // 유저의 복습하기 콜렉션을 load
    const wrongCollection = route.params.key !== "write" ?
        firestore().collection("users")
            .doc(USER.uid)
            .collection(`wrong_lv${USER.level}`):
        firestore().collection("users")
            .doc(USER.uid)
            .collection(`wrong_lv${USER.level}`)
            .doc("WR_TAG").collection("PRB_TAG")
            .doc(route.params.userTag)
            .collection("PRB_RSC_LIST")
            .doc(route.params.PRB_ID)
            .collection("PRB_LIST")





    // 백엔드에서 불러온 json 문제
    const [problems, setProblems] = useState([]);

    // 틀린문제 및 맞은문제 기록을 위한 문제 저장 
    // 원본 문제 (손상 X)
    const rawProblems = useRef([])
    // 유저 답안 포함한 문제
    const userProblems = useRef([])


    // 멀티미디어 저장
    const imagesRef = useRef({})
    const audiosRef = useRef({})


    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(route.params.order); // WR 영역에 의한 order 값 셋팅
    // 제출 여부 - 채점
    const [isSubmit, setIsSubmit] = useState(false);


    // 학습 종료 - 문제 풀이 결과화면
    const [resultscreen, setResultscreen] = useState(false)


    // 맞은 문제 카운팅
    const correctCount = useRef(0)
    // 푼 문제 카운팅 
    const problemCount = useRef(0)




    // 멀티미디어 로드 상태
    // 이미지 준비 상태
    const [isReadyImage, setIsReadyImage] = useState(false)
    // 오디오 준비 상태
    const [isReadyAudio, setIsReadyAudio] = useState(false)

    // 오디오 개수 카운팅
    const countAudio = useRef(0)


    // 선택 학습, 랜덤 학습
    // 현재 userTag의 인덱스를 가르킴 ex. [{tag: 001, section: "LS"} ,{tag: 003, section: "LS"}, {tag: 002, section: "RD"}]
    const [typeIndex, setTypeIndex] = useState(0)


    // 선택 학습, 랜덤 학습
    // 로드한 데이터의 마지막 문제를 가르킴
    const lastVisible = useRef(null);





    useEffect(() => {
        // console.log(route.params.userTag)
        // unmount
        return () => {
            isComponentMounted.current = false

            // console.log(rawProblems.current)
            // console.log(userProblems.current)
            USER.updateUserWrongColl(rawProblems.current, userProblems.current)
        }
    }, [])


    useEffect(() => {

        if (route.params.key === "write") {

            loadProblemWr(wrongCollection, setProblems, isComponentMounted)

        }
        else if (nextBtn == problems.length && isComponentMounted.current) { // 선택, 랜덤 학습

            setIsReadyImage(false)
            setIsReadyAudio(false)

            loadProblem(wrongCollection, problems, setProblems, route.params.userTag, lastVisible, typeIndex, setTypeIndex, countAudio, isComponentMounted)
        }

    }, [nextBtn])


    // 현재 풀이하고 있는 유형을 가르킴
    useEffect(() => {

        if (typeIndex > 0) {
            // console.log(typeIndex)
            // 모든 유형의 문제를 모두 풀었다면
            if (typeIndex >= route.params.userTag.length && isComponentMounted.current) {
                setResultscreen(true)
            } else {
                // 아직 문제가 남아있다면
                setIsReadyImage(false)
                setIsReadyAudio(false)

                loadProblem(wrongCollection, problems, setProblems, route.params.userTag, lastVisible, typeIndex, setTypeIndex, countAudio, isComponentMounted)
            }
        }

    }, [typeIndex])



    useEffect(() => {

        // 문제 데이터셋에 변화가 생김 -> 멀티미디어 다운받기
        if (problems.length) {
            // console.log(problems)
            // console.log(countAudio.current)
            loadMultimedia(problems, audiosRef, imagesRef, audioStorage, imageStorage, countAudio, setIsReadyAudio, nextBtn, isComponentMounted).then(() => {
                
                if(isComponentMounted.current){
                    setIsReadyImage(true)
                }
                

                // 오디오가 없을 경우
                if (countAudio.current == 0 && isComponentMounted.current) {
                    setIsReadyAudio(true)
                }
            })

        }

    }, [problems])



    useEffect(() => {

        if (isSubmit && rawProblems.current.length == nextBtn) {

            // 유저 답안 기록
            userProblems.current[nextBtn] = {
                ...problems[nextBtn],
                PRB_USER_ANSW: userProblems.current[nextBtn].PRB_USER_ANSW
            }

            rawProblems.current.push(problems[nextBtn])
            // console.log(userProblems.current[nextBtn])


            if (userProblems.current[nextBtn].PRB_USER_ANSW == problems[nextBtn].PRB_CORRT_ANSW) {
                correctCount.current++
            }

            problemCount.current++
        }

    }, [isSubmit])



    useEffect(() => {
        if (resultscreen) {
            navigation.replace("Result", { CORRT_CNT: correctCount.current, ALL_CNT: problemCount.current, PATH: "Wrong" })
        }
    }, [resultscreen])


    useEffect(() => {
        console.log(isReadyAudio, isReadyImage)
        if (isReadyAudio && isReadyImage) {
            console.log("멀티미디어 로드 완료")
        } else if (isReadyAudio) {
            console.log("사진 로드중")
        } else if (isReadyImage) {
            console.log("오디오 객체 생성중")
        } else {
            console.log("멀티미디어 로드중")
        }
    }, [isReadyAudio, isReadyImage])



    if (!isReadyImage || !isReadyAudio || nextBtn >= problems.length) {
        return (
            <Loading />
        )
    } else {
        return (
            <WrongProb
                problem={problems[nextBtn]}
                images={imagesRef.current}
                audio={audiosRef.current[problems[nextBtn].AUD_REF]} // 오디오 제어

                nextBtn={nextBtn}
                setNextBtn={setNextBtn}

                isSubmit={isSubmit}
                setIsSubmit={setIsSubmit}

                level = {USER.level}
                tag = {problems[nextBtn].TAG}
                section = {problems[nextBtn].PRB_SECT.slice(0,2)}
                setResultscreen = {setResultscreen} // 나가기 버튼시 결과화면

                userProblems={userProblems} // 제출버튼 후 유저 답안 기록

                size={problems.length} // WR 영역일경우
                key={`WRONGPROB${nextBtn}`}
            />
        );
    }



}


export default WrongStudyScreen;