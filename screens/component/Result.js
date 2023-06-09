import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';


export default Result = (props) =>{
    return (
        <View style = {{flex: 1, padding: 14, alignItems: "center", justifyContent: "space-between"}}>
            <View style = {{marginTop: 32}}>
                <Text style = {[styles.text, {fontSize: 20}]}>
                    이번 학습에서 문제 {props.CORRT_CNT}개를 맞췄습니다   
                </Text>
            </View>
            <View style = {{width: 250, height: 250, borderRadius: 125, borderColor: "#BBD6B8", borderWidth: 5, alignItems: "center", justifyContent: "center"}}>
                <Text style = {[styles.text, {fontSize: 32}]}>
                    {props.CORRT_CNT} / {props.ALL_CNT}
                </Text>
            </View>
            <Text style = {[styles.text, {fontSize: 20}]}>
                잘하고 있어요!    
            </Text>

            <TouchableOpacity onPress = {() => props.navigation.navigate(props.PATH)} style = {{backgroundColor: "#94AF9F", padding: 20, borderRadius: 20, width: 300}}>
                <Text style = {[styles.text, {color: "white"}]}>
                    END LEARNING
                </Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    text:{
        textAlign: "center", 
        fontWeight: "bold",

    }
})