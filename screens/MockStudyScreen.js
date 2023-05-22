import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native'
import firestore from '@react-native-firebase/firestore';

import ProbMain from "./component/ProbMain";
import AudRef from "./component/AudRef";
import MockProbChoice from "./component/MockProbChoice";
import ProbWrite from "./component/ProbWrite";
import MockResultTable from './component/MockResultTable';
import MockWriteResult from './component/MockWriteResult';


const LoadProblemScreen = (
    loadedProblem, 
    setProblemStructure, 
    choiceRef, 
    textRef, 
    setNextBtn, 
    setTarget, 
    submitAnswers) => {

    // MOUNT시 실행되는 함수
    // 모든 문제에 대해서 구조화
  
    let question = []
    let problemStructures = [];


    // console.log(loadedProblem.length)
    for(var i=0; i<loadedProblem.length; i++){
        question = []

        // component화 하기

        // PRB_MAIN_CONT: 메인 문제
        question.push(<ProbMain PRB_MAIN_CONT = {loadedProblem[i].PRB_MAIN_CONT} PRB_NUM = {loadedProblem[i].PRB_NUM} key = {i*7+0}/>)
        if(loadedProblem[i].PRB_SECT == "듣기"){
            question.push(<AudRef AUD_REF = {loadedProblem[i].AUD_REF} key = {i*7+1}/>)
            
            // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
              question.push(<Text style = {{flex: 3}} key = {i*7+2}>{loadedProblem[i].PRB_SUB_CONT}</Text>)
            }

            // PRB_CHOICE1 ~ 4: 4지 선다
            question.push(<MockProbChoice
                PRB_CHOICE1= {loadedProblem[i].PRB_CHOICE1} 
                PRB_CHOICE2={loadedProblem[i].PRB_CHOICE2} 
                PRB_CHOICE3= {loadedProblem[i].PRB_CHOICE3} 
                PRB_CHOICE4={loadedProblem[i].PRB_CHOICE4} 
                PRB_CORRT_ANSW = {loadedProblem[i].PRB_CORRT_ANSW}

                choiceRef = {choiceRef}
                nextBtn = {i}
                setNextBtn = {setNextBtn}

                // 재확인하는 문제인지
                // targetRef = {targetRef}
                setTarget = {setTarget}

                // 이전 문제로 돌아가거나, 결과 화면에서 재확인 시 필요
                userChoice = {submitAnswers[loadedProblem[i]] !== undefined 
                    ? submitAnswers[loadedProblem[i].PRB_ID].USER_CHOICE
                    : undefined}

                // userChoice = {5}

                key = {i*7+6}
            />)

        }else if(loadedProblem[i].PRB_SECT == "읽기"){
            // PRB_TXT: 지문
            question.push(<Text style = {{flex: 3}} key = {i*7+3}>{loadedProblem[i].PRB_TXT}</Text>)
        
             // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
                question.push(<Text style = {{flex: 3}} key = {i*7+4}>{loadedProblem[i].PRB_SUB_CONT}</Text>)
            }// PRB_SCRPT: 서브 지문
            if(loadedProblem[i].PRB_SCRPT){
                question.push(<Text style = {{flex: 3}} key = {i*7+5}>{loadedProblem[i].PRB_SCRPT}</Text>)  
            }

            // PRB_CHOICE1 ~ 4: 4지 선다
            question.push(<MockProbChoice
                PRB_CHOICE1= {loadedProblem[i].PRB_CHOICE1} 
                PRB_CHOICE2={loadedProblem[i].PRB_CHOICE2} 
                PRB_CHOICE3= {loadedProblem[i].PRB_CHOICE3} 
                PRB_CHOICE4={loadedProblem[i].PRB_CHOICE4} 
                PRB_CORRT_ANSW = {loadedProblem[i].PRB_CORRT_ANSW}

                choiceRef = {choiceRef}
                nextBtn = {i}
                setNextBtn = {setNextBtn}

                // 재확인하는 문제인지
                setTarget = {setTarget}
                // setTargetProblem = {setTargetProblem}

                userChoice = {submitAnswers[loadedProblem[i]] !== undefined 
                    ? submitAnswers[loadedProblem[i].PRB_ID].USER_CHOICE
                    : undefined}

                // userChoice = {5}

                key = {i*7+6}
            />)

        } else if(loadedProblem[i].PRB_SECT == "쓰기") {
            // PRB_MAIN_CONT: 메인 문제
            if(loadedProblem[i].PRB_MAIN_CONT){
               question.push(<Text style = {{flex: 3}} key = {i*7+4}>{loadedProblem[i].PRB_SUB_CONT}</Text>)
            }
            // PRB_TXT: 지문
            question.push(<Text style = {{flex: 3}} key = {i*7+3}>{loadedProblem[i].PRB_TXT}</Text>)
        
            question.push(<ProbWrite

                textRef = {textRef}
                nextBtn = {i}
                setNextBtn = {setNextBtn}

                key = {i*7+5} 
            />)
        }

        problemStructures.push(<View style = {styles.containerPos}>{question}</View>)
    }


    // console.log(problemStructures)


    // 비동기 setstate를 동기 방식으로 처리하기
    const help = () => {
        setProblemStructure(problemStructures)
    }

    help();
    
}


const MockStudyScreen = ({navigation, route}) =>{

    // 문제구조 html 코드
    const [problemStructure, setProblemStructure] = useState([]); // component
    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json
    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(0);
    
    const choiceRef = useRef(0);
    // 풀었던 문제를 확인할 때 사용
    // const targetRef = useRef(-1);
    const [target, setTarget] = useState(-1);


    // 4지선다 컴포넌트에서 사용자가 고른 답을 저장
    const [choice, setChoice] = useState(0);
    // 쓰기 문제에서 사용자가 제출한 입력을 저장
    const textRef = useRef('');
    
    
    // 콜렉션 불러오기
    const problemCollection = firestore().collection('problems').doc('TEST').collection('problem-list');

    // 사용자가 제출한 정답 배열 -> 결과 화면으로 넘기기
    let [submitAnswers, setSubmitAnswers] = useState({});



    // MOUNT
    useEffect(() => {
        async function dataLoading() {
    
            try {
    
                const data = await problemCollection.get();
                
                console.log(`data: ${data}`);
                setLoadedProblem(data.docs.map(doc => ({...doc.data()})));
            } catch (error) {
                console.log(error.message);
            }
    
        }

        dataLoading();
    }, []);


    // 모든 문제를 불러온 후 구조 만들기 useEffect -> useLayoutEffect
    useLayoutEffect(()=>{
        // console.log(loadedProblem)
        LoadProblemScreen(loadedProblem, setProblemStructure, choiceRef, textRef, setNextBtn, setTarget, submitAnswers);
    }, [loadedProblem])
   
    
    // 문제 풀이 결과를 보냄 or 저장
    useLayoutEffect(()=>{
    
        console.log(`nextBtn: ${nextBtn}`);

        if (nextBtn !== 0) {
            
            let prbId = loadedProblem[nextBtn-1]['PRB_ID'];
            let userAnswer = loadedProblem[nextBtn-1];
                    
            console.log(`choice: ${choiceRef.current}`);
            userAnswer['USER_CHOICE'] = choiceRef.current;
                    
            choiceRef.current = 0;

            console.log(`choiceRef init. choiceRef: ${choiceRef.current}`);

            if (textRef.current !== '') {
                console.log(`textRef.current: ${textRef.current}`);
                userAnswer['USER_INPUT'] = textRef.current;
                
                textRef.current = '';

                console.log(`textRef init. textRef.current: ${textRef.current}`);                
            }

            userAnswer['_display_seq_num'] = nextBtn - 1;
            
            // 사용자 풀이 결과 - React native setState Dynamic key 설정
            // [변수]: value
            setSubmitAnswers({...submitAnswers, [prbId]: userAnswer});


            // #####################################################
            // submitAnswers 구조 ##################################
            // 
            // submitAnswers: {
                //     ABDADFA: {
                    //         사용자_정답: "",
                    //         사용자_서술형_정답: "",
                    //     }
                    // }
                    // #####################################################
                    
                    
        }
        
    }, [nextBtn])
    
    
    if (nextBtn !== loadedProblem.length) {

        return (
            <View style = {[styles.container, styles.containerPos]}>
                
                    {problemStructure[nextBtn]}
    
                <Text>
                    아이디 값은 {route.params.order}
                    버튼 값은 {nextBtn}
                </Text>
            </View>
        );
    }
    else if (nextBtn === loadedProblem.length && target !== -1) {
        return (
            <View style = {[styles.container, styles.containerPos]}>
                
                    {problemStructure[target]}
    
                <Text>
                    아이디 값은 {route.params.order}
                    {/* 확인하고 있는 문제 번호 {targetRef} */}
                </Text>
            </View>
        );
    }
    else if (nextBtn === loadedProblem.length) {

        const lProblems = [];
        const wProblems = [];
        const rProblems = [];

        let lProblemsScore = 0;
        let wProblemsScore = 0;
        let rProblemsScore = 0;

        Object.keys(submitAnswers).map((pid) => {

            if (submitAnswers[pid].PRB_SECT === '듣기') {
                lProblems.push(submitAnswers[pid]);
                
                lProblemsScore += 
                    submitAnswers[pid].USER_CHOICE == submitAnswers[pid].PRB_CORRT_ANSW 
                    ? submitAnswers[pid].PRB_POINT 
                    : 0;
            } else if (submitAnswers[pid].PRB_SECT === '쓰기') {
                wProblems.push(submitAnswers[pid]);
            } else if (submitAnswers[pid].PRB_SECT === '읽기') {
                rProblems.push(submitAnswers[pid]);

                rProblemsScore += 
                    submitAnswers[pid].USER_CHOICE == submitAnswers[pid].PRB_CORRT_ANSW 
                    ? submitAnswers[pid].PRB_POINT 
                    : 0;
            }

            console.log(submitAnswers[pid].PRB_SECT);

        });

        console.log(`lProblemsScore: ${lProblemsScore}`);
        console.log(`wProblemsScore: ${wProblemsScore}`);
        console.log(`rProblemsScore: ${rProblemsScore}`);

        // 필요에 따라 문항 번호 순으로 문제 정렬할 것(파이어베이스에서 document는 id순으로 자동 정렬됨)
        // lProblems.sort((a, b) => a.PRB_ID > b.PRB_ID ? 1 : -1)
        // console.log(lProblems)

        // lProblems.sort()

        return (
            <ScrollView style = {[styles.container, styles.containerPos]}>
                <View style = {styles.resultSummary}>
                    <Text>회차정보</Text>
                    <Text>Total {lProblemsScore + wProblemsScore + rProblems} score</Text>
                </View>

                {/* 듣기 영역 */}
                <View style = {styles.resultSummary}>
                    <Text style = {styles.problemSection}>듣기 영역</Text>
                    <Text>{lProblemsScore} Score</Text>
                </View>
                <MockResultTable results={lProblems} setTarget={setTarget}/>

                {/* 쓰기 영역 */}
                <Text style = {styles.problemSection}>쓰기 영역</Text>
                <MockWriteResult results={wProblems}/>
                {/* <FlatList
                    data={wProblems}
                    renderItem={({item}) =>
                        <Text style = {styles.item}>
                            {item.PRB_ID}
                            {item.PRB_CORRT_ANSW}
                            {item.USER_INPUT}
                        </Text>
                    }
                /> */}

                {/* 읽기 영역 */}
                <Text style = {styles.problemSection}>읽기 영역</Text>
                <MockResultTable results={rProblems} setTarget={setTarget}/>

                <Button 
                    title='End mock test'
                    style={styles.button} 
                    onPress={() => navigation.goBack()}/>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    containerPos: {
        flex: 20
    },

    resultSummary: {
        flexDirection: 'row'
    },
    
    problemSection: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    item: {
        fontSize: 20,
        color: "#A5a5a5",
    },
    button:{
        flex: 3,
        borderRadius: 10,
        padding: 16,
        backgroundColor: '#BBD6B8',
        // flexDirection: "row",
        // justifyContent: "center"

    },
})

export default MockStudyScreen;