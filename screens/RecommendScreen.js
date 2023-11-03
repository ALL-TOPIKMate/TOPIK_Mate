import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, View ,Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useIsFocused } from "@react-navigation/native";


import UserContext from "../lib/UserContext"
// import {subscribeAuth } from "../lib/auth";


const RecommendScreen = ({route, navigation}) =>{

    const USER = useContext(UserContext)
    
    
    // 화면 포커싱 감지하여 재렌더링
    const isFocused = useIsFocused()
    const [render, reRender] = useState(false)


    useEffect(()=>{
        const unsubscribe = () =>{
            // console.log("포커싱 감지!! 홈화면")
            reRender(!render)
        }

        return () => unsubscribe
    }, [isFocused])


    return (
        <View style = {{flex: 1}}>
            <View style = {styles.container}>
                <View style = {styles.detail}>
                    <Text style = {{flex: 2, fontSize: 24, fontWeight: "bold"}}>WEAK POINT</Text>
                    <View style = {{flex: 4, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 4}}/>
                    <TouchableOpacity onPress = { () => {navigation.navigate("Info")} } style = {{flex:1, marginLeft: 16}}>
                        <Text>Detail</Text>
                    </TouchableOpacity>
                </View>

                <Text />
                
                <View style = {styles.detail}>
                    <Text style = {{flex: 2, fontSize: 24, fontWeight: "bold"}}>STRONG POINT</Text>
                    <View style = {{flex: 4, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 8}}/>
                    <TouchableOpacity onPress = { () => {navigation.navigate("Info")} } style = {{flex:1, marginLeft: 16}}>
                        <Text>Detail</Text>
                    </TouchableOpacity>
                </View>
                
                
                <View style = {[styles.recommend, {flex: 1.8,}]}>

                    {
                        // 레벨테스트 문제를 다 풀지 않았을 경우 (진단 고사)
                        (USER.level == 1 && USER.levelIdx < 10) || (USER.level == 2 && USER.levelIdx < 10)?
                        <TouchableOpacity style = {styles.recommendBtn} onPress={()=> navigation.navigate("LevelStudy") }>
                            <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                                진단고사 풀기
                            </Text>

                            <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                                {10 - Number(USER.levelIdx)} / 10
                            </Text>
                        </TouchableOpacity>:

                        // 다 풀었을 경우 (추천 문제)
                        <TouchableOpacity style = {[styles.recommendBtn, {opacity: USER.recIndex == 10? 0.5: 1}]} onPress={() => navigation.navigate("RecommendStudy")} disabled = {USER.recIndex}>
                        <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                            추천문제 풀기
                        </Text>

                        <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                            {10 - Number(USER.recIndex)} / 10
                        </Text>
                        </TouchableOpacity>
                    }
                    
                </View>

            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    }, 
    detail: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center"
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
    },

    modalcontainer:{
        marginBottom: 64,
    },

    modal:{
        padding: 16
    }
})

export default RecommendScreen;