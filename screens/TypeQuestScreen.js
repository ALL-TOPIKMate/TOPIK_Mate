import React from 'react';

import {View, Text, Button} from 'react-native'
import AppNameHeader from './component/AppNameHeader'

const TypeQuestScreen = ({navigation}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    유형별 문제에서 문제 나오는 화면
                </Text>

                
            </View>
        </View>
    );
}

export default TypeQuestScreen;