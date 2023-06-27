import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';


const ResultScreen = ({route, navigation}) =>{
    const CORRT_CNT = route.params.CORRT_CNT
    const ALL_CNT = route.params.ALL_CNT
    const PATH = route.params.PATH


    return (
        <View style = {{flex: 1, padding: 14, alignItems: "center", justifyContent: "space-between"}}>
            <View style = {{marginTop: 32}}>
                <Text style = {[styles.text, {fontSize: 20}]}>
                    이번 학습에서 문제 {CORRT_CNT}개를 맞췄습니다   
                </Text>
            </View>
            <View style = {{width: 250, height: 250, borderRadius: 125, borderColor: "#BBD6B8", borderWidth: 5, alignItems: "center", justifyContent: "center"}}>
                <Text style = {[styles.text, {fontSize: 32}]}>
                    {CORRT_CNT} / {ALL_CNT}
                </Text>
            </View>
            <Text style = {[styles.text, {fontSize: 20}]}>
                잘하고 있어요!    
            </Text>

            <TouchableOpacity onPress = {() => navigation.navigate("Home")} style = {{backgroundColor: "#94AF9F", padding: 20, borderRadius: 20, width: 300}}>
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

export default ResultScreen;