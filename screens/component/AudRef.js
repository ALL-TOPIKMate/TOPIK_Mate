import React, {useRef} from 'react';

import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'



const AudRef = (props) =>{
    var isRunning = false;
    const currentTime = useRef(0);

    function start(){
        console.log("재생중")

        isRunning = !isRunning
    }

    function stop(){
        console.log("멈춤")

        isRunning = !isRunning
    }

    return (    
        <View style = {{flex: 3}}>
            <View style = {styles.btnBox}>
                <TouchableOpacity onPress={()=>{!isRunning ? start() : stop()}} style = {styles.btnPlay}>
                    <Text style = {{color: "#F6F1F1", fontSize: 20, textAlign: "center"}}>
                        start
                    </Text>
                </TouchableOpacity>
            </View>   

            <Text/>
        </View>
    );
}

const styles = StyleSheet.create({
   btnBox:{
    backgroundColor: "#D9D9D9", 
    flexDirection: "row", 
    justifyContent: "center",

    alignItems: "center",
    

    flex: 2
   }, 

   btnPlay:{
    backgroundColor: "#94AF9F",
    padding: 30,
    borderRadius: 20
   }
})


export default AudRef;