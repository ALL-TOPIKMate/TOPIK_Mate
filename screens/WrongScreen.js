import React, {useState, useEffect, useRef} from 'react';

import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import AppNameHeader from './component/AppNameHeader'
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";

const WrongScreen = ({navigation}) =>{
    // 유저 정보 setting
    const [userEmail, setUserEmail] = useState("")
    const [userInfo, setUserInfo] = useState(null)



    // tag 선택
    const [listen, setListen] = useState(true)
    const [read, setRead] = useState(false);

    // 학습 방법 선택
    const selectList = useRef(true);
    const randomList = useRef(false);
    const writeList = useRef(false);


    const [data, setData] = useState([]);
    const [render, reRender] = useState(false);


    const querySnapshot = firestore().collection('users');
  
 
  
    useEffect(() => {
        // 유저 이메일 setting
        const handleAuthStateChanged = (user) => {
          if (user) {
            setUserEmail(user.email)
        }
        }
        // 유저 찾기
        const unsubscribe = subscribeAuth(handleAuthStateChanged);


        // 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, []);


    // 유저 정보 setting (my_level, u_uid)
    useEffect(()=>{
        const getMyInfo = async (email) => {
            try {
                const userInfoQuery = await querySnapshot
                    .where('email', '==', email)
                    .get();
        
                if (!userInfoQuery.empty) {
                    const userData = userInfoQuery.docs[0].data();
                
                    setUserInfo({myLevel: userData.my_level, userId: userData.u_uid})
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            
        };
        if(userEmail !== ""){
            // console.log(`email 변경: ${userEmail}`)
            
            getMyInfo(userEmail)  
        }
    }, [userEmail])


    useEffect(()=>{
        const loadTypeList = async() =>{
            try{
                const typeList = []

                const typeList_l = await querySnapshot.doc(userInfo.userId).collection(`wrong_lv${userInfo.myLevel}`).doc("LS_TAG").collection("PRB_TAG").get()
                const typeList_r = await querySnapshot.doc(userInfo.userId).collection(`wrong_lv${userInfo.myLevel}`).doc("RD_TAG").collection("PRB_TAG").get()
                const typeList_w = await querySnapshot.doc(userInfo.userId).collection(`wrong_lv${userInfo.myLevel}`).doc("WR_TAG").collection("PRB_TAG").get()
                
                typeList_l.docs.forEach((doc) => {if(doc._data.tag){typeList.push({...doc.data(), section: "듣기", choice: false})}})
                typeList_r.docs.forEach((doc) => {if(doc._data.tag){typeList.push({...doc.data(), section: "읽기", choice: false})}})
                typeList_w.docs.forEach((doc) => {if(doc._data.tag){typeList.push({...doc.data(), section: "쓰기", choice: false})}})
                
                
                setData(typeList)
            }catch(error){
                console.log(error)
            }
        }

        if(userInfo !== null){
            console.log(userInfo)

            loadTypeList();
        }
    }, [userInfo])
    
    
    useEffect(()=>{
        console.log(data)
    }, [data])


    const userSelectedTag = () =>{
        var userTag = [];
        for(var i=0; i<data.length; i++){
            if(data[i].choice && (listen && data[i].section == "듣기")){
                userTag.push({tagName: data[i].tagName, section: "LS_TAG"});
            }else if(data[i].choice && (read && data[i].section == "읽기")){
                userTag.push({tagName: data[i].tagName, section: "RD_TAG"});
            }
        }

        return userTag;
    }

    const userAllTag = () =>{
        var list = []

        for(var i=0; i<data.length; i++){
            if(data[i].section == "듣기"){
                list.push({tagName: data[i].tagName, section: "LS_TAG"})
            }else if(data[i].section == "읽기"){
                list.push({tagName: data[i].tagName, section: "RD_TAG"})
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
                                오답률 {data.score}%
                                </Text>
                            </View>
                        </TouchableOpacity>  
                    )}
            }) 
        }else if(randomList.current){
            return (
                <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: "random", userTag: userAllTag(), order: 0, userInfo: userInfo, querySnapshot: querySnapshot})}} style = {styles.btnBox}>
                    <Text style = {{fontWeight: "bold", fontSize: 16}}>
                        랜덤 학습
                    </Text>
                </TouchableOpacity>
            )
        }else{ // write history
            return (data.map((data, index) => {
                        if(data.section == "쓰기"){
                            return (
                                <TouchableOpacity key = {index} onPress = {() => {navigation.push("WriteHistory", {userTag: {tagName: data.tagName, section: "WR_TAG", tag: data.tag}, userInfo: userInfo, querySnapshot: querySnapshot})}} style = {[styles.tagList]}>
                                    <Text style = {{flex: 5}}>
                                        {data.tag} 
                                    </Text>
                                    <View style = {{flex: 1, flexDirection: "column"}}>
                                        <Text style = {{flex: 1}}/>
                                        <Text style = {{fontSize: 10}}>
                                         score {data.score}
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
                <TouchableOpacity onPress = {() => {reRender(!render); writeList.current = true; if(writeList.current){randomList.current = false; selectList.current = false;} }} style = {[styles.listBox, {backgroundColor: writeList.current ? "#A4BAA1" : "#D9D9D9"}]}>
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
                    <TouchableOpacity onPress={()=>{navigation.push("WrongStudy", {key: "select", userTag: userSelectedTag(), order: 0, userInfo: userInfo, querySnapshot: querySnapshot})}} style = {styles.btnBox}>
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
        paddingVertical: 20,

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