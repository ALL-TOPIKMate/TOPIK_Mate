import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MockTimer = ({ setIsEnd }) => {

    const navigation = useNavigation();

    const [time, setTime] = useState(10); // 30s

    useEffect(() => {
        const id = setInterval(() => {
            setTime((time) => time - 1);
        }, 1000); // 1s

        // 타이머 종료. Alert() -> 결과화면 이동
        if (time === 0) {
            clearInterval(id);

            Alert.alert('The exam now ends', 'Go to see the result', [
                {
                    text: 'Close',
                    onPress: () => navigation.goBack()
                },
                {
                    text: 'Go',
                    onPress: () => {
                        setIsEnd(true);
                    }
                }
            ]);

        }

        return () => clearInterval(id);

    }, [time])


    return (
        <View>
            <Text>{time}</Text>
        </View>
    )

}

const styles = StyleSheet.create({

})

export default MockTimer;
