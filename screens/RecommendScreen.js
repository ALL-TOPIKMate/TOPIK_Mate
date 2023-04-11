import React from 'react';

import {Button, View ,Text} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const RecommendScreen = ({navigation}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Button title = "추천 문제 풀기" onPress={()=> navigation.push("Study", {id: 1})}/> 
            </View>
        </View>
    );
}

export default RecommendScreen;