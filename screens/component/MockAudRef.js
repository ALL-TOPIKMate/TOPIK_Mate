import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';



const MockAudRef = ({ audio }) => {

    
    const finishTime = audio.getDuration()
    const [currentTime, setCurrenttime] = useState(5)
    const widthRef = useRef(null)
    const width = useRef(0)


    // useEffect(()=>{

    //     if(widthRef.current){
    //         console.log(widthRef.current.width)
    //         width.current = widthRef.current.width
    //         // console.log(width.current)
    //         // setTimeout(()=>{

    //         // }, 1000)
    //     }

    // }, [widthRef])



    const [isRunning, setIsRunning] = useState(false);

    function audioPlay() {
        if (audio) {

            if (audio.isPlaying()) {
                audio.pause()

                setIsRunning(false)
            } else {
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
        <View style={styles.btnBox}>
            <TouchableOpacity onPress={() => { audioPlay() }} style={styles.btnPlay}>
                {
                    isRunning
                        ? <Text style={{ color: "#F6F1F1", fontSize: 16 }}>
                            Stop
                        </Text>
                        : <Text style={{ color: "#F6F1F1", fontSize: 16 }}>
                            Start
                        </Text>
                }
            </TouchableOpacity>
            <TouchableOpacity ref={widthRef} disabled={true} style={styles.playlist} >
                <Text style={{ backgroundColor: "black", height: 10, width: 5 }}>
                    ▷
                </Text>
            </TouchableOpacity>
            <Text>
                {audio.getDuration()}초
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    // mp3 재생 컴포넌트
    btnBox: {
        backgroundColor: "#D9D9D9",
        flexDirection: "row",
        justifyContent: "center",

        alignItems: "center",

        paddingVertical: 30,
        paddingHorizontal: 20
    },

    btnPlay: {
        backgroundColor: "#94AF9F",

        borderRadius: 20,

        width: 80,
        height: 80,

        justifyContent: "center",

        alignItems: "center",
    },

    playlist: {
        flex: 5,
        backgroundColor: "white",

        borderRadius: 5,

        height: 10,

        marginLeft: 10
    },
})

export default MockAudRef;
