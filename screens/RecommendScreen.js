import React, {useState} from 'react';

import {Button, View ,Text, StyleSheet, TouchableOpacity} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const RecommendScreen = ({navigation}) =>{
    const [solve, setSolve] = useState(10);

    return (
        <View style = {{flex: 1}}>
            <AppNameHeader/>
            <View style = {styles.container}>
                <View style = {styles.detail}>
                    <Text>Weak -------- <Button title = "▷" onPress = { () => {navigation.navigate("Info")} } /></Text>
                </View>
                <View style = {styles.detail}>
                    <Text>Strong -------- <Button title = "▷" onPress = {() => {navigation.navigate("Info")}}/></Text>
                </View>
                
                
                <View style = {[styles.recommend, {flex: 2,}]}>
                    <TouchableOpacity style = {styles.recommendBtn} onPress={()=> navigation.push("RecommendStudy")}>
                        <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                            추천 문제 풀기
                        </Text>
                        <Text style = {{color: "#F6F1F1", fontSize: 20}}>
                            {solve} / 10
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style = {{flex: 0.5}}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
    }, 
    detail: {
        flex: 1
    },
    recommend: {
        alignItems: "center",
        justifyContent: "center" 
    },
    recommendBtn: {
        backgroundColor: "#94AF9F",
        width: 250,
        height: 250,
        borderRadius: 125, // width / 2
        
        alignItems: "center",
        justifyContent: "center" 
    }
})

export default RecommendScreen;