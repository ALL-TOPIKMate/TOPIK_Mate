import React, {useState, useEffect, useRef} from 'react';

import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const WrongScreen = ({navigation}) =>{
    // tag 선택
    const [listen, setListen] = useState(true)
    const [read, setRead] = useState(false);
    const [write, setWrite] = useState(false);

    const [data, setData] = useState([]);
    
    const [render, reRender] = useState(false);

    // mount
    useEffect(()=>{
        // 유저의 모든 유형을 가져옴
        setData([
            {tag: "중심 생각 고르기1", rating: "0", section: "듣기", choice: false, key: 0},
            {tag: "중심 생각 고르기2", rating: "0" , section: "듣기", choice: false, key: 1},
            {tag: "중심 생각 고르기3", rating: "0", section: "듣기", choice: false, key: 2},
            {tag: "중심 생각 고르기4", rating: "0", section: "읽기", choice: false, key: 3},
            {tag: "중심 생각 고르기5", rating: "0", section: "읽기", choice: false, key: 4},
            {tag: "중심 생각 고르기6", rating: "0", section: "읽기", choice: false, key: 5},
            {tag: "중심 생각 고르기7", rating: "0/10", section: "쓰기", choice: false, key: 6},
            {tag: "중심 생각 고르기8", rating: "0/10", section: "쓰기", choice: false, key: 7},
        ])
    }, [])


    const userSelectedTag = () =>{
        var userTag = [];
        for(var i=0; i<data.length; i++){
            if(data[i].choice && ((listen && data[i].section == "듣기") || (read && data[i].section == "읽기") || (write && data[i].section == "쓰기"))){
                userTag.push(data[i].tag);
            }
        }

        return userTag;
    }

    const userAllTag = () =>{
        return data.map(data => {return data.tag})
    }

    return (
        <View style = {{flexDirection: "column", flex: 10}}>
            <View style = {{flex: 2}}>
                <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: 0, userTag: userAllTag()})}} style = {styles.btnBox}>
                    <Text>
                        랜덤 학습
                    </Text>
                </TouchableOpacity>

                <View style ={{flex: 0.2}}/>
            </View>

            <View style ={{flex: 6}}>
                <Text>선택 학습</Text>

                <View style = {styles.tagBox}>
                    <TouchableOpacity onPress={() => {setListen(!listen); if(write== true){setWrite(false);}}} style = {[styles.tagBoxChild, {backgroundColor: listen ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>듣기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setRead(!read); if(write == true){setWrite(false);}}} style = {[styles.tagBoxChild, {backgroundColor: read ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>읽기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setWrite(!write); if(write==false){setListen(false); setRead(false);}}} style = {[styles.tagBoxChild, {backgroundColor: write ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>쓰기</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {
                        data.map(data => {
                            if((data.section == "듣기" && listen) || (data.section == "읽기" && read)){
                                return (
                                    <TouchableOpacity key={data.key} onPress = {() => {data.choice = !(data.choice); reRender(!render);}} style = {[styles.tagList, {backgroundColor: data.choice ? "#BBD6B8" : "#D9D9D9"}]}>
                                        <Text>
                                            {data.tag} 
                                        </Text>
                                        <Text>
                                            오답률 {data.rating}
                                        </Text>
                                    </TouchableOpacity>    
                            )}else if((data.section == "쓰기" && write)){
                                return (
                                    <TouchableOpacity key={data.key} onPress = {() => {data.choice = !(data.choice); reRender(!render);}} style = {[styles.tagList, {backgroundColor: data.choice ? "#BBD6B8" : "#D9D9D9"}]}>
                                        <Text>
                                            {data.tag} 
                                        </Text>
                                        <Text>
                                            {data.rating}
                                        </Text>
                                    </TouchableOpacity>    
                                )
                            }
                        })
                    }
                </ScrollView>                
            </View>

            <View style = {{flex: 2}}>
                <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: 1, userTag: userSelectedTag()})}} style = {styles.btnBox}>
                    <Text>
                        선택 학습
                    </Text>
                </TouchableOpacity>

                <View style ={{flex: 0.2}}/>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    btnBox:{
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 20,

        backgroundColor: "#BBD6B8",
        borderRadius: 25,
        flex: 1,

        justifyContent: "center", 
        alignItems: "center"
    },
    tagBox:{
        flexDirection: "row",
    },
    tagBoxChild: {
        paddingHorizontal: 20
    },
    tagList:{
        flex: 1,
    }
});


export default WrongScreen;