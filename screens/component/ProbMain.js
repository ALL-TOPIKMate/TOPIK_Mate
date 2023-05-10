import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'

const ProbMain = (props) =>{
    return (
        <View style = {{flexDirection: "row", flex: 1}}>
            <Text style = {styles.number}>Q{props.PRB_NUM}</Text>
            <Text style = {styles.title}> {props.PRB_MAIN_CONT} </Text>
        </View>
    );          
}


const styles = StyleSheet.create({
    number:{
        fontWeight: 'bold',
        color: "#000000"
    },
    title: {
        paddingLeft: 10,
        color: "#000000"
    },
})


export default ProbMain