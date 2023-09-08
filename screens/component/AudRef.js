import { transform } from '@babel/core';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'



const AudRef = ({ audio }) => {

    const [isRunning, setIsRunning] = useState(false);
    const [isSlowRunning, setIsSlowRunning] = useState(false);


    useEffect(() => {
        setIsRunning(false)
        setIsSlowRunning(false)
    }, [audio])


    // 오디오 재생 / 스탑 함수
    // 오디오 속도 조절시 자동 재생됨 -> 오디오 중단
    function audioPlay() {
        setIsSlowRunning(false)

        if (audio) {
            if (audio.isPlaying()) {

                audio.pause()
                setIsRunning(false)

            } else {

                setIsRunning(true)
                audio.setSpeed(1)
                audio.pause()

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


    // 오디오 재생 / 스탑 함수
    // 오디오 속도 조절시 자동 재생됨 -> 오디오 중단
    function audioSlowPlay() {
        setIsRunning(false)

        if (audio) {

            if (audio.isPlaying()) {

                audio.pause()
                setIsSlowRunning(false)

            } else {

                setIsSlowRunning(true)
                audio.setSpeed(0.75)
                audio.pause()

                audio.play((success) => {
                    if (success) {
                        setIsSlowRunning(false);
                        console.log('successfully finished playing');
                    } else {
                        setIsSlowRunning(false);
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
                        ? <View style={styles.stopButton} />
                        : <View style={styles.startButton} />
                }
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { audioSlowPlay() }} style={[styles.btnPlay, {transform: [{scale: 0.65}], marginTop: 20}]}>
                <Text style = {{color: "#F6F1F1", fontSize: 12, left: 28, bottom: isSlowRunning ? 14 : 8}}>
                    Slow
                </Text>
                
                {
                    isSlowRunning
                    ? <View style={[styles.stopButton, {bottom: 8}]} />
                    : <View style={[styles.startButton, {bottom: 8}]} />
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btnBox: {
        backgroundColor: "#D9D9D9",
        flexDirection: "row",
        justifyContent: "center",

        alignItems: "center",

        height: 160
    },

    btnPlay: {
        backgroundColor: "#94AF9F",
        width: 100,
        height: 100,
        borderRadius: 20,

        alignItems: "center",
        justifyContent: "center"
    },

    // triangle shape
    startButton: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 25,
        borderRightWidth: 25,
        borderBottomWidth: 50,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#F6F1F1",

        transform: [{ rotate: "90deg" }],

        left: 5
    },
    // rectangle shape
    stopButton: {
        width: 40,
        height: 40,
        backgroundColor: "#F6F1F1"
    }
})


export default AudRef;