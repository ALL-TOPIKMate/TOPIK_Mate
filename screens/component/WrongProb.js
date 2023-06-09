import React, {useState, useEffect, useRef} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, ScrollView} from 'react-native'



import ProbMain from "./ProbMain";
import AudRef from "./AudRef";
import ImgRef from "./ImgRef"
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';
import ProbChoicePrev from './ProbChoicePrev';
import ProbChoiceWritePrev from './ProbChoiceWritePrev';



const problemStructure = (problem, nextBtn, setNextBtn, choiceRef, section, size) => {

    let question = []


    question.push(<ProbMain PRB_MAIN_CONT = {problem.PRB_MAIN_CONT} PRB_NUM = {problem.PRB_NUM}/>)
        
    if(problem.PRB_SECT == "LS"){

        // question.push(<AudRef source = {problem.AUD_REF}/>)

        // 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_REF} />)
        }


        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT}/>)
        }


        question.push(<ProbChoicePrev problem = {problem} nextBtn = {nextBtn} setNextBtn = {setNextBtn} choiceRef = {choiceRef} />)

    }else if(problem.PRB_SECT == "RD"){

        // 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_REF} />)
        }

        // PRB_TXT: 지문
        if(problem.PRB_TXT){
            question.push(<ProbTxt PRB_TXT = {problem.PRB_TXT}/>)
        }

        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT}/>)
        }
        
        // PRB_SCRPT: 서브 지문
        if(problem.PRB_SCRPT){
            question.push(<ProbScrpt PRB_SCRPT = {problem.PRB_SCRPT}/>)
        }


        question.push(<ProbChoicePrev problem = {problem} nextBtn = {nextBtn} setNextBtn = {setNextBtn} choiceRef = {choiceRef} />)

    }else if(problem.PRB_SECT == "WR"){

        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_REF} />)
        }

        // PRB_TXT: 지문
        if(problem.PRB_TXT){
            question.push(<ProbTxt PRB_TXT = {problem.PRB_TXT}/>)
        }

        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){ 
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT}/>)
        }

        question.push(<ProbChoiceWritePrev PRB_CORRT_ANSW = {problem.PRB_CORRT_ANSW} PRB_USER_ANSW = {problem.PRB_USER_ANSW} setNextBtn = {setNextBtn} nextBtn = {nextBtn} size = {size}/>)
    }


    return question
}


export default WrongProb = ({ problem, nextBtn, setNextBtn, choiceRef, section, size}) =>{
    return (
      <View>
        <ScrollView style = {styles.container}>    
            {
                problemStructure(problem, nextBtn, setNextBtn, choiceRef, section, size)
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