import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl} from 'react-native'


import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";


import Loading from './component/Loading';
import UserContext from '../lib/UserContext';
import { typeName } from '../lib/utils';



// 선택학습 유형 목록 refresh component
const scrollViewRefresh = (refresh, setRefresh) => {
    const refreshControl = () => {
        setRefresh(true)
    }

    return (
        <RefreshControl refreshing = {refresh} onRefresh = { refreshControl } />
    )
}


const WrongScreen = ({ navigation }) => {

    const USER = useContext(UserContext)

    // scroll view 새로고침 감지
    const [refresh, setRefresh] = useState(false)


    // wrong collection
    const WrongColl = firestore().collection("users").doc(USER.uid).collection("wrong_lv1")
    const WrongColl2 = firestore().collection("users").doc(USER.uid).collection("wrong_lv2")


    // topik level 선택
    const [level, setLevel] = useState(USER.level)


    // section 선택
    const [listen, setListen] = useState(true)
    const [read, setRead] = useState(false);

    // 학습 방법 선택
    const [selectList, setSelectList] = useState(true)
    const [randomList, setRandomList] = useState(false);
    const [writeList, setWriteList] = useState(false);


    const [render, reRender] = useState(false)

    // 유형 리스트
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])





    useEffect(() => {
        if (USER.uid) {
            
            loadTypeList(WrongColl, setData);
            loadTypeList(WrongColl2, setData2)

        }

    }, []);


    useEffect(() => {
        
        // pull down시, data refresh
        if(refresh){
            const wrongColl = level == 1? WrongColl: WrongColl2
            const SetData = level == 1? setData: setData2

            loadTypeList(wrongColl, SetData).then(() => {
                setRefresh(false)
                console.log("success to load")
                
            })
        }

    }, [refresh])


    // load tag list
    const loadTypeList = async (wrongcoll, setData) => {
        try {
            const typeList = []

            await wrongcoll.doc("LS_TAG").collection("PRB_TAG").get().then(documentSnapshot => {
                documentSnapshot.forEach(doc => {
                    if (doc.id != "Wrong") {
                        typeList.push({
                            tag: doc.id,
                            section: "LS",
                            choice: false
                        })
                    }
                })
            })

            await wrongcoll.doc("RD_TAG").collection("PRB_TAG").get().then(documentSnapshot => {
                documentSnapshot.forEach(doc => {
                    if (doc.id != "Wrong") {
                        typeList.push({
                            tag: doc.id,
                            section: "RD",
                            choice: false
                        })
                    }
                })
            })

            await wrongcoll.doc("WR_TAG").collection("PRB_TAG").get().then(documentSnapshot => {
                documentSnapshot.forEach(doc => {
                    if (doc.id != "Wrong") {
                        typeList.push({
                            tag: doc.id,
                            section: "WR",
                            choice: false
                        })
                    }
                })
            })


            setData(typeList)
        } catch (error) {
            console.log(error)
        }
    }


    // 유저가 고른 유형 반환 (선택 학습)
    const userSelectedTag = (data) => {
        var userTag = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i].choice && (listen && data[i].section == "LS")) {
                userTag.push({ tag: data[i].tag, section: "LS" });
            } else if (data[i].choice && (read && data[i].section == "RD")) {
                userTag.push({ tag: data[i].tag, section: "RD" });
            }
        }

        return userTag;
    }


    // 모든 유형 반환 (랜덤 학습)
    const userAllTag = (data) => {
        var userTag = []


        // 쓰기 영역을 제외한 유형
        var list = data.filter(usertag => {
            return usertag.section != "WR"
        })


        // 유형을 random하게 뽑음
        let size = list.length
        while(size--){
            // min ~ max 사이의 값을 추출
            // Math.random()*(max - min) + min 
            const rd = Math.ceil(Math.random()*size)

            userTag.push(list[rd])
            list.splice(rd, 1)
        }

        return userTag
    }


    // 유저의 학습 리스트 
    const showUserList = (data) => {
        if (selectList) {
            return data.map((data, index) => {
                if ((data.section == "LS" && listen) || (data.section == "RD" && read)) {
                    return (
                        <TouchableOpacity key={index} onPress={() => { data.choice = !(data.choice); reRender(!render); }} style={[styles.tagList, data.choice ? styles.buttonSelected : styles.buttonNotSelected]}>
                            <Text style={{ flex: 5 }}>
                                {typeName(level, data.section, data.tag)}
                            </Text>
                            <View style={{ flex: 1 }} />
                        </TouchableOpacity>
                    )
                }
            })
        } else if (writeList) {
            return (
                data.map((data, index) => {
                    if (data.section == "WR") {
                        return (
                            <TouchableOpacity key={index} onPress={() => { navigation.push("WriteHistory", {section: "WR", tag: data.tag}) }} style={styles.tagList}>
                                <Text style={{ flex: 5 }}>
                                    {typeName(level, data.section, data.tag)}
                                </Text>
                                <View style={{ flex: 1 }} />
                            </TouchableOpacity>
                        )
                    }
                })

            )
        }
    }
    
    return (
        <View>
            {/* 토픽 레벨 선택창 */}
            <View style = {{flexDirection: "row", justifyContent: "flex-end", marginVertical: 10, marginHorizontal: 30}}>
                <View style = {{flex: 3, alignItems: "flex-end"}}>
                    <Text>current level</Text>
                </View>
                
                <TouchableOpacity style = {{flex: 1, alignItems: "center", backgroundColor: "#D9D9D9", marginLeft: 5}} onPress={() => setLevel(level == 1? 2: 1)}>
                    <Text style = {{fontWeight: "bold"}}>TOPIK {level}</Text>
                </TouchableOpacity>
            </View>


            {/* 유저의 틀린문제 유형 목록 */}
            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View style={{ flex: 0.2 }} />
                <TouchableOpacity onPress={() => { setSelectList(true); setRandomList(false); setWriteList(false); }} style={[styles.listBox, selectList ? styles.buttonSelected : styles.buttonNotSelected]}>
                    <Text style={{ fontWeight: "bold" }}>선택 학습</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.1 }} />
                <TouchableOpacity onPress={() => { setRandomList(true); setSelectList(false); setWriteList(false); }} style={[styles.listBox, randomList ? styles.buttonSelected : styles.buttonNotSelected]}>
                    <Text style={{ fontWeight: "bold" }}>랜덤 학습</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.1 }} />
                <TouchableOpacity onPress={() => { setWriteList(true); setSelectList(false); setRandomList(false); }} style={[styles.listBox, writeList ? styles.buttonSelected : styles.buttonNotSelected, {opacity: level == 1 ? 0.5: 1}]} disabled = {level == 1}>
                    <Text style={{ fontWeight: "bold" }}>쓰기 히스토리</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.2 }} />
            </View>

            <View style={{ padding: 16 }}>
                {
                    selectList &&
                    <ScrollView refreshControl = {scrollViewRefresh( refresh, setRefresh )}>
                        <Text style={styles.titleText}>선택 학습</Text>
                        <Text />
                        <Text>태그 선택</Text>

                        <View style={styles.sectionBox}>
                            <TouchableOpacity onPress={() => { setListen(!listen) }} style={[styles.sectionBoxChild, listen ? styles.buttonSelected : styles.buttonNotSelected]}>
                                <Text style={{ fontSize: 12 }}>듣기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRead(!read) }} style={[styles.sectionBoxChild, read ? styles.buttonSelected : styles.buttonNotSelected, { marginLeft: 4 }]}>
                                <Text style={{ fontSize: 12 }}>읽기</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            // 선택학습의 유형리스트
                            showUserList(level == 1? data: data2)
                        }


                        <TouchableOpacity onPress={() => { (userSelectedTag(level == 1? data: data2).length == 0 ? Alert.alert("", "Please select a type") : navigation.push("WrongStudy", {key: "select", userTag: userSelectedTag(level == 1? data: data2), order: 0, level: level})) }} style={styles.btnBox}>
                            <Text style={styles.buttonText}>
                                선택 학습
                            </Text>
                        </TouchableOpacity>

                        <View style = {{ height: 200 }}/>
                    </ScrollView>
                }
                {
                    randomList &&
                    <View>
                        <Text style={styles.titleText}>랜덤 학습</Text>
                        <Text />
                        <Text>듣기, 읽기 문제 중 틀린 문제를 랜덤으로 학습</Text>

                        <TouchableOpacity disabled = { level == 1? data.length == 0: data2.length == 0 } onPress={() => { navigation.push("WrongStudy", { key: "random", userTag: userAllTag(level == 1? data: data2), order: 0, level: level }) }} style={styles.btnBox}>
                            <Text style={styles.buttonText}>
                                랜덤 학습
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    writeList &&
                    <ScrollView refreshControl = {scrollViewRefresh( refresh, setRefresh )}>
                        <Text style={styles.titleText}>유형별 쓰기</Text>
                        <Text />

                        {
                            // 쓰기 히스트리 리스트
                            showUserList(level == 1? data: data2)
                        }

                    </ScrollView>
                }

            
            </View>
        </View>
    );

}


const styles = StyleSheet.create({
    // 학습 방법 버튼 
    listBox: {
        flex: 1,
        alignItems: "center",
        borderRadius: 4,

        paddingVertical: 4
    },
    // 학습 버튼 (선택학습, 랜덤학습)
    btnBox: {
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 30,

        backgroundColor: "#A4BAA1",
        borderRadius: 25,

        justifyContent: "center",
        alignItems: "center"
    },

    // 선택학습의 영역 컨테이너
    sectionBox: {
        flexDirection: "row",
        marginVertical: 8
    },

    // 선택학습의 영역 버튼 (듣기, 읽기)
    sectionBoxChild: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 15,
    },

    // 유형 버튼
    tagList: {
        // flex: 1,
        marginVertical: 5,
        padding: 32,


        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D9D9D9"
    },

    

    // 박스 선택 배경
    buttonSelected: {
        backgroundColor: "#A4BAA1"
    },
    buttonNotSelected: {
        backgroundColor: "#D9D9D9"
    },

    titleText: {
        fontSize: 20, 
        fontWeight: "bold" 
    },
    buttonText: {
        fontWeight: "bold", 
        fontSize: 16 
    }
});


export default WrongScreen;