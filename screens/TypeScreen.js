import React from 'react';

import {View, Text, Button} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const TypeScreen = ({navigation}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    유형별 문제
                </Text>

                <Button title = "유형학습" onPress={()=>{navigation.push("Study", {id: 2})}}/>
            </View>
        </View>
    );
}

export default TypeScreen;