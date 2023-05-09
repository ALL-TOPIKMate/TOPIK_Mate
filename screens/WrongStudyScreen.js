import React, {useState} from 'react'
import {View, Text} from "react-native";


const WrongStudyScreen = ({route, navigation}) =>{
    const [data, setData] = useState([]);

    return (
        <View>
            {
                route.params.userTag.map(data => {
                    return <Text>{data}</Text>
                })
            }
        </View>
    );
}

export default WrongStudyScreen;