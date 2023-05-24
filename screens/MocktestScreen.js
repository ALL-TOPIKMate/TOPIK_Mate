import React from 'react';

import {View, Text, Button} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const MocktestScreen = ({navigation: {navigate}}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    모의고사
                </Text>

                <Button title = "TOPIK1" onPress={() => navigate('MockList', {level: 'LV1'})}/>
                {/* {navigation}으로만 했을 때 아래 코드를 통해 화면 이동 시 route 사용이 안 됐음.  */}
                {/* <Button title = "TOPIK 1" onPress={() => {navigation.push("MockList"), {level: 1}}}/> */}
                <Button title = "TOPIK2" onPress={() => navigate('MockList', {level: 'LV2'})}/>
            </View>
        </View>
    );
}

export default MocktestScreen;