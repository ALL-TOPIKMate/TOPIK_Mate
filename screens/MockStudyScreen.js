import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native'
import firestore from '@react-native-firebase/firestore';

import ProbMain from "./component/ProbMain";
import AudRef from "./component/AudRef";
import ProbChoice from "./component/ProbChoice";

const [text, onChangeText] = React.useState();

const LoadProblemScreen = (loadedProblem, setProblemStructure, choiceRef, setNextBtn) => {
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
            question.push(<ProbChoice
                PRB_CHOICE1= {loadedProblem[i].PRB_CHOICE1} 
                PRB_CHOICE2={loadedProblem[i].PRB_CHOICE2} 
                PRB_CHOICE3= {loadedProblem[i].PRB_CHOICE3} 
                PRB_CHOICE4={loadedProblem[i].PRB_CHOICE4} 
                PRB_CORRT_ANSW = {loadedProblem[i].PRB_CORRT_ANSW}

                choiceRef = {choiceRef}
                nextBtn = {i}
                setNextBtn = {setNextBtn}

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
            question.push(<ProbChoice
                PRB_CHOICE1= {loadedProblem[i].PRB_CHOICE1} 
                PRB_CHOICE2={loadedProblem[i].PRB_CHOICE2} 
                PRB_CHOICE3= {loadedProblem[i].PRB_CHOICE3} 
                PRB_CHOICE4={loadedProblem[i].PRB_CHOICE4} 
                PRB_CORRT_ANSW = {loadedProblem[i].PRB_CORRT_ANSW}

                choiceRef = {choiceRef}
                nextBtn = {i}
                setNextBtn = {setNextBtn}

                key = {i*7+6}
            />)

        } else if(loadedProblem[i].PRB_SECT == "쓰기") {
            // PRB_MAIN_CONT: 메인 문제
            if(loadedProblem[i].PRB_MAIN_CONT){
               question.push(<Text style = {{flex: 3}} key = {i*7+4}>{loadedProblem[i].PRB_SUB_CONT}</Text>)
            }
            // PRB_TXT: 지문
            question.push(<Text style = {{flex: 3}} key = {i*7+3}>{loadedProblem[i].PRB_TXT}</Text>)
        
            question.push(<TextInput 
                style={styles.input} 
                placeholder="Enter your answer"
                // onChangeText={text => onChangeText(text)}

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


const StudyScreen = ({route}) =>{

    // 문제구조 html 코드
    const [problemStructure, setProblemStructure] = useState([]); // component
    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json
    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(0);
    // 4지선다 컴포넌트에서 사용자가 고른 답을 저장
    const choiceRef = useRef(0);
    // 콜렉션 불러오기
    const problemCollection = firestore().collection('problems').doc('TEST').collection('problem-list');

    // MOUNT
    useEffect(() => {
        async function dataLoading() {
    
            try {
    
                const data = await problemCollection.get();
                
                console.log(`data: ${data}`);
                setLoadedProblem(data.docs.map(doc => ({...doc.data()})))
            } catch (error) {
                console.log(error.message);
            }
    
        }

        dataLoading();
    }, []);


    // 모든 문제를 불러온 후 구조 만들기
    useEffect(()=>{
        // console.log(loadedProblem)
        LoadProblemScreen(loadedProblem, setProblemStructure, choiceRef, setNextBtn);
    }, [loadedProblem])
   
    
    // 문제 풀이 결과를 보냄 or 저장
    useEffect(()=>{
        console.log(`
            {   
                userId: hello,
                PRB_ID: AAAAAAAAAAAA,
                elapsed_time(sec): 10,
                Success: True,
                Date: 2023-04-17,
                Rank(1-5 level): 4 
            }
        `);

        console.log(choiceRef.current)

        choiceRef.current = 0;
    }, [nextBtn])

    return (
        <View style = {[styles.container, styles.containerPos]}>
            <View style = {[styles.container, styles.containerPos]}>
                
                {problemStructure[nextBtn]}
    

                <Text>
                    아이디 값은 {route.params.order}
                    버튼 값은 {nextBtn}
                </Text>
            </View>
        </View>
    );

    // return (
    //     <View>
    //         <AppNameHeader/>
    //         <View>
    //             <Text>
    //                 문제 풀이 화면
                    
    //                 모의고사 형태의 문제
               
    //                 백엔드에 해당하는 문제를 요청하여 보여줌
    //             </Text>

    //             <Text>
    //                 누른 회차 정보 {route.params.order}
    //             </Text>
    //         </View>
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container:{
        padding: 10,
    },

    containerPos: {
        flex:20
    }
})

export default StudyScreen;