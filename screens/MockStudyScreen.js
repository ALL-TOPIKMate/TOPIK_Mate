import React from 'react';

import {View, Text} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const StudyScreen = ({route}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    문제 풀이 화면
                    
                    모의고사 형태의 문제
               
                    백엔드에 해당하는 문제를 요청하여 보여줌
                </Text>

                <Text>
                    누른 회차 정보 {route.params.order }
                </Text>
            </View>
        </View>
    );
}

export default StudyScreen;