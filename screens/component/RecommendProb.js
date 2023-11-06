import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';


import ProbMain from "./ProbMain";
import ImgRef from "./ImgRef"
import RecommendProbChoice from "./RecommendProbChoice"
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';
import AudRef from './AudRef';



// component화 하기
const problemStructure = (problem, imgRef, nextBtn, setNextBtn, isSubmit, setIsSubmit, audio) =>{
    let question = []

    // PRB_MAIN_CONT: 메인 문제
    question.push(<ProbMain PRB_MAIN_CONT = {problem.PRB_MAIN_CONT} PRB_NUM = {problem.PRB_NUM} key = {`RECOMMEND_PROB${nextBtn*10+0}`}/>)
    if(problem.PRB_SECT == "LS"){
        // question.push(AudRef(audio, nextBtn*10+1))
        question.push(<AudRef audio = {audio} key = {`RECOMMEND_PROB${nextBtn*10+1}`}/>)

        // IMG_REF: 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {imgRef[problem.IMG_REF]} key = {`RECOMMEND_PROB${nextBtn*10+2}`}/>)    
        }
        

        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT} key = {`RECOMMEND_PROB${nextBtn*10+3}`}/>)
        }



    }else if(problem.PRB_SECT == "RD"){


        // IMG_REF: 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {imgRef[problem.IMG_REF]} key = {`RECOMMEND_PROB${nextBtn*10+4}`}/>)    
        }



        // PRB_TXT: 지문
        if(problem.PRB_TXT){
            question.push(<ProbTxt PRB_TXT = {problem.PRB_TXT} key = {`RECOMMEND_PROB${nextBtn*10+5}`}/>)
        }



        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT} key = {`RECOMMEND_PROB${nextBtn*10+6}`}/>)
        }
        
        
        // PRB_SCRPT: 서브 지문
        if(problem.PRB_SCRPT){
            question.push(<ProbScrpt PRB_SCRPT = {problem.PRB_SCRPT} key = {`RECOMMEND_PROB${nextBtn*10+7}`} />)
        }
    }

    // PRB_CHOICE1 ~ 4: 4지 선다
    question.push(<RecommendProbChoice
        problem = {problem}

        PRB_CHOICE1= {problem.PRB_CHOICE1} 
        PRB_CHOICE2={problem.PRB_CHOICE2} 
        PRB_CHOICE3= {problem.PRB_CHOICE3} 
        PRB_CHOICE4={problem.PRB_CHOICE4} 

        imgRef = {imgRef} // prb_choice가 이미지일경우

        PRB_CORRT_ANSW = {problem.PRB_CORRT_ANSW}


        nextBtn = {nextBtn}
        setNextBtn = {setNextBtn}

        isSubmit = {isSubmit}
        setIsSubmit = {setIsSubmit}
        
        key = {`RECOMMEND_PROB${nextBtn*10+8}`}
    />)



    return question
}

export default recommendProb = ({ problem, audRef, imgRef, nextBtn, setNextBtn, isSubmit, setIsSubmit}) =>{

    const audio = problem.AUD_REF ? audRef[problem.PRB_ID] : null

    useEffect(()=>{

        return () => {
            if(audio){
                console.log("오디오 멈춤")
                audio.release()
            }
        }
    }, [])


    return (
        <ScrollView style = {styles.container}>
            { problemStructure(problem, imgRef, nextBtn, setNextBtn, isSubmit, setIsSubmit, audio) }
        </ScrollView>
    )
}



const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    btnBox:{
        backgroundColor: "#D9D9D9", 
        flexDirection: "row", 
        justifyContent: "center",

        alignItems: "center",

        paddingVertical: 30
    }, 

    btnPlay:{
        backgroundColor: "#94AF9F",
        padding: 30,
        borderRadius: 20
    }
})
