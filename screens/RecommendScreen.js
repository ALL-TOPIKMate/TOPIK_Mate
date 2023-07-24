import React, { useEffect, useState, useRef, useContext } from 'react';
import { Button, View ,Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth"
import UserContext from "../lib/UserContext"
// import {subscribeAuth } from "../lib/auth";


import AppNameHeader from './component/AppNameHeader'


const RecommendScreen = ({route, navigation}) =>{


    const User = useContext(UserContext)
    const [render, reRender] = useState(false)



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

                    <TouchableOpacity style = {styles.recommendBtn} disabled = {User.uid == undefined} onPress={()=> (User.recIndex == 10) ? (Alert.alert("", "모든 문제를 풀었습니다 다음에 도전하세요.")): (navigation.navigate("RecommendStudy", {recRender: render, recRerender: {func: reRender}})) }>
                        <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                            추천 문제 풀기
                        </Text>

                        <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                            {10 - Number(User.recIndex)} / 10
                        </Text>
                    </TouchableOpacity>
                    
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