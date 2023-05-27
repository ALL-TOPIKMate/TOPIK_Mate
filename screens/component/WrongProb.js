import React, {useState, useEffect, useRef} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, ScrollView} from 'react-native'

import ProbMain from "./ProbMain";
import AudRef from "./AudRef";
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';
import ProbChoiceWritePrev from './ProbChoiceWritePrev';

const ischoiceComponent = () =>{
    return (
        <>
        <Text /><Text />
        
        <TouchableOpacity onPress = {() => {setClick(1)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: props.problem.choice ? setBtnColorStop(1) : setBtnColor(1)}]}>
            <Text>
                {props.problem.PRB_CHOICE1 ? props.problem.PRB_CHOICE1 : "그림1"}
            </Text>
       </TouchableOpacity>
       <Text/>
       <TouchableOpacity onPress = {() => {setClick(2)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: props.problem.choice ? setBtnColorStop(2) :setBtnColor(2)}]}>
            <Text>
                {props.problem.PRB_CHOICE2? props.problem.PRB_CHOICE2 : "그림2"}
            </Text>
       </TouchableOpacity>
       <Text/>
       <TouchableOpacity onPress = {() => {setClick(3)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: props.problem.choice ? setBtnColorStop(3) :setBtnColor(3)}]}>
            <Text>
                {props.problem.PRB_CHOICE3? props.problem.PRB_CHOICE3 : "그림3"}
            </Text>
       </TouchableOpacity>
       <Text/>
       <TouchableOpacity onPress = {() => {setClick(4)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: props.problem.choice ? setBtnColorStop(4) :setBtnColor(4)}]}>
            <Text>
                {props.problem.PRB_CHOICE4 ? props.problem.PRB_CHOICE4 : "그림4"}
            </Text>
       </TouchableOpacity>

        <Text/>

        <View style = {{flexDirection: "row", justifyContent: "center"}}>
            <TouchableOpacity onPress={()=>{props.setNextBtn(props.nextBtn-1)}} disabled = {props.nextBtn == 0} style = {[styles.button, {backgroundColor: props.nextBtn == 0 ? "#D9D9D9" : "#94AF9F", width: 100, marginHorizontal: 10}]}>
                <Text>
                    PREV
                </Text>
            </TouchableOpacity>

            
            {!subBtn ? 
            (<TouchableOpacity onPress = {() => {setSubBtn(true)}} disabled = {click==0} style = {[styles.button, {backgroundColor: click == 0 ? "#D9D9D9" : "#94AF9F", width: 100, marginHorizontal: 10}]}>
                <Text>
                    SUBMIT
                </Text>
            </TouchableOpacity>): 
            (<TouchableOpacity onPress = {() => {props.choiceRef.current = click; props.setNextBtn(props.nextBtn+1);}}  style = {[styles.button, {backgroundColor: "#94AF9F", width: 100, marginHorizontal: 10}]}>
                <Text>
                    NEXT
                </Text>
            </TouchableOpacity>)}
        </View>

        </>
    )
} 

const problemStructure = (loadedProblem, setNextBtn, nextBtn, size) => {
    let question = []

    question.push(<ProbMain PRB_MAIN_CONT = {loadedProblem.PRB_MAIN_CONT} PRB_NUM = {loadedProblem.PRB_NUM}/>)
        
    if(loadedProblem.PRB_SECT == "듣기"){
        question.push(<AudRef AUD_REF = {loadedProblem.AUD_REF}/>)

        // PRB_SUB_CONT: 서브 문제
        if(loadedProblem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {loadedProblem.PRB_SUB_CONT}/>)
        }

        ischoiceComponent()
    }else if(loadedProblem.PRB_SECT == "읽기"){
        // PRB_TXT: 지문
        question.push(<ProbTxt PRB_TXT = {loadedProblem.PRB_TXT}/>)

            // PRB_SUB_CONT: 서브 문제
        if(loadedProblem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {loadedProblem.PRB_SUB_CONT}/>)
        }// PRB_SCRPT: 서브 지문
        if(loadedProblem.PRB_SCRPT){
            question.push(<ProbScrpt PRB_SCRPT = {loadedProblem.PRB_SCRPT}/>)
        }

        ischoiceComponent()
    }else if(loadedProblem.PRB_SECT == "쓰기"){
        if(loadedProblem.IMG_REF){
            question.push(<View style = {{backgroundColor: "#D9D9D9", paddingVertical: 64, borderWidth: 1, borderColor: "black", flexShrink: 1}} key = {i*6+1}><Text>이미지</Text></View>)
        }
        // PRB_TXT: 지문
        if(loadedProblem.PRB_TXT){
            question.push(<ProbTxt PRB_TXT = {loadedProblem.PRB_TXT}/>)
        }
        // PRB_SUB_CONT: 서브 문제
        if(loadedProblem.PRB_SUB_CONT){ 
            question.push(<ProbSub PRB_SUB_CONT = {loadedProblem.PRB_SUB_CONT}/>)
        }

        question.push(<ProbChoiceWritePrev PRB_CORRT_ANSW = {loadedProblem.PRB_CORRT_ANSW} PRB_USER_ANSW = {loadedProblem.PRB_USER_ANSW} setNextBtn = {setNextBtn} nextBtn = {nextBtn} size = {size}/>)
    }


    return question
}


export default WrongProb = (props) =>{
    // 제출 여부를 확인하여 렌더링
    const [subBtn, setSubBtn] = useState(props.problem.choice === undefined ? false : true);
    // 유저가 누르는 버튼 
    const [click, setClick] = useState(0);

 

    function setBtnColor(btn){
        if(subBtn){ // 4지선다 비활성화 (사용자 정답 결과)
            if(btn == click){ // 유저가 고른 버튼
                if(btn == props.problem.PRB_CORRT_ANSW){ // 정답일경우
                    return "#BAD7E9"
                }
                
                return "#FFACAC" // 정답이 아닐 경우
            }else{ // 유저가 고른 버튼이 아닌 경우
                if(btn == props.problem.PRB_CORRT_ANSW){
                    return "#BAD7E9" // 정답을 표시
                }

                return "#D9D9D9"
            }
            
        }
        // 4지선다 활성화
        
        return (btn == click ? "#BBD6B8" : "#D9D9D9")
        
    }

    function setBtnColorStop(btn){

        if(btn == props.problem.PRB_CORRT_ANSW){
            return "#BAD7E9"
        } else if(btn == props.problem.choice){
            return "#FFACAC"
        }else{
            return "#D9D9D9"
        }
    }


    return (
      <View>
        <ScrollView style = {styles.container}>    
            {
                problemStructure(props.problem, props.setNextBtn, props.nextBtn, props.size)
            }
        </ScrollView>
      </View>  
    );
}


const styles = StyleSheet.create({
    button:{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
    },
    container:{
        padding: 20,
    },
})