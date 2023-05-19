import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import ProbMain from "./component/ProbMain";
import AudRef from "./component/AudRef";
import ProbChoice from "./component/ProbChoice";
import ProbSub from "./component/ProbSub";
import ProbTxt from "./component/ProbTxt"
import ProbScrpt from './component/ProbScrpt';



const LoadProblemScreen = (loadedProblem, problemStructure, setProblemStructure, choiceRef, setNextBtn) => {
    // MOUNT시 실행되는 함수
    // 모든 문제에 대해서 구조화
  
    let question = []
    let problemStructures = [];

    
    for(var i=0; i<loadedProblem.length; i++){
        question = []

        // component화 하기

        // PRB_MAIN_CONT: 메인 문제
        question.push(<ProbMain PRB_MAIN_CONT = {loadedProblem[i].PRB_MAIN_CONT} PRB_NUM = {loadedProblem[i].PRB_NUM} key = {i*6+0}/>)
        if(loadedProblem[i].PRB_SECT == "듣기"){
            question.push(<AudRef AUD_REF = {loadedProblem[i].AUD_REF} key = {i*6+1}/>)

            // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
                question.push(<ProbSub PRB_SUB_CONT = {loadedProblem[i].PRB_SUB_CONT} key = {i*6+2}/>)
            }

        }else if(loadedProblem[i].PRB_SECT == "읽기"){
            // PRB_TXT: 지문
            question.push(<ProbTxt PRB_TXT = {loadedProblem[i].PRB_TXT} key = {i*6+1}/>)

             // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
                question.push(<ProbSub PRB_SUB_CONT = {loadedProblem[i].PRB_SUB_CONT} key = {i*6+2}/>)
            }// PRB_SCRPT: 서브 지문
            if(loadedProblem[i].PRB_SCRPT){
                question.push(<ProbScrpt PRB_SCRPT = {loadedProblem[i].PRB_SCRPT} key = {i*6+3} />)
            }
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

            key = {i*6+4}
        />)

        problemStructures.push(<ScrollView style = {styles.container} key = {i*6+5}>{question}</ScrollView>)
    }


    setProblemStructure(problemStructures)
}




// route.params.key = {"select", "random", "write"}
// route.params.userTag로 유형을 나눔

// write인 경우 userTag, userRsc, userPrbNum, order
// select, random인 경우 userTag 

const WrongStudyScreen = ({route, navigation}) =>{
    // 문제구조 html 코드
    const [problemStructure, setProblemStructure] = useState([]); // component
    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json
    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(0);
    // 4지선다 컴포넌트에서 사용자가 고른 답을 저장
    const choiceRef = useRef(0);

    

    // 현재 유형의 인덱스를 가르킴
    const typeRef = useRef(0);
    // 현재 유형에 해당하는 문제 인덱스를 가르킴
    const problemRef = useRef(0); 
    // 로드한 데이터의 마지막 문제를 가르킴
    const lastVisible = useRef(0);

    
    // 복습하기 콜렉션 
    const problemCollection = firestore().collection('problems');
    

    
    useEffect(()=>{
        if(route.params.key == "select" || route.params.key == "random"){ // 선택학습이나 랜덤학습은 듣기 읽기문제만 해당함
            loadProblem();
        }else if(route.params.key =="write"){
            
        }

    }, [])


    
    // 한 유형에 대해 5문제씩 불러옴
    const loadProblem = () =>{
        async function dataLoading(){
            try{
                // A유형 collection은 -> tag: A유형1, tag: A유형2, tag: A유형3 방식으로 저장 

                // 1. startAfter 사용시 orderBy와 함께 사용
                // 2. where절에서 지정한 column과 orderBy에서 지정한 column은 동일한 column을 가져야 함
                // 3. where에서는 범위를 지정해야 한다. (== 연산자 사용 불가)
                const data = await problemCollection.where("tag", ">=", route.params.userTag[typeRef.current]).orderBy("tag").startAfter(lastVisible.current).limit(5).get();

                const rawData = data.docs.map((doc, index)=> {return {...doc.data()}})
                
                console.log(rawData)
                // 한 유형 문제를 다 풀었을 경우 다음 유형 문제로 이동, 새로운 collection load
                if(rawData.length == 0){ // collection loading
                    typeRef.current++;

                    if(typeRef.current>=route.params.userTag.length){ // 이제 그만풀어라
                        console.log("선택한 모든 유형의 문제를 풀었습니다.")
                        
                        return ;
                    }

                    const data = await problemCollection.where("tag", ">=", route.params.userTag[typeRef.current]).orderBy("tag").startAfter(lastVisible.current).limit(5).get();

                    const rawData = data.docs.map((doc, index)=> {return {...doc.data()}})
                }

                lastVisible.current = rawData[rawData.length-1].tag

                // console.log(lastVisible.current)
                setLoadedProblem(rawData)
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();
    }

    useEffect(()=>{
        LoadProblemScreen(loadedProblem, problemStructure, setProblemStructure, choiceRef, setNextBtn);
    }, [loadedProblem])
    

    useEffect(()=>{
        // console.log(`
        //     {   
        //         userId: hello,
        //         PRB_ID: AAAAAAAAAAAA,
        //         elapsed_time(sec): 10,
        //         Success: True,
        //         Date: 2023-04-17,
        //         Rank(1-5 level): 4 
        //     }
        // `);

        console.log(choiceRef.current)

        choiceRef.current = 0;

        if(nextBtn >= problemStructure.length){
            loadProblem();

            setNextBtn(0);
        }
    }, [nextBtn])




    return (
        <View>
            {problemStructure[nextBtn]}
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
})



export default WrongStudyScreen;