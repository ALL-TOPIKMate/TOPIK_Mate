import React from 'react';

import {View, Text, Button} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const MocktestScreen = ({navigation}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    모의고사
                </Text>

                <Button title = "32st topik mock test" onPress={()=>{navigation.push("MockStudy", {order: 32})}}/>
                <Button title = "33st topik mock test" onPress={()=>{navigation.push("MockStudy", {order: 33})}}/>
            </View>
        </View>
    );
}

export default MocktestScreen;