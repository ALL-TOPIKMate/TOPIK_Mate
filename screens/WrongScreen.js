import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native'


import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";


import Loading from './component/Loading';
import UserContext from '../lib/UserContext';


// 유형 태그 매칭
const typeName = (userLevel, section, type) =>{
    if(userLevel == 1){
        if(section === "LS"){
            if(type === "001"){
                return "이어지는 내용 유추"
            }else if(type === "002"){
                return "대화의 장소/화제 파악"
            }else if(type === "003"){
                return "일치하는 그림 고르기"
            }else if(type === "004"){
                return "일치하는 내용 고르기"
            }else if(type === "005"){
                return "중심 생각 고르기"
            }else if(type === "006"){
                return "대화의 목적 파악"
            }else if(type ==="007"){
                return "대화 상황에서 이유 파악"
            }
        }else if(section ==="RD"){
            if(type === "001"){
                return "중심 소재 고르기"
            }else if(type ==="002"){
                return "빈칸 채우기"
            }else if(type ==="003"){
                return "일치하는 내용 고르기"
            }else if(type === "004"){
                return "중심 내용 파악"
            }else if(type ==="005"){
                return "글의 흐름 파악"
            }else if(type ==="006"){
                return "문장의 위치 파악"
            }else if(type ==="007"){
                return "글을 쓴 이유 파악"
            }
        }
    }else if(userLevel == 2){
        if(section==="LS"){
            if(type ==="001"){
                return "일치하는 그림 고르기"
            }else if(type ==="002"){
                return "이어지는 말 고르기"
            }else if(type ==="003"){
                return "알맞은 행동 고르기"
            }else if(type ==="004"){
                return "담화 참여자 고르기"
            }else if(type ==="005"){
                return "담화 전/후 내용 고르기"
            }else if(type ==="006"){
                return "중심 생각 고르기"
            }else if(type ==="007"){
                return "중심 내용/화제 고르기"
            }else if(type ==="008"){
                return "화자 의도/목적 고르기"
            }else if(type ==="009"){
                return "일치하는 내용 고르기"
            }else if(type ==="010"){
                return "담화 상황 고르기"
            }else if(type ==="011"){
                return "화자 태도/말하는 방식 고르기"
            }
        }else if(section ==="RD"){
            if(type ==="001"){
                return "빈칸에 알맞은 말 고르기"
            }else if(type ==="002"){
                return "의미가 비슷한 말 고르기"
            }else if(type ==="003"){
                return "주제 고르기"
            }else if(type ==="004"){
                return "순서 배열하기"
            }else if(type ==="005"){
                return "일치하는 내용 고르기"
            }else if(type ==="006"){
                return "필자의 의도/목적 고르기"
            }else if(type ==="007"){
                return "인물의 심정/말투/태도 고르기"
            }else if(type ==="008"){
                return "문장이 들어갈 위치 고르기"
            }else if(type ==="009"){
                return "중심 생각 고르기"
            }else if(type ==="010"){
                return "빈칸에 들어갈 문장부사 고르기"
            }
        }else if(section ==="WR"){
            if(type ==="001"){
                return "실용문 빈칸에 알맞은 말 쓰기"
            }else if(type ==="002"){
                return "설명문 빈칸에 알맞은 말 쓰기"
            }else if(type ==="003"){
                return "자료를 설명하는 글 쓰기"
            }else if(type ==="004"){
                return "주제에 대해 글 쓰기"
            }
        }
    }
}



const WrongScreen = ({navigation}) =>{
    
    const USER = useContext(UserContext)


    // tag 선택
    const [listen, setListen] = useState(true)
    const [read, setRead] = useState(false);

    // 학습 영역 선택
    const selectList = useRef(true);
    const randomList = useRef(false);
    const writeList = useRef(false);


    // 유형 리스트
    const [data, setData] = useState([])

    const [render, reRender] = useState(false);



 
  
    useEffect(() => {
        
        const loadTypeList = async() =>{
            try{
                const typeList = []

                const WrongColl = firestore().collection("users").doc(USER.uid).collection(`wrong_lv${USER.level}`)

                const LsColl = WrongColl.doc("LS_TAG").collection("PRB_TAG"); await LsColl.get().then(querySnapshot => {

                    querySnapshot.forEach(documentSnapshot =>{
                        LsColl.doc(documentSnapshot.id).collection("PRB_LIST").limit(1).get().then(doc => {
                            // PRB_LIST에 문서가 하나 이상 존재할 경우 추가
                            if(doc.size){
                                typeList.push({type: documentSnapshot.id, section: "LS", choice: false})
                            }
                        })
                    })
                })

                const RdColl = WrongColl.doc("RD_TAG").collection("PRB_TAG"); await RdColl.get().then(querySnapshot => {

                    querySnapshot.forEach(documentSnapshot =>{
                        RdColl.doc(documentSnapshot.id).collection("PRB_LIST").limit(1).get().then(doc => {
                            // PRB_LIST에 문서가 하나 이상 존재할 경우 추가
                            if(doc.size){
                                typeList.push({type: documentSnapshot.id, section: "RD", choice: false})
                            }
                        })
                    })
                })

                const WrColl = WrongColl.doc("WR_TAG").collection("PRB_TAG"); await WrColl.get().then(querySnapshot => {

                    querySnapshot.forEach(documentSnapshot =>{
                        WrColl.doc(documentSnapshot.id).collection("PRB_RSC_LIST").limit(1).get().then(doc => {
                            // PRB_LIST에 문서가 하나 이상 존재할 경우 추가
                            if(doc.size){
                                typeList.push({type: documentSnapshot.id, section: "WR", choice: false})
                            }
                        })
                    })
                })

                
                setData(typeList)
            }catch(error){
                console.log(error)
            }
        }

        if(USER.uid){

            loadTypeList();

        }
        
    }, []);



    // 유저가 고른 유형 반환
    const userSelectedTag = () =>{
        var userTag = [];

        for(var i=0; i<data.length; i++){
            if(data[i].choice && (listen && data[i].section == "LS")){
                userTag.push({tagName: data[i].type, section: "LS"});
            }else if(data[i].choice && (read && data[i].section == "RD")){
                userTag.push({tagName: data[i].type, section: "RD"});
            }
        }

        return userTag;
    }


    // 모든 유형 반환 (랜덤 학습)
    const userAllTag = () =>{
        var list = []

        for(var i=0; i<data.length; i++){
            if(data[i].section == "LS"){
                list.push({tagName: data[i].type, section: "LS"})
            }else if(data[i].section == "RD"){
                list.push({tagName: data[i].type, section: "RD"})
            }
        }

        return list;
    }


    // 유저의 학습 리스트 
    const showUserList = () => {
        if(selectList.current){
            return data.map((data,index) => {
                if((data.section == "LS" && listen) || (data.section == "RD" && read)){
                    return (
                        <TouchableOpacity key = {index} onPress = {() => {data.choice = !(data.choice); reRender(!render);}} style = {[styles.tagList, {backgroundColor: data.choice ? "#BBD6B8" : "#D9D9D9"}]}>
                            <Text style = {{flex: 5}}>
                                {typeName(USER.level, data.section, data.type)} 
                            </Text>
                            <View style = {{flex: 1, flexDirection: "column"}}>
                                <Text style = {{flex: 1}}/>
                                <Text style = {{fontSize: 10}}>
                                    {/* 문제 수 {data.prb_list_length} */}
                                </Text>
                            </View>
                        </TouchableOpacity>  
                    )}
            }) 
        }else if(randomList.current){
            return (
                <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: "random", userTag: userAllTag(), order: 0})}} style = {styles.btnBox}>
                    <Text style = {{fontWeight: "bold", fontSize: 16}}>
                        랜덤 학습
                    </Text>
                </TouchableOpacity>
            )
        }else{ // write history
            return (data.map((data, index) => {
                        if(data.section == "WR"){
                            return (
                                <TouchableOpacity key = {index} onPress = {() => {navigation.push("WriteHistory", {userTag: {tagName: typeName(USER.level, "WR", data.type), section: "WR", tag: data.type}})}} style = {[styles.tagList]}>
                                    <Text style = {{flex: 5}}>
                                        {typeName(USER.level, data.section, data.type)} 
                                    </Text>
                                    <View style = {{flex: 1, flexDirection: "column"}}>
                                        <Text style = {{flex: 1}}/>
                                        <Text style = {{fontSize: 10}}>
                                         {/* score {data.score} */}
                                        </Text>
                                    </View>
                                </TouchableOpacity>       
                        )}
                    })
            )
        }
    }

    return (
        <View style = {{flexDirection: "column", flex: 1 ,justifyContent: "space-between"}}>
            <View style = {{flexDirection: "row", marginTop: 20}}>
                <View style = {{flex: 0.2}}/>
                <TouchableOpacity onPress = {() => {reRender(!render); selectList.current = true; if(selectList.current){randomList.current = false; writeList.current = false;} }} style = {[styles.listBox, {backgroundColor: selectList.current ? "#A4BAA1" : "#D9D9D9"}]}>
                    <Text style = {{fontWeight: "bold"}}>선택 학습</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.1}}/>
                <TouchableOpacity onPress = {() => {reRender(!render); randomList.current = true; if(randomList.current){selectList.current = false; writeList.current = false;} }} style = {[styles.listBox, {backgroundColor: randomList.current ? "#A4BAA1" : "#D9D9D9"}]}>
                    <Text style = {{fontWeight: "bold"}}>랜덤 학습</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.1}}/>
                <TouchableOpacity onPress = {() => {USER.level == 1 ? alert("TOPIK1은 쓰기 유형을 제공하지 않습니다.") : reRender(!render); writeList.current = true; if(writeList.current){randomList.current = false; selectList.current = false;} }} style = {[styles.listBox, {backgroundColor: writeList.current ? "#A4BAA1" : "#D9D9D9"}]}>
                    <Text style = {{fontWeight: "bold"}}>쓰기 히스토리</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.2}}/>
            </View>            

            <View style ={{padding: 16}}>
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

            <View style = {{height: 300}}>
                <ScrollView>
                    { 
                        showUserList()
                    }
                </ScrollView> 
            </View>
            </View> 
            {
                selectList.current ? (
                    <TouchableOpacity onPress={()=>{ (userSelectedTag().length==0 ? Alert.alert("", "Please select a type") : navigation.push("WrongStudy", {key: "select", userTag: userSelectedTag(), order: 0}))}} style = {styles.btnBox}>
                        <Text style = {{fontWeight: "bold", fontSize: 16}}>
                            선택 학습
                        </Text>
                    </TouchableOpacity>
                ) : <View style = {{flex: 8}}/>         
            }

        </View>
    );

}


const styles = StyleSheet.create({
    btnBox:{
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 30,

        backgroundColor: "#A4BAA1",
        borderRadius: 25,

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
        // flex: 1,
        marginVertical: 5,
        padding: 32,


        flexDirection: "row",
        alignItems: "center",
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