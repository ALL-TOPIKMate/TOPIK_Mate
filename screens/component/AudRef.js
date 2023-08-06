import React, { useRef, useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'



const AudRef = ({ audio }) =>{

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