import React, { useRef, useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'


// import TrackPlayer from 'react-native-track-player';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

// await TrackPlayer.setupPlayer()

const AudRef = ({ source }) =>{
    const [isRunning, setIsRunning] = useState(false);


    const [audio, setAudio] = useState(undefined)


    useEffect(()=>{

        // 오디오 객체 생성
        setAudio(new Sound(source, null, err => {
            if (err) {
                console.log('Failed to load the sound', err);
                return undefined;
              }
              
              // 로드 성공
              console.log(`오디오 로드 성공. ${source}`);
        }))

        return () => {
            if(audio){
                console.log("오디오 멈춤")
                audio.release()
            }
        }
    }, [])


    function audioPlay(){
        if(audio){
            if(audio.isRunning()){
                audio.pause()
                setIsRunning(false)
            }else{
                audio.play()
                setIsRunning(true)
            }
        }
    }


    return (    
        <View>
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

            <Text/>
            <Text/>
        </View>
    );
}

const styles = StyleSheet.create({
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


export default AudRef;