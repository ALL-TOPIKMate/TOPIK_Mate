import React, {useState, useEffect, useRef} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, ScrollView} from 'react-native'

import Sound from 'react-native-sound';

import ProbMain from "./ProbMain";
import ImgRef from "./ImgRef"
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';
import WrongProbChoice from './WrongProbChoice';
import WrongProbChoiceWrite from './WrongProbChoiceWrite';



Sound.setCategory('Playback');

const AudRef = (audio) =>{

    const [isRunning, setIsRunning] = useState(false);

    function audioPlay(){
        if(audio){
            // console.log(audio)
            if(audio.isPlaying()){
                audio.pause()

                setIsRunning(false)
            }else{
                setIsRunning(true)
        
                // audio.play()

                audio.play((success) => {
                    if (success) {
                      setIsRunning(false);
                      console.log('successfully finished playing');
                    } else {
                      setIsRunning(false);
                      console.log('playback failed due to audio decoding errors');
                    }
                })
            }
        }
    }

    return (
        <View style = {styles.btnBox}>
            <TouchableOpacity onPress={()=>{audioPlay()}} style = {styles.btnPlay}>
                    {
                        isRunning
                        ? <Text style = {{color: "#F6F1F1", fontSize: 20, textAlign: "center"}}>
                        Stop
                        </Text>
                        : <Text style = {{color: "#F6F1F1", fontSize: 20, textAlign: "center"}}>
                        Start
                        </Text>
                    }
            </TouchableOpacity>
        </View>  
    )
}





const problemStructure = (problem, nextBtn, setNextBtn, choiceRef, section, size, audio) => {

    let question = []


    question.push(<ProbMain PRB_MAIN_CONT = {problem.PRB_MAIN_CONT} PRB_NUM = {problem.PRB_NUM}/>)
        
    if(problem.PRB_SECT == "LS"){


        question.push(AudRef(audio))

        // 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_REF} />)
        }


        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT}/>)
        }


        question.push(<WrongProbChoice problem = {problem} nextBtn = {nextBtn} setNextBtn = {setNextBtn} choiceRef = {choiceRef} />)

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


        question.push(<WrongProbChoice problem = {problem} nextBtn = {nextBtn} setNextBtn = {setNextBtn} choiceRef = {choiceRef} />)

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

        question.push(<WrongProbChoiceWrite PRB_CORRT_ANSW = {problem.PRB_CORRT_ANSW} PRB_USER_ANSW = {problem.PRB_USER_ANSW} setNextBtn = {setNextBtn} nextBtn = {nextBtn} size = {size}/>)
    }


    return question
}


export default WrongProb = ({ problem, nextBtn, setNextBtn, choiceRef, section, size}) =>{
    
    const audio = problem.AUD_REF

    useEffect(()=>{

        return () => {
            if(audio){
                console.log("오디오 멈춤")
                audio.stop()
            }
        }
    }, [])


    return (
      <View>
        <ScrollView style = {styles.container}>    
            {
                problemStructure(problem, nextBtn, setNextBtn, choiceRef, section, size, audio)
            } 
        </ScrollView>
      </View>  
    );
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