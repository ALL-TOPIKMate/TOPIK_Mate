import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'

const ProbMain = (props) =>{
    return (
        <View>
            <View style = {{flexDirection: "row", alignItems: "center"}}>
                <Text style = {styles.number}>Q{props.PRB_NUM}</Text>
                <Text style = {styles.title}> {props.PRB_MAIN_CONT} </Text>
            </View>
        
            <Text />
        </View>
    );          
}


const styles = StyleSheet.create({
    number:{
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000000"
    },
    title: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        color: "#000000",

        flexShrink: 1
    },
})


export default ProbMain