import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Sound from 'react-native-sound';

Sound.setCategory('Playback');

var audio = null;

const MockAudRef = ({ source, isPlaying, setIsPlaying }) => {

    
    audio = new Sound(source, Sound.MAIN_BUNDLE, (err) => {
        if (err) {
            console.log('failed to load the sound', error);
            return;
        }
        
        // 로드 성공
        console.log('duration in seconds: ' + audio.getDuration() + 'number of channels: ' + audio.getNumberOfChannels());
        console.log('isPlaying: ', audio.isPlaying());

        // 반복 재생 없음
        audio.setNumberOfLoops(0);

        new Sound().pa
    });
    
    
    const audioControl = () => {
        if (audio.isPlaying()) {
            audio.pause((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            })
        } else {
            audio.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
    }
    
        
    return (
        <View>
            <TouchableOpacity onPress={() => audioControl()}>
                <Text>Hello</Text>
                <Text>
                    {
                        audio.isPlaying()
                        ? '멈추기'
                        : '재생하기'
                    }
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default MockAudRef;
