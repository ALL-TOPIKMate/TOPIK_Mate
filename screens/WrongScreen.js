import React from 'react';

import {View, Text, Button} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const WrongScreen = ({navigation}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    오답 문제 풀기
                </Text>

                
                <Button title = "빠른학습" onPress={()=>{navigation.push("Study", {id: 3})}}/>
            </View>
        </View>
    );
}

export default WrongScreen;