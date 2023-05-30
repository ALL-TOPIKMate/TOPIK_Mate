import React, { useRef, useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'


// import TrackPlayer from 'react-native-track-player';

// await TrackPlayer.setupPlayer()

const AudRef = ({ source }) =>{

    const [isRunning, setIsRunning] = useState(false);
    const currentTime = useRef(0); // 재생 시간

    
    const track = {
        url: source,
    }

    // useEffect(() => {
    //     async function setTrack() {
    //         try {
    //             await TrackPlayer.add(track);
    //         } catch(err) {
    //             console.log(err);
    //         }
    //     }

    //     setTrack();

    // }, [])

    const start = () => {
        console.log("재생중")

        setIsRunning(true);
    }

    const stop = () => {
        console.log("멈춤")

        setIsRunning(false);
    }

    return (    
        <View>
            <View style = {styles.btnBox}>
                <TouchableOpacity onPress={()=>{!isRunning ? start() : stop()}} style = {styles.btnPlay}>
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