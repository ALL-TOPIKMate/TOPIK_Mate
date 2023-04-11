import React from 'react';

import {View, Text} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const InfoScreen = () =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    내 정보
                </Text>
            </View>
        </View>
    );
}

export default InfoScreen;