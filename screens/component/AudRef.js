import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'



const AudRef = (props) =>{
    return (    
        <View>
            <Text style = {styles.play}>
                <Button title = "Start"/>
                <Button title = "Stop"/>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    play:{
        textAlign: 'center',

    },
})


export default AudRef;