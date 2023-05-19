import React, {useState, useEffect, useRef} from 'react';

import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import AppNameHeader from './component/AppNameHeader'
import firestore from '@react-native-firebase/firestore';


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

    // 복습하기 documnet id 불러오기
    const problemCollection = firestore().collection('problems');
  
    // mount
    useEffect(()=>{
        // 유저의 모든 유형을 가져옴
        setData([
            {tag: "중심 생각 고르기", PRB_RSC:"60회 TOPIK 2", rating: "0", section: "듣기", choice: false},
            {tag: "그림보고 대화상황 파악하기", PRB_RSC:"60회 TOPIK 2",rating: "0" , section: "듣기", choice: false},
            {tag: "듣고 이어지는 말 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "듣기", choice: false},
            {tag: "비슷한 의미의 문형 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "광고, 안내문 등 실용문을 읽고 무엇에 대한 글인지 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "글의 순서에 맞게 문장을 배열한 것 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "빈칸에 들어갈 문장 쓰기", PRB_RSC:"60회 TOPIK 2",rating: "0/10", section: "쓰기", choice: false},
            {tag: "주제에 맞는 글 쓰기", PRB_RSC:"63회 TOPIK 2",rating: "0/30", section: "쓰기", choice: false},
            {tag: "듣고 이어지는 행동 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "듣기", choice: false},
            {tag: "세부 내용 파악하기", PRB_RSC:"60회 TOPIK 2",rating: "0" , section: "듣기", choice: false},
            {tag: "중심 생각 파악하기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "듣기", choice: false},
            {tag: "글의 순서에 맞게 문장을 배열한 것 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "빈칸에 들어갈 알맞은 내용 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "글의 내용과 같은 것 고르기", PRB_RSC:"60회 TOPIK 2",rating: "0", section: "읽기", choice: false},
            {tag: "내 생각 쓰기", PRB_RSC:"58회 TOPIK 2",rating: "0/50", section: "쓰기", choice: false},
        ])

        async function dataLoading(){
            try{
                // 복습하기 콜렉션의 모든 유형 도큐먼트을 불러옴
                const data = await problemCollection.get();
                setData(data.docs.map((doc)=> {return {...doc.data(), choice: false}}))
            }catch(error){
                console.log(error.message);
            }    
        }

        // dataLoading();

    }, [])

    // useEffect(()=>{
    //     console.log(data)
    // }, [data])


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
            if(data[i].section !== "쓰기"){
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
            <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: "random", userTag: userAllTag()})}} style = {styles.btnBox}>
                <Text style = {{fontWeight: "bold", fontSize: 16}}>
                    랜덤 학습
                </Text>
            </TouchableOpacity>
            )
        }else{ // write history
            return (data.map((data, index) => {
                        if(data.section == "쓰기"){
                            return (
                                <TouchableOpacity key = {index} onPress = {() => {navigation.push("WriteHistory", {key: 2, userTag: data.tag})}} style = {[styles.tagList]}>
                                    <Text style = {{flex: 5}}>
                                        {data.tag} 
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
                        <Text style = {{fontSize: 20}}>유형별 쓰기</Text>
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
                        <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: "select", userTag: userSelectedTag()})}} style = {styles.btnBox}>
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