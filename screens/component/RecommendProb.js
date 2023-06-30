import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';



import Sound from 'react-native-sound';

Sound.setCategory('Playback');



import ProbMain from "./ProbMain";
import ImgRef from "./ImgRef"
import ProbChoice from "./ProbChoice";
import ProbSub from "./ProbSub";
import ProbTxt from "./ProbTxt"
import ProbScrpt from './ProbScrpt';



const AudRef = (audio, key) =>{

    const [isRunning, setIsRunning] = useState(false);

    function audioPlay(){
        if(audio){
            
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
        <View style = {styles.btnBox} key = {`RECOMMEND_PROB${key}`}>
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

// component화 하기
const problemStructure = (problem, nextBtn, setNextBtn, isSubmit, setIsSubmit, audio) =>{
    let question = []

    // PRB_MAIN_CONT: 메인 문제
    question.push(<ProbMain PRB_MAIN_CONT = {problem.PRB_MAIN_CONT} PRB_NUM = {problem.PRB_NUM} key = {`RECOMMEND_PROB${nextBtn*10+0}`}/>)
    if(problem.PRB_SECT == "LS"){
        question.push(AudRef(audio, nextBtn*10+1))


        // IMG_REF: 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_URL} key = {`RECOMMEND_PROB${nextBtn*10+2}`}/>)    
        }
        

        // PRB_SUB_CONT: 서브 문제
        if(problem.PRB_SUB_CONT){
            question.push(<ProbSub PRB_SUB_CONT = {problem.PRB_SUB_CONT} key = {`RECOMMEND_PROB${nextBtn*10+3}`}/>)
        }



    }else if(problem.PRB_SECT == "RD"){


        // IMG_REF: 이미지 문제
        if(problem.IMG_REF){
            question.push(<ImgRef IMG_REF = {problem.IMG_URL} key = {`RECOMMEND_PROB${nextBtn*10+4}`}/>)    
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
    question.push(<ProbChoice
        PRB_CHOICE1= {problem.PRB_CHOICE1} 
        PRB_CHOICE2={problem.PRB_CHOICE2} 
        PRB_CHOICE3= {problem.PRB_CHOICE3} 
        PRB_CHOICE4={problem.PRB_CHOICE4} 

        PRB_CHOICE_URL1 = {problem.PRB_CHOICE_URL1}
        PRB_CHOICE_URL2 = {problem.PRB_CHOICE_URL2}
        PRB_CHOICE_URL3 = {problem.PRB_CHOICE_URL3}
        PRB_CHOICE_URL4 = {problem.PRB_CHOICE_URL4}
        PRB_CORRT_ANSW = {problem.PRB_CORRT_ANSW}


        nextBtn = {nextBtn}
        setNextBtn = {setNextBtn}

        isSubmit = {isSubmit}
        setIsSubmit = {setIsSubmit}
        problem = {problem}

        
        key = {`RECOMMEND_PROB${nextBtn*10+8}`}
    />)



    return question
}

export default recommendProb = ({ problem, nextBtn, setNextBtn, isSubmit, setIsSubmit}) =>{

    const audio = problem.AUD_URL ? problem.AUD_URL : null

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
            { problemStructure(problem, nextBtn, setNextBtn, isSubmit, setIsSubmit, audio) }
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
