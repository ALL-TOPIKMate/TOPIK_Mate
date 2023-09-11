import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import storage, { getStorage } from '@react-native-firebase/storage'
import { subscribeAuth } from "../lib/auth";
import UserContext from '../lib/UserContext';
import Loading from './component/Loading';
import ProbMain from './component/ProbMain';
import ImgRef from './component/ImgRef';
import ProbTxt from './component/ProbTxt';
import TypeProbChoiceWrite from './component/TypeProbChoiceWrite';


//Write
const TypeStudyWr = ({ navigation, route }) => {

    const USER = useContext(UserContext)

    // 메모리 누수 방지
    const isComponentMounted = useRef(true)


    // 멀티미디어
    const storage = getStorage(firebase);
    const imageStorage = storage.ref().child(`/images`);


    // 쓰기영역 콜렉션
    const problemCollection = firestore().collection('problems').doc(`LV${USER.level}`)
        .collection(route.params.source) // WR_TAG
        .doc(route.params.paddedIndex) // 001
        .collection('PRB_LIST')



    // 문제 데이터 저장
    const [problems, setProblems] = useState([]);
    // 이미지 데이터 저장(IMG_REF)
    const imagesRef = useRef({})

    // 문제 데이터 (손상 X)
    const rawProblems = useRef([]);
    // 유저 답안을 포함한 문제 데이터
    const userProblems = useRef([]);



    // 문제 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);
    // 제출 여부
    const [submitted, setSubmitted] = useState(false)

    

    // 마지막 문제를 가르킴
    const lastVisible = useRef(null);

    // 문제풀이화면 준비상태 - 이미지 로드 완료 감지
    const [isReady, setIsReady] = useState(false);
    // 문제 풀이 종료 - 페이지 이동
    const [prbstatus, setprbstatus] = useState(true);




    useEffect(()=>{

        // unmount
        return () => {
            isComponentMounted.current = false

            USER.updateUserWrongColl(rawProblems.current, userProblems.current)
        }
    }, [])



    useEffect(() => {
        // 문제를 읽어들였다면 멀티미디어 로드
        if (problems.length) {

            ImageLoading().then(() => {

                if(isComponentMounted.current){
                    setIsReady(true)
                }
                
            })

        }
    }, [problems])


    useEffect(() => {

        // 모든 문제를 풀었다면 더 가져옴
        if (currentIndex == problems.length && isComponentMounted.current) {

            setIsReady(false)
            loadProblems()

        }

    }, [currentIndex])




    // 5문제씩 읽어오기
    const loadProblems = async () => {
        try {
            const prblist = [];

            let query = problemCollection.orderBy('__name__').limit(5);
            if (lastVisible.current) {
                query = query.startAfter(lastVisible.current);
            }
            const temp_snapshot = await query.get();

            temp_snapshot.forEach((doc) => {
                const data = doc.data();
                prblist.push(data);
            });
            if (temp_snapshot.empty && isComponentMounted.current) {
                setprbstatus(false);
            }

            if (prblist.length > 0 && prbstatus == true) {
                const lastDoc = temp_snapshot.docs[temp_snapshot.docs.length - 1];
                // console.log('문제 끝: ', lastDoc.id);
                if (lastDoc) {
                    const lastDocId = lastDoc.id;
                    lastVisible.current = lastDocId
                } else {
                    lastVisible.current = null
                }

                if(isComponentMounted.current){
                    setProblems([...problems, ...prblist]);
                }
                

            } else {
                console.log('No more problems to load.');
                lastVisible.current = null
            }
        } catch (error) {
            console.log(error);
        }

    };



    // IMG_REF 로드
    const ImageLoading = async () => {
        try {
            for (let curr = currentIndex; curr < problems.length; curr++) {
                if (problems[curr].IMG_REF) {

                    const prbslice = problems[curr].PRB_ID.slice(0, problems[curr].PRB_ID.length - 3)

                    await imageStorage.child(`/${prbslice}/${problems[curr].IMG_REF}`).getDownloadURL().then((url) => {
                        imagesRef.current[problems[curr].IMG_REF] = url
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }
    }


    // 페이지 이동
    useEffect(()=>{
        if(!prbstatus){

            navigation.navigate('Type');

        }
    }, [prbstatus])


    // 제출 시 채점
    useEffect(() => {
        if(submitted && rawProblems.current.length == currentIndex){

            // 문제 형식 포함한 답안 기록
            userProblems.current[currentIndex] = {
                ...problems[currentIndex],
                ...userProblems.current[currentIndex]
            }

            rawProblems.current.push(problems[currentIndex])

        }
    }, [submitted])




    if (!isReady || currentIndex == problems.length) {
        return <Loading />
    }
    else {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>
                            {route.params.tag}
                        </Text>

                        <TouchableOpacity onPress={() => {
                            Alert.alert("학습 종료", "학습을 종료하시겠습니까?", [
                                { text: "yes", onPress: () =>  setprbstatus(false) },
                                { text: "no" }
                            ])
                        }}>
                            <Text>exit</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ProbMain PRB_NUM = {currentIndex + 1} PRB_MAIN_CONT = {problems[currentIndex].PRB_MAIN_CONT} />

                    {
                        problems[currentIndex].IMG_REF ? 
                            <ImgRef IMG_REF = {imagesRef.current[problems[currentIndex].IMG_REF]} />: null
                    }


                    {
                        problems[currentIndex].PRB_TXT ? 
                            <ProbTxt PRB_TXT = {problems[currentIndex].PRB_TXT} />: null
                    }

                    <TypeProbChoiceWrite 
                        problem = {userProblems.current}

                        currentIndex = {currentIndex}
                        setCurrentIndex = {setCurrentIndex}
                        submitted = {submitted}
                        setSubmitted = {setSubmitted}

                        PRB_CORRT_ANSW = {problems[currentIndex].PRB_CORRT_ANSW}
                        TAG = {problems[currentIndex].TAG}
                        PRB_POINT = {problems[currentIndex].PRB_POINT}

                        PRB_USER_ANSW = {userProblems.current[currentIndex] ? userProblems.current[currentIndex].PRB_USER_ANSW : null}
                        PRB_USER_ANSW2 = {userProblems.current[currentIndex] ? userProblems.current[currentIndex].PRB_USER_ANSW2 : null}
                        SCORE = {userProblems.current[currentIndex] ? userProblems.current[currentIndex].SCORE : -1}
                        ERROR_CONT = {userProblems.current[currentIndex] ? userProblems.current[currentIndex].ERROR_CONT: null}

                        size = {problems.length}

                        key = {`TYPEPROBWRITE${currentIndex}`} // textinput값 초기화
                    />
                </View>
                <View style = {{ height: 50}}/>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    outButton: {
        width: 20,
        height: 20,
        right: 10,
    },

});

export default TypeStudyWr;