import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// import Sound from 'react-native-sound';

const MockAudRef = ({ source }) => {
    
    const [isPlaying, setIsPlaying] = useState(false);

    
    const audio = new Sound(source, null, (err) => {
        if (err) {
            console.log('failed to load the sound', error);
            return;
        }
        
        // 로드 성공
        console.log('duration in seconds: ' + audio.getDuration() + 'number of channels: ' + audio.getNumberOfChannels());
        
        // 반복 재생 없음
        audio.setNumberOfLoops(-1);
        
    });

    const audioControl = () => {
        if (isPlaying) {
            audio.pause((err) => {
                if (err) {
                    console.log('일시 정지 실패');
                    return;
                }
            });
            setIsPlaying(false);
        } else {
            audio.play((err) =>{
                if (err) {
                    console.log('재생 실패');
                    return;
                }
            })
            setIsPlaying(true);
        }
    }

    const play = () => {
        audio.play();
        setIsPlaying(true);
        console.log(`재생 중`);
    }

    const pause = () => {
        audio.pause();
        setIsPlaying(false);
        console.log('일시 정지');
    }
        
    return (
        <View>
            <TouchableOpacity onPress={() => {audioControl()}}>
                <Text>
                    {
                        isPlaying
                        ? 'Playing'
                        : 'Pause'
                    }
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default MockAudRef;
