import React, {useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)
import Sound from 'react-native-sound';


import UserContext from '../lib/UserContext';
import { getScoring } from '../lib/utils';
import Loading from './component/Loading';
import MockProb from './component/MockProb';
import MockResult from './component/MockResult';
import MockTimer from './component/MockTimer';



// Sound.setCategory('Playback');



async function getWriteScore(write, problems, setProblems, isComponentMounted){
    const time = Date.now()

    if(write.length == 0){
        return 
    }

    // 51
    write[0] = await getScoring(write[0])
    console.log(Date.now() - time)


    // 52 
    write[1] = await getScoring(write[1])
    console.log(Date.now() - time)

    
    // 53
    write[2] = await getScoring(write[2])
    console.log(Date.now() - time)


    // 54
    // 결과화면 먼저 보여줌
    // 채점이 완료되면 채점결과가 보임
    getScoring(write[3]).then(data => {
        write[3] = data
        console.log(Date.now() - time)


        if(isComponentMounted.current){

            setProblems(problems.map(data => {
                if(data.PRB_SECT == "WR"){
                    return write[data.PRB_NUM - 51]
                }else{
                    return data
                }
            }))

        }
    })

    // console.log(write)
}

const MockStudyScreen = ({navigation, route}) =>{

    const USER = useContext(UserContext)
    
    // 메모리 누수 방지
    const isComponentMounted = useRef(true)
        

    const storage = getStorage(firebase);
    
    // 콜렉션 불러오기
    const problemCollection = firestore()
                                .collection('problems')
                                .doc(route.params.level)
                                .collection('PQ')
                                .doc(route.params.order)
                                .collection('PRB_LIST');


    /** 문제 데이터 로드 */
    const [problems, setProblems] = useState([]); // json
    const prevProblems = useRef([]); // 유저 답안 포함한 문제
    const rawProblems = useRef([]); // 원본 문제 (손상 X)

    // 오디오 개수 카운팅
    const countAudio = useRef();
    // 이미지 개수 카운팅
    const countImage = useRef();




    const dataLoading = async () => {
            
        try {
            const data = await problemCollection.get();

            let rawData = data.docs.map(doc => doc.data())


            // deep copy
            rawProblems.current = JSON.parse(JSON.stringify(rawData))

    
            if(isComponentMounted.current){
                setProblems(rawData)
                setReadyProblem(true)
            }
    
        } catch (error) {
            console.log(error.message);
        }
    }
    


    
    // 문제 REF 설정
    useEffect(() => {
        prevProblems.current = problems;
    }, [problems])

    
    
    
    /* 멀티미디어 로드 */
    
    // 이미지 로드
    const imageRef = storage.ref().child(`/images/${route.params.level}PQ${route.params.order}/`);
    const prevImages = useRef({});
    
    const imagesLoading = (imageRef) => {
        try {
            imageRef.listAll().then(res => {
                
                countImage.current = res.items.length
                console.log("이미지 개수", countImage.current)

                res.items.forEach(item => {
                    item.getDownloadURL().then(url => {
                        
                        prevImages.current[item.name] = {};
                        prevImages.current[item.name].url = url;
                        
                        countImage.current -= 1
                        if(isComponentMounted.current && countImage.current == 0){
                            setReadyImage(true)
                        }
                    })
                })
                
            });

        } catch(err) {
            console.log(err);
        }
    }



    // 오디오 로드
    const audioRef = storage.ref().child(`/audios/${route.params.level}PQ${route.params.order}/`);
    const prevAudios = useRef({});
    

    const audiosLoading = async (audioRef) => {
        try{

            const audio = {}
            countAudio.current = 0

            // 남은 오디오 
            for(let i = index; i < index + 5; i++){

                const audiopath = problems[i].AUD_REF

                if(audio[audiopath]){
                    continue
                }
                else if(problems[i].PRB_SECT != "LS"){
                    break
                }

                countAudio.current += 1
                audio[audiopath] = true
            }
            console.log("남은오디오개수", countAudio.current)


            for(let audiopath in audio){
                
                audioRef.child(`/${audiopath}`).getDownloadURL().then(url => {
                    
                    prevAudios.current[audiopath] = {};
                    prevAudios.current[audiopath].url = url
                    prevAudios.current[audiopath].URL = new Sound(url, null, err => {
                        if(err){
                            console.log("Failed to load the sound" ,err);
                            return undefined
                        }

                        // 객체 생성 성공
                        console.log("success to load", audiopath, countAudio.current - 1)
                        countAudio.current -= 1

                        if(countAudio.current == 0 && isComponentMounted.current){
                            setReadyAudio(true)       
                         }

                    })
                })
                
            }


        }catch(err){
            console.log(err)
        }

    }


    // 한번에 모든 오디오 불러오기
    // const audiosLoading = (audioRef) =>  { 
        
    //     audioRef.listAll().then(res => {

    //         countAudio.current = res.items.length
    //         console.log("오디오 개수", countAudio.current)

    //         res.items.forEach(item => {
    //             item.getDownloadURL().then(url => {
                    
    //                 prevAudios.current[item.name] = {};
    //                 prevAudios.current[item.name].url = url
    //                 prevAudios.current[item.name].URL = new Sound(url, null, err => {
    //                     if(err){
    //                         console.log("Failed to load the sound" ,err);
    //                         return undefined
    //                     }

    //                     // 객체 생성 성공
    //                     console.log("success to load", item.name, countAudio.current - 1)
    //                     countAudio.current -= 1

    //                     if(countAudio.current == 0 && isComponentMounted.current){
    //                         setReadyAudio(true)       
    //                      }
    //                 })

    //             })
    //         })            
            
    //     });

    // }

    
    const time = useRef(undefined);
    // 데이터 준비 여부
    const [readyImage, setReadyImage] = useState(false);
    const [readyAudio, setReadyAudio] = useState(false);
    const [readyProblem, setReadyProblem] = useState(false)
    
    /** 데이터 로딩 처리 */
    useEffect(() => {

        dataLoading()
        imagesLoading(imageRef)

  

        return () => {
            isComponentMounted.current = false


            // 오디오 객체 정리
            Object.keys(prevAudios.current).forEach( audiopath => {
                prevAudios.current[audiopath].URL.release()
            })


            // 사용자 틀린 문제 DB 업데이트
            // console.log(rawProblems.current)
            // console.log(prevProblems.current)

            // 문제를 풀다 나갔을 경우 기록하지 않음 (제출하였을경우 기록)
            if(resultRef.current){
                USER.updateUserWrongColl(rawProblems.current, prevProblems.current)
            }

        }

    }, []);

    useEffect(()=>{

        if(readyImage && readyAudio){
            console.log(Date.now() - time.current)
            console.log("로드 완료")
        }else if(readyImage){
            time.current = Date.now()
            console.log("오디오 로드 대기중")
        }else if(readyAudio){
            console.log("이미지 로드 대기중")
        }

    }, [readyImage, readyAudio])




    const [resultscreen, setResultscreen] = useState(false)
    const [isEnd, setIsEnd] = useState(false); // 타임 아웃 여부
    const resultRef = useRef(false) // 제출 여부
    

    /* 사용자 답안 저장 */
    const [choice, setChoice] = useState(""); // 듣기, 읽기, 쓰기 답안1
    const [choice2, setChoice2] = useState(""); // 쓰기 답안2
    const [direction, setDirection] = useState(0); // 문제 이동 방향
    const [index, setIndex] = useState(0); // 현재 풀이하는 문제의 인덱스
    

    
    // 듣기영역의 오디오 5개씩 끊어 불러오기
    useEffect(() => {

        // 문제 이동시 오디오 추가로 불러옴
        if(readyProblem && problems[index].PRB_SECT == "LS" && !prevAudios.current[problems[index].AUD_REF]){
            
            console.log("오디오 이어서 불러오는중....", prevAudios.current[problems[index].AUD_REF])
            setReadyAudio(false)
            audiosLoading(audioRef)

        }

    }, [index, readyProblem])

    // 문제 이동이 일어날 때마다 직전 사용자 풀이 정보(choice, choice2) 업데이트
    useEffect(() => {
        if (isEnd || direction !== 0) {

            let newArr = [...prevProblems.current];
            if (newArr !== undefined) {

                // 직전 풀이한 문제의 사용자 선택 저장

                if(problems[index + direction].PRB_SECT == "WR" && problems[index + direction].TAG == "001" || problems[index + direction].TAG == "002"){
                    newArr[index + direction]['PRB_USER_ANSW'] = choice;
                    newArr[index + direction]['PRB_USER_ANSW2'] = choice2;
                }else{
                    newArr[index + direction]['PRB_USER_ANSW'] = choice;
                }
                
                setProblems(newArr);
                
                
                // console.log(
                //     `updated ${index + directAon}: ${newArr[index + direction].PRB_USER_aNSW}`
                //     );
                        
            }
        }
    }, [isEnd, index]);
        


    /* 결과 화면 만들기 */
    const [listen, setListen] = useState([]); // 듣기 영역 문제들
    const [write, setWrite] = useState([]); // 쓰기 영역 문제들
    const [read, setRead] = useState([]); // 읽기 영역 문제들

    
    useEffect(() => {
        if (listen.length || write.length || read.length) {
            return;
        }

        if (isEnd || index === prevProblems.current.length) {

            // 문제 영역별 분류
            prevProblems.current.map((problem) => {
                
                switch (problem.PRB_SECT) {
                    case 'LS':
                        setListen((prevList) => [...prevList, problem]);
                        break;
                    case 'RD':
                        setRead((prevList) => [...prevList, problem]);
                        break;
                    case 'WR':
                        setWrite((prevList) => [...prevList, problem]);
                        break;
                }
            });
        }
    }, [isEnd, index]);


    useEffect(() => {
        // 모든 문제를 다 풀었을 경우 
        // 쓰기영역 문제가 존재하면 채점 후 결과화면(모달창) 보여주기
        if(problems.length && (isEnd || index === prevProblems.current.length)){
            /* 
                쓰기영역 채점은 여기서
            */
            

            getWriteScore(write, problems, setProblems, isComponentMounted).then(()=> {
                
                if(isComponentMounted.current){
                    setResultscreen(true)
                    resultRef.current = true
                }

            })
            
        }
    }, [listen, read, write])
                


    /** 출력 화면 */ 
    if (!readyImage || !readyProblem) {
        // 문제 생성중 로딩화면
        return (
            <Loading />
        )
    } else if (!isEnd && index !== prevProblems.current.length) {
        // 문제 풀이 화면
        return (
            <View style={styles.container}>
                {/* 타이머와 나가기버튼*/}
                <View style = {styles.headerContainer}>
                    <MockTimer
                        level={route.params.level}
                        setIsEnd={setIsEnd}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setIsEnd(true);
                        }}
                        style={styles.exitBtn}>
                        <Text>Exit</Text>
                    </TouchableOpacity>
                </View>
    
                {/* 문제 풀이 영역 */}
                {
                    readyAudio ?
                    <MockProb
                    problem={prevProblems.current[index]}
                    choice={prevProblems.current[index].PRB_USER_ANSW || null}
                    setChoice={setChoice}
                    choice2={prevProblems.current[index].PRB_USER_ANSW2 || null}
                    setChoice2={setChoice2}
                    index={index}
                    setIndex={setIndex}
                    setIsEnd={setIsEnd}
                    probListLength={prevProblems.current.length}
                    setDirection={setDirection}
                    images={prevImages}
                    audios={prevAudios}

                    key = {`MOCKSCREEN${index}`} // MockProb 컴포넌트 구분 (audio 객체)
                    />
                    : <Loading />
                }
            </View>
        );
    }else if(resultscreen){
        return (
            <MockResult
                level={route.params.level}
                listen={listen}
                write={write}
                read={read}
                prevImages={prevImages}
                prevAudios={prevAudios}
                problems = {problems}
            />
        )
    }else if (isEnd || index === prevProblems.current.length) {
        // 결과 테이블 화면 구성을 위한 서술형 채점
        return (
            <Loading />
        );
    }
}




const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        marginBottom: 50
    },  

    // 나가기 버튼
    exitBtn: {
        width: 80,
        borderStyle: 'solid',
        borderColor: "#666363",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#D9D9D9',

        alignItems: "center"
    },

})


export default MockStudyScreen;
