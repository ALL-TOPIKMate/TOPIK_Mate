import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'
import AppNameHeader from './component/AppNameHeader'
import ProbMain from "./component/ProbMain";
import AudRef from "./component/AudRef";

const LoadProblemScreen = (loadedProblem, setLoadedProblem, problemStructure, setProblemStructure) => {
    // MOUNT시 실행되는 함수
    // 모든 문제에 대해서 구조화
  
    let question = []
    let problemStructures = [];

    console.log(loadedProblem.length)
    for(var i=0; i<loadedProblem.length; i++){
        question = []

        // component화 하기

        // PRB_MAIN_CONT: 메인 문제
        question.push(<ProbMain PRB_MAIN_CONT = {loadedProblem[i].PRB_MAIN_CONT} PRB_NUM = {loadedProblem[i].PRB_NUM}/>)
        if(loadedProblem[i].PRB_SECT == "듣기"){
            question.push(<AudRef AUD_REF = {loadedProblem[i].AUD_REF}/>)
            
            // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
              question.push(<Text key = "3">{loadedProblem[i].PRB_SUB_CONT}</Text>)
            }
            
            // PRB_CHOICE1 ~ 4: 4지 선다
            question.push(<Text key = "4">{loadedProblem[i].PRB_CHOICE1}</Text>)
            
            question.push(<Text key = "5">{loadedProblem[i].PRB_CHOICE2}</Text>)
            
            question.push(<Text key = "6">{loadedProblem[i].PRB_CHOICE3}</Text>)
            
            question.push(<Text key = "7">{loadedProblem[i].PRB_CHOICE4}</Text>)
        }else if(loadedProblem[i].PRB_SECT == "읽기"){
            // PRB_TXT: 지문
            question.push(<Text key = "2">{loadedProblem[i].PRB_TXT}</Text>)
        
             // PRB_SUB_CONT: 서브 문제
             if(loadedProblem[i].PRB_SUB_CONT){
                question.push(<Text key = "3">{loadedProblem[i].PRB_SUB_CONT}</Text>)
              }// PRB_SCRPT: 서브 지문
              else if(loadedProblem[i].PRB_SCRPT){
                question.push(<Text key = "3">{loadedProblem[i].PRB_SCRPT}</Text>)  
              }
        
               // PRB_CHOICE1 ~ 4: 4지 선다
            question.push(<Text key = "4">{loadedProblem[i].PRB_CHOICE1}</Text>)
            
            question.push(<Text key = "5">{loadedProblem[i].PRB_CHOICE2}</Text>)
            
            question.push(<Text key = "6">{loadedProblem[i].PRB_CHOICE3}</Text>)
            
            question.push(<Text key = "7">{loadedProblem[i].PRB_CHOICE4}</Text>)
        }

        problemStructures.push(<View>{question}</View>)
    }


    console.log(problemStructures)



    // 비동기 setstate를 동기 방식으로 처리하기
    const help = () => {
        setProblemStructure(problemStructures)
    }

    help();
}



const StudyScreen = ({route}) =>{
    // 비동기 state
    const [problemStructure, setProblemStructure] = useState([]); // component
    const [loadedProblem, setLoadedProblem] = useState([]); // json

    const [nextBtn, setNextBtn] = useState(0);
    
    // MOUNT 
    useEffect(()=> {
        // 백엔드에서 json 형태의 문제를 load
      
        setLoadedProblem([
        {
            PRB_SECT: "듣기",
            PRB_NUM: 1,
            PRB_CORRT_ANSW: 3,
            PRB_POINT: 4,
            PRB_MAIN_CONT: "다음을 듣고 <보기>와 같이 물음에 맞는 대답을 고르십시오.",
            AUD_REF: "",
            PRB_CHOICE1: "네, 책이에요.",
            PRB_CHOICE2: "아니요, 책이 있어요. ",
            PRB_CHOICE3: "네, 책이 많아요. ",
            PRB_CHOICE4: "아니요, 책이 좋아요."
         }, 
         {
            PRB_SECT: "듣기",
            PRB_NUM: 21,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음을 듣고 물음에 답하십시오.",
            PRB_SUB_CONT: "남자의 중심 생각으로 맞는 것을 고르십시오.",
            AUD_REF: "",
            PRB_CHOICE1: "네, 책이에요.",
            PRB_CHOICE2: "아니요, 책이 있어요. ",
            PRB_CHOICE3: "네, 책이 많아요. ",
            PRB_CHOICE4: "아니요, 책이 좋아요."
         },
         {
            PRB_SECT: "읽기",
            PRB_NUM: 11,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음 글 또는 도표의 내용과 같은 것을 고르십시오.",
            PRB_TXT: "최근 70~80년대를 경험해 볼 수 있는 문화 공간이 생겼다. 서울시에서 새로 문을 연 '추억극장'이 바로 그곳이다. 입장료 2000원만 내면 남녀노소 누구나 그때 유행했던 영화를 관람할 수 있으며 커피와 차, 과자 등 간단한 간식도 먹을 수 있다. 극장 내부에는 추억의 영화 포스터, 영화표 등이 전시되어 있다.",
            PRB_CHOICE1: "이곳에서 옛날 영화 포스터를 살 수 있다.",
            PRB_CHOICE2: "얼마 전 추억의 문화 공간이 새로 만들어졌다.",
            PRB_CHOICE3: "추억극장은 입장료가 없기 때문에 인기가 많다.",
            PRB_CHOICE4: "추억극장에서는 최근에 나온 영화도 볼 수 있다."
         },
         {
            PRB_SECT: "읽기",
            PRB_NUM: 19,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음을 읽고 물음에 답하십시오.",
            PRB_SUB_CONT: "( )에 들어갈 알맞은 것을 고르십시오.",
            PRB_TXT: "과일을 빨리 익히기 위해 화학 물질이 사용되기도 한다. 그러나 화학 물질로 익힌 과일은 겉은 익었지만 속이 잘 익지 않은 경우가 많다. 그래서 화학 물질로 익힌 과일은 대게 자연적으로 숙성된 과일에 비해 맛과 향이 떨어진다. ( ) 화학 물질이 과일 껍질에 남게 될 수도 있다. 이런 과일을 지속적으로 먹으면 건강에 문제가 생기게 된다.",
            PRB_CHOICE1: "또는",
            PRB_CHOICE2: "또한",
            PRB_CHOICE3: "그래도",
            PRB_CHOICE4: "그러면"
         },
         {
            PRB_SECT: "읽기",
            PRB_NUM: 39,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음 글에서 <보기>의 문장이 들어가기에 가장 알맞은 곳을 고르십시오.",
            PRB_TXT: "운전 시 안전과 직결되는 것 중의 하나가 바로 차선이다. ( ㉠ ) 야간운전 중에 차선이 잘 보이지 않으면 크고 작은 사고들이 발생하게 될 것이다. ( ㉡ ) 반사 성능을 더욱 강화하고자 할 때에는 유리알이 혼합된 페인트를 사용할 수 있다. ( ㉢ ) 이렇게 하면 유리알이 불빛에 반사되어 차선이 더욱 잘 보이게 된다. ( ㉣ )",
            PRB_SCRPT: "이를 방지하기 위해 야간에 차선이 잘 보이도록 반사 기능이 있는 특수한 페인트를 사용한다.",
            PRB_CHOICE1: "㉠",
            PRB_CHOICE2: "㉡",
            PRB_CHOICE3: "㉢",
            PRB_CHOICE4: "㉣"
         },
         
        ])
        
    }, []);
    // setState 실행


    // 모든 문제를 불러온 후 구조 만들기
    useEffect(()=>{
        console.log(loadedProblem)
        LoadProblemScreen(loadedProblem, setLoadedProblem, problemStructure, setProblemStructure);
    }, [loadedProblem])
    
    // 문제 풀이 결과를 보냄

    // useEffect(()=>{
    //     console.log(`
    //         {   
    //             userId: hello,
    //             PRB_ID: AAAAAAAAAAAA,
    //             elapsed_time(sec): 10,
    //             Success: True,
    //             Date: 2023-04-17,
    //             Rank(1-5 level): 4 
    //         }
    //     `);
    // }, [nextBtn])
    


    return (
        <View style = {styles.container}>
            <AppNameHeader/>
            <View>
                
                {problemStructure[nextBtn]}
                <Button onPress = {() => {setNextBtn(nextBtn+1)}} title = "next to"/>

                <Text>
                    아이디 값은 {route.params.id}
                    버튼 값은 {nextBtn}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 30,
    }
})

export default StudyScreen;