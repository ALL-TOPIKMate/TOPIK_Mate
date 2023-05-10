import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'



const AudRef = (props) =>{
    return (    
        <View style = {{flex: 5}}>
            <View style = {styles.button}>
                <Button title = "Start" style ={{paddingHorizontal: 10}}/>
                <Button title = "Stop"/>
            </View>   

            <View style = {{flex: 2}}>
            </View> 
        </View>
    );
}

const styles = StyleSheet.create({
   button:{
    backgroundColor: "#D9D9D9", 
    flexDirection: "row", 
    justifyContent: "center",

    alignItems: "center",
    

    flex: 3
   }
})


export default AudRef;