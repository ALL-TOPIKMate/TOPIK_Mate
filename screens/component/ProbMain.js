import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'



const ProbMain = (props) =>{
    return (
        <View style = {{flexDirection: "row", flex: 2}}>
            <Text style = {styles.number}>Q{props.PRB_NUM}</Text>
            <Text style = {styles.title}> {props.PRB_MAIN_CONT} </Text>
        </View>
    );          
}


const styles = StyleSheet.create({
    number:{
        fontSize: 20,
        // textAlign: 'center',
        fontWeight: 'bold',

    },
    title: {
        fontSize: 13
    },
})


export default ProbMain