import React, {useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet } from 'react-native'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)
import auth from '@react-native-firebase/auth'; // 사용자 정보 가져오기
import Sound from 'react-native-sound';


import UserContext from '../lib/UserContext';

import Loading from './component/Loading';
import MockProb from './component/MockProb';
import MockResult from './component/MockResult';
import MockTimer from './component/MockTimer';


// import 유틸
import { getNow } from '../utils/DateUtil';


Sound.setCategory('Playback');


const MockStudyScreen = ({navigation, route}) =>{

    const USER = useContext(UserContext)


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




    const dataLoading = async () => {
            
        try {
            const data = await problemCollection.get();

            let rawData = data.docs.map(doc => {
                return (
                    doc.data()
                )
            });


            // deep copy
            rawProblems.current = JSON.parse(JSON.stringify(rawData))
            setProblems(rawData)
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
    const [images, setImages] = useState({});
    const prevImages = useRef({});
    
    const imagesLoading = async (imageRef) => {
        try {
            await imageRef.listAll().then(res => {
                
                const data = {}
                
                res.items.forEach(item => {
                    item.getDownloadURL().then(url => {
                        
                        data[item.name] = {};
                        data[item.name].url = url;
                        
                    })
                })
                
                setImages(data);
                
            });

        } catch(err) {
            console.log(err);
        }
    }
    
    // 이미지 REF 설정
    useEffect(() => {
        prevImages.current = images;
    }, [images])



    // 오디오 로드
    const audioRef = storage.ref().child(`/audios/${route.params.level}PQ${route.params.order}/`);
    const [audios, setAudios] = useState({});
    const prevAudios = useRef({});
    
    const audiosLoading = async (audioRef) =>  { 
        
        await audioRef.listAll().then(res => {
            const data = {}
            countAudio.current = res.items.length
            
            res.items.forEach(item => {
                item.getDownloadURL().then(url => {
                    
                    data[item.name] = {};
                    data[item.name].url = url
                    data[item.name].URL = new Sound(url, null, err => {
                        if(err){
                            console.log("Failed to load the sound" ,err);
                            return undefined
                        }

                        // 객체 생성 성공

                        countAudio.current -= 1

                        if(countAudio.current == 0){
                            setReadyAudio(true)       
                         }
                    })
                })
            })

            setAudios(data);
            
        });

    }

    
    // 오디오 REF 설정
    useEffect(() => {
        prevAudios.current = audios;
    }, [audios])
    

    // 데이터 준비 여부
    const [readyImage, setReadyImage] = useState(false);
    const [readyAudio, setReadyAudio] = useState(false);
    
    /** 데이터 로딩 처리 */
    useEffect(() => {

        // let isComponentMounted = true; // 메모리 누수 방지
        // setReady(false);

        


        dataLoading();
        imagesLoading(imageRef).then(()=>{
            setReadyImage(true)
        })
        audiosLoading(audioRef);

  

        return () => {
            // 사용자 틀린 문제 DB 업데이트
            // console.log(rawProblems.current)
            // console.log(prevProblems.current)
            USER.updateUserWrongColl(rawProblems.current, prevProblems.current)
        }

    }, []);

    useEffect(()=>{

        if(readyImage && readyAudio){
            console.log("로드 완료")
        }else if(readyImage){
            console.log("오디오 로드 대기중")
        }else if(readyAudio){
            console.log("이미지 로드 대기중")
        }

    }, [readyImage, readyAudio])




    
    const [isEnd, setIsEnd] = useState(false); // 타임 아웃 여부
    

    /* 사용자 답안 저장 */
    const [choice, setChoice] = useState(""); // 듣기, 읽기, 쓰기 답안1
    const [choice2, setChoice2] = useState(""); // 쓰기 답안2
    const [direction, setDirection] = useState(0); // 문제 이동 방향
    const [index, setIndex] = useState(0); // 현재 풀이하는 문제의 인덱스
    
    // 문제 이동이 일어날 때마다 직전 사용자 풀이 정보(choice, choice2) 업데이트
    useEffect(() => {
        if (isEnd || direction !== 0) {

            let newArr = [...prevProblems.current];
            if (newArr !== undefined) {

                // 직전 풀이한 문제의 사용자 선택 저장
                newArr[index + direction]['PRB_USER_ANSW'] = choice;
                newArr[index + direction]['PRB_USER_ANSW2'] = choice2;
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
                


    /** 출력 화면 */ 
    if (!readyImage || !readyAudio) {
        // 로딩 화면
        return (
            <Loading />
        )
    } else if (!isEnd && index !== prevProblems.current.length) {
        // 문제 풀이 화면
        return (
            <View style={styles.container}>
                {/* 타이머 */}
                <MockTimer
                    level={route.params.level}
                    setIsEnd={setIsEnd}
                />
    
                {/* 문제 풀이 영역 */}
                <MockProb
                    problem={prevProblems.current[index]}
                    choice={prevProblems.current[index].PRB_USER_ANSW}
                    setChoice={setChoice}
                    choice2={prevProblems.current[index].PRB_USER_ANSW2}
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
            </View>
        );
    } else if (isEnd || index === prevProblems.current.length) {
        // 결과 테이블 화면
        return (
            <MockResult
                level={route.params.level}
                listen={listen}
                write={write}
                read={read}
                prevImages={prevImages}
                prevAudios={prevAudios}
            />
        );
    }     
}




const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

})


export default MockStudyScreen;
