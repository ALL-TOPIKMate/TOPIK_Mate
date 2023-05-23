import React from 'react';

import {View, Text, Button} from 'react-native';
import AppNameHeader from './component/AppNameHeader'
import firestore from '@react-native-firebase/firestore';

const MockListScreen = ({navigation, route}) => {
    return (
        <View>
            <Text>
                선택한 TOPIK 레벨: { route.params.level }
            </Text>
            <Button title = "32st topik mock test" onPress={()=>{navigation.push("MockStudy", {order: 32})}}/>
            <Button title = "60st topik mock test" onPress={()=>{navigation.push("MockStudy", {order: 60})}}/>
        </View>
    );
}

export default MockListScreen;