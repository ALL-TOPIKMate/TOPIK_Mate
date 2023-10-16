import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';



const MockAudRef = ({ audio }) => {

    // const isComponentMounted = useRef(true)
    const intervalId = useRef(null)

    // init timer 
    const finishTime = parseInt(audio.getDuration())
    const [width, setWidth] = useState(0)

    // count timer
    const [currentTime, setCurrenttime] = useState(0)
    const [currentWidth, setCurrentWidth] = useState(0)

    const [isRunning, setIsRunning] = useState(false);


    useEffect(() => {

        return () => {
            // isComponentMounted.current = false

            clearInterval(intervalId.current)
        }

    }, [])

    useEffect(() => {

        console.log(currentWidth, currentTime)
        setCurrentWidth(width / finishTime * currentTime)

    }, [currentTime])

    useEffect(() => {

        if (isRunning) {

            intervalId.current = setInterval(() => {

                setCurrenttime(prevTime =>
                    prevTime < finishTime ?
                        prevTime + 1 :
                        prevTime
                )

            }, 1000)

        } else {

            clearInterval(intervalId.current)
            intervalId.current = null

            if(currentTime == finishTime){
                setCurrenttime(0)
                setCurrentWidth(0)
            }

        }
    }, [isRunning])


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
                        ? <View style = {styles.stopButton} />
                        : <View style = {styles.startButton} />
                }
            </TouchableOpacity>
            <View style = {{flex: 5, marginLeft: 10}}>
                <Text />
                <TouchableOpacity onLayout={(e) => { setWidth(e.nativeEvent.layout.width) }} disabled={true} style={styles.playlist} >
                    <Text style={{ backgroundColor: "black", height: 10, width: currentWidth }}>
                        ▷
                    </Text>
                </TouchableOpacity>
                <Text>
                    {currentTime} / {finishTime}초
                </Text>
            </View>
            
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
        backgroundColor: "white",

        borderRadius: 5,

        height: 10,
    },

    // triangle shape
    startButton: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 40,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#F6F1F1",

        transform: [{ rotate: "90deg" }],

        left: 5,
    },
    // rectangle shape
    stopButton: {
        width: 30,
        height: 30,
        backgroundColor: "#F6F1F1"
    }
})

export default MockAudRef;
