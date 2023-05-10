import React, {useState, useEffect, useRef} from 'react';

import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const WrongScreen = ({navigation}) =>{
    // tag 선택
    const [listen, setListen] = useState(true)
    const [read, setRead] = useState(false);

    // 학습 방법 선택
    const selectList = useRef(true);
    const randomList = useRef(false);
    const writeList = useRef(false);

    const [data, setData] = useState([]);
    const [render, reRender] = useState(false);

    // mount
    useEffect(()=>{
        // 유저의 모든 유형을 가져옴
        setData([
            {tag: "중심 생각 고르기1", PRB_RSC:"60회 TOPIK 2", rating: "0", section: "듣기", choice: false},
            {tag: "중심 생각 고르기2", PRB_RSC:"60회 TOPIK 2",rating: "0" , section: "듣기", choice: false},
            {tag: "중심 생각 고르기3", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "듣기", choice: false},
            {tag: "중심 생각 고르기4", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "중심 생각 고르기5", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "중심 생각 고르기6", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "중심 생각 고르기7", PRB_RSC:"60회 TOPIK 2",rating: "0/10", section: "쓰기", choice: false},
            {tag: "중심 생각 고르기8", PRB_RSC:"60회 TOPIK 2",rating: "0/10", section: "쓰기", choice: false},
            {tag: "중심 생각 고르기9", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "듣기", choice: false},
            {tag: "중심 생각 고르기10", PRB_RSC:"60회 TOPIK 2",rating: "0" , section: "듣기", choice: false},
            {tag: "중심 생각 고르기11", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "듣기", choice: false},
            {tag: "중심 생각 고르기12", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "중심 생각 고르기13", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "중심 생각 고르기14", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "중심 생각 고르기15", PRB_RSC:"60회 TOPIK 2",rating: "0/10", section: "쓰기", choice: false},
            {tag: "중심 생각 고르기16", PRB_RSC:"60회 TOPIK 2",rating: "0/10", section: "쓰기", choice: false},
        ])
    }, [])


    const userSelectedTag = () =>{
        var userTag = [];
        for(var i=0; i<data.length; i++){
            if(data[i].choice && ((listen && data[i].section == "듣기") || (read && data[i].section == "읽기"))){
                userTag.push(data[i].tag);
            }
        }

        return userTag;
    }

    const userAllTag = () =>{
        var list = []

        for(var i=0; i<data.length; i++){
            if(data.section != "쓰기"){
                list.push(data[i].tag)
            }
        }

        return list;
    }

    const showUserList = () => {
        if(selectList.current){
            return data.map((data,index) => {
                if((data.section == "듣기" && listen) || (data.section == "읽기" && read)){
                    return (
                            <TouchableOpacity key = {index} onPress = {() => {data.choice = !(data.choice); reRender(!render);}} style = {[styles.tagList, {backgroundColor: data.choice ? "#BBD6B8" : "#D9D9D9"}]}>
                                <Text style = {{flex: 5}}>
                                    {data.tag} 
                                </Text>
                                <View style = {{flex: 1, flexDirection: "column"}}>
                                    <Text style = {{flex: 1}}/>
                                    <Text style = {{fontSize: 10}}>
                                    오답률 {data.rating}%
                                    </Text>
                                </View>
                            </TouchableOpacity>   
                    )}
            })
        }else if(randomList.current){
            return (
            <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: 0, userTag: userAllTag()})}} style = {styles.btnBox}>
                <Text style = {{fontWeight: "bold", fontSize: 16}}>
                    랜덤 학습
                </Text>
            </TouchableOpacity>
            )
        }else{
            return (data.map((data, index) => {
                        if(data.section == "쓰기"){
                            return (
                                <TouchableOpacity key = {index} onPress = {() => {navigation.push("WriteHistory", {userTag: data.PRB_RSC})}} style = {[styles.tagList]}>
                                    <Text style = {{flex: 5}}>
                                        {data.PRB_RSC} 
                                    </Text>
                                    <View style = {{flex: 1, flexDirection: "column"}}>
                                        <Text style = {{flex: 1}}/>
                                        <Text style = {{fontSize: 10}}>
                                         score {data.rating} 
                                        </Text>
                                    </View>
                                </TouchableOpacity>       
                        )}
                    })
            )
        }
    }

    return (
        <View style = {{flexDirection: "column", flex: 10}}>
            <View style = {{flexDirection: "row"}}>
                <View style = {{flex: 0.2}}/>
                <TouchableOpacity onPress = {() => {reRender(!render); selectList.current = true; if(selectList.current){randomList.current = false; writeList.current = false;} }} style = {[styles.listBox, {backgroundColor: selectList.current ? "#A4BAA1" : "#D9D9D9"}]}>
                    <Text style = {{fontWeight: "bold"}}>선택 학습</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.1}}/>
                <TouchableOpacity onPress = {() => {reRender(!render); randomList.current = true; if(randomList.current){selectList.current = false; writeList.current = false;} }} style = {[styles.listBox, {backgroundColor: randomList.current ? "#A4BAA1" : "#D9D9D9"}]}>
                    <Text style = {{fontWeight: "bold"}}>랜덤 학습</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.1}}/>
                <TouchableOpacity onPress = {() => {reRender(!render); writeList.current = true; if(writeList.current){randomList.current = false; selectList.current = false;} }} style = {[styles.listBox, {backgroundColor: writeList.current ? "#A4BAA1" : "#D9D9D9"}]}>
                    <Text style = {{fontWeight: "bold"}}>쓰기 히스토리</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.2}}/>
            </View>            

            <View style ={{flex: 6, padding: 16}}>
                {
                    selectList.current?(<>
                        <Text style = {{fontSize: 20, fontWeight: "bold"}}>선택 학습</Text>
                        <Text/>
                        <Text>태그 선택</Text>

                        <View style = {[styles.tagBox, {marginVertical: 8}]}>
                            <TouchableOpacity onPress={() => {setListen(!listen)}} style = {[styles.tagBoxChild, {backgroundColor: listen ? "#BBD6B8" : "#D9D9D9"}]}>
                                <Text style = {{fontSize: 12}}>듣기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setRead(!read)}} style = {[styles.tagBoxChild, {backgroundColor: read ? "#BBD6B8" : "#D9D9D9", marginLeft: 4}]}>
                                <Text style = {{fontSize: 12}}>읽기</Text>
                            </TouchableOpacity>
                        </View>
                    </>): null
                }
                {
                    randomList.current ? (<>
                        <Text style = {{fontSize: 20, fontWeight: "bold"}}>랜덤 학습</Text>
                        <Text/>
                        <Text>듣기, 읽기 문제 중 틀린 문제를 랜덤으로 학습</Text>
                    </>): null
                }
                {
                    writeList.current ? (<>
                        <Text style = {{fontSize: 20}}>쓰기 히스토리</Text>
                        <Text/>
                        
                    </>): null 
                }
                <ScrollView>
                    { 
                        showUserList()
                    }
                    
                </ScrollView>                
            </View>
            {
                selectList.current ? (
                    <View style = {{flex: 2}}>
                        <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: 1, userTag: userSelectedTag()})}} style = {styles.btnBox}>
                            <Text style = {{fontWeight: "bold", fontSize: 16}}>
                                선택 학습
                            </Text>
                        </TouchableOpacity>

                        <View style ={{flex: 0.2}}/>
                    </View>
                ) : null
            }
        </View>
    );
}


const styles = StyleSheet.create({
    btnBox:{
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 20,

        backgroundColor: "#A4BAA1",
        borderRadius: 25,
        flex: 1,

        justifyContent: "center", 
        alignItems: "center"
    },
    tagBox:{
        flexDirection: "row",
    },
    tagBoxChild: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 15,
    },
    tagList:{
        flex: 1,
        marginVertical: 2,
        padding: 16,

        flexDirection: "row",
        backgroundColor: "#D9D9D9"
    },
    listBox: {
        flex: 1,
        alignItems: "center",
        borderRadius:  4,

        paddingVertical: 4
    }
});


export default WrongScreen;