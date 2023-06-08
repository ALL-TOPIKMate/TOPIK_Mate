import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';




import ProbMain from "./ProbMain";
import AudRef from "./AudRef";
import ImgRef from "./ImgRef"
import ProbChoice from "./ProbChoice";
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';



// component화 하기
const problemStructure = (problem, nextBtn, setNextBtn, choiceRef) =>{
    let question = []

    // PRB_MAIN_CONT: 메인 문제
    question.push(<ProbMain PRB_MAIN_CONT = {problem.PRB_MAIN_CONT} PRB_NUM = {problem.PRB_NUM} />)
    if(problem.PRB_SECT == "LS"){
        question.push(<AudRef source = {problem.AUD_REF} />)


        // IMG_REF: 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_REF}/>)    
        }
        

        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT}/>)
        }



    }else if(problem.PRB_SECT == "RD"){


        // IMG_REF: 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_REF}/>)    
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
            question.push(<ProbScrpt PRB_SCRPT = {problem.PRB_SCRPT} />)
        }
    }

    // PRB_CHOICE1 ~ 4: 4지 선다
    question.push(<ProbChoice
        PRB_CHOICE1= {problem.PRB_CHOICE1} 
        PRB_CHOICE2={problem.PRB_CHOICE2} 
        PRB_CHOICE3= {problem.PRB_CHOICE3} 
        PRB_CHOICE4={problem.PRB_CHOICE4} 
        PRB_CORRT_ANSW = {problem.PRB_CORRT_ANSW}

        isImage = {problem.isImage}

        choiceRef = {choiceRef}
        nextBtn = {nextBtn}
        setNextBtn = {setNextBtn}
    />)



    return question
}

export default recommendProb = ({ problem, nextBtn, setNextBtn, choiceRef }) =>{
    return (
        <ScrollView style = {styles.container}>
            { problemStructure(problem, nextBtn, setNextBtn, choiceRef) }
        </ScrollView>
    )
}



const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
})
