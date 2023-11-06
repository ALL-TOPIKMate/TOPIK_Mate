import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MockTimer = ({ setIsEnd, level }) => {

    const navigation = useNavigation();

    const levelTime = {
        'LV1': 6000, // 100m = (60 * 100) sec
        'LV2': 10800, // 180m = (60*180) sec 
    }

    const [time, setTime] = useState(levelTime[level])

    useEffect(() => {

        // 1초마다 time 재설정(화면표시용)
        const interval = setInterval(() => {
            setTime((time) => time - 1);
        }, 1000); // 1000ms = 1s

        // 타이머 종료. Alert() -> 결과화면 이동
        if (time === 0) {
            clearInterval(interval);

            Alert.alert('The exam now ends', 'Go to see the result', [
                {
                    text: 'Close',
                    onPress: () => navigation.goBack()
                },
                {
                    text: 'Go',
                    onPress: () => setIsEnd(true)
                }
            ]);

        }

        return () => clearInterval(interval);

    }, [time])

    function getLeftMinute(time){
        return parseInt(time/60) // unit s to m
    }

    function getLeftSec(time){
        return time%60
    }

    return (
        <View>
            <Text style={styles.timeText}>Time Left: {getLeftMinute(time)}m {getLeftSec(time)}s</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    timeText: {
        fontSize: 20,
    }
})

export default MockTimer;
