import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import UserContext from "../lib/UserContext"

import AppNameHeader from './component/AppNameHeader';
import { checkUserSession, createUserSession } from '../lib/auth';


// 유형별 학습 이어서풀기 -> 세션에 학습정보 저장 
const findUserLastvisibleTag = async (lastVisible) =>{    
    const user = await checkUserSession()    

    console.log(user)

    return user[lastVisible]
}

const TypeScreen = ({ navigation }) => {

    const USER = useContext(UserContext)


    // 유저 도큐먼트
    const UserLevelDoc =  firestore().collection('problems').doc(`LV${USER.level}`)


    // 영역별 선택
    const [showListenButtons, setShowListenButtons] = useState(true);
    const [showReadButtons, setShowReadButtons] = useState(false);
    const [showWriteButtons, setShowWriteButtons] = useState(false);


    // 영역별 데이터 저장
    const [listenButtonTags, setListenButtonTags] = useState([]);
    const [readButtonTags, setReadButtonTags] = useState([]); 
    const [writeButtonTags, setWriteButtonTags] = useState([]); 


    // 현재 선택한 영역 
    const [selectedButton, setSelectedButton] = useState('listen');

    
    
    useEffect(() => {
        
        dataLoading()

    }, []);


    function dataLoading(){
         
        UserLevelDoc.collection('LS_TAG').get().then((querySnapshot) => {
            if (!querySnapshot.empty) {

                // 듣기 버튼의 태그 값을 설정
                setListenButtonTags(querySnapshot.docs.map((doc) => {
                    return {...doc.data(), id: doc.id}
                }));

            }
        })


        UserLevelDoc.collection('RD_TAG').get().then((querySnapshot) => {
            if (!querySnapshot.empty) {

                // 읽기 버튼의 태그 값을 설정
                setReadButtonTags(querySnapshot.docs.map((doc) => {
                    return {...doc.data(), id: doc.id}
                }));

            }
        })


        UserLevelDoc.collection('WR_TAG').get().then((querySnapshot) => {
            if (!querySnapshot.empty) {

                // 쓰기 버튼의 태그 값을 설정
                setWriteButtonTags(querySnapshot.docs.map((doc) => {
                    return {...doc.data(), id: doc.id}
                }));

            }
        })

    }


    
    const handleListenButtonPress = async () => {
        // console.log("Listen Button press");
        setSelectedButton('listen');
        setShowListenButtons(true);
        setShowReadButtons(false);
        setShowWriteButtons(false);
    };

    const handleReadButtonPress = async () => {
        // console.log("Read Button press");
        setSelectedButton('read');
        setShowReadButtons(true);
        setShowListenButtons(false);
        setShowWriteButtons(false);
    };

    const handleWriteButtonPress = async () => {
        // console.log("Write Button press");
        setSelectedButton('write');
        setShowWriteButtons(true);
        setShowListenButtons(false);
        setShowReadButtons(false);
    };

    const handleShowDetail = () => {
        console.log('디테일 부분');
    };



    return (
        <View>
            <View style={styles.buttonRow}>
                <View style = {{flex: 0.2}}/>
                <TouchableOpacity
                    style={[styles.buttonContainer, selectedButton === 'listen' ? styles.selectedButton : styles.noSelectedButton]} onPress={handleListenButtonPress}>
                    <Text style = {{fontWeight: "bold"}}>Listening</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.1}}/>
                <TouchableOpacity
                    style={[styles.buttonContainer, selectedButton === 'read' ? styles.selectedButton : styles.noSelectedButton]} onPress={handleReadButtonPress} >
                    <Text style = {{fontWeight: "bold"}}>Reading</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.1}}/>
                <TouchableOpacity
                    style={[styles.buttonContainer, selectedButton === 'write' ? styles.selectedButton : styles.noSelectedButton, {opacity: USER.level == 1? 0.5: 1}]} onPress={handleWriteButtonPress} disabled = {USER.level == 1}>
                    <Text style = {{fontWeight: "bold"}}>Writing</Text>
                </TouchableOpacity>
                <View style = {{flex: 0.2}}/>
            </View>

            <View style = {{borderBottomColor: '#C9C9C9', borderBottomWidth: StyleSheet.hairlineWidth}}/>


            <ScrollView>

            {showListenButtons && (
                <View style={styles.buttonColumn}>
                    {listenButtonTags.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, styles.buttonMargin]}
                            onPress={async() => {
                                const isLast = await findUserLastvisibleTag(`LS_${button.id}`)
                                
                                console.log(isLast)
                                
                                if(isLast){
                                    Alert.alert("학습하기", "이어서 풀겠습니까?", [
                                        {
                                            text: "yes",
                                            onPress: () => {navigation.navigate('TypeStudyLc', { source: 'LS_TAG', paddedIndex: button.id, tag: button.tag, lastVisible: isLast });}
                                        }, 
                                        {
                                            text: "no",
                                            onPress: () => {navigation.navigate('TypeStudyLc', { source: 'LS_TAG', paddedIndex: button.id, tag: button.tag });}
                                        }
                                    ])
                                }else{
                                    navigation.navigate('TypeStudyLc', { source: 'LS_TAG', paddedIndex: button.id, tag: button.tag });
                                }
                            }}
                        >
                            <Text style={styles.columnbutton}> {button.tag} </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {showReadButtons && (
                <View style={styles.buttonColumn}>
                    {readButtonTags.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, styles.buttonMargin]}
                            onPress={async() => {
                                const isLast = await findUserLastvisibleTag(`RD_${button.id}`)
                                
                                console.log(isLast)
                                
                                if(isLast){
                                    Alert.alert("학습하기", "이어서 풀겠습니까?", [
                                        {
                                            text: "yes",
                                            onPress: () => {navigation.navigate('TypeStudyRc', { source: 'RD_TAG', paddedIndex: button.id, tag: button.tag, lastVisible: isLast });}
                                        }, 
                                        {
                                            text: "no",
                                            onPress: () => {navigation.navigate('TypeStudyRc', { source: 'RD_TAG', paddedIndex: button.id, tag: button.tag });}
                                        }
                                    ])
                                }else{
                                    navigation.navigate('TypeStudyRc', { source: 'RD_TAG', paddedIndex: button.id, tag: button.tag });
                                }
                            }}
                        >
                            <Text style={styles.columnbutton}>{button.tag} </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {showWriteButtons && (
                <View style={styles.buttonColumn}>
                    {writeButtonTags.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, styles.buttonMargin]}
                            onPress={async() => {
                                const isLast = await findUserLastvisibleTag(`WR_${button.id}`)
                                
                                console.log(isLast)
                                
                                if(isLast){
                                    Alert.alert("학습하기", "이어서 풀겠습니까?", [
                                        {
                                            text: "yes",
                                            onPress: () => {navigation.navigate('TypeStudyWr', { source: 'WR_TAG', paddedIndex: button.id, tag: button.tag, lastVisible: isLast });}
                                        }, 
                                        {
                                            text: "no",
                                            onPress: () => {navigation.navigate('TypeStudyWr', { source: 'WR_TAG', paddedIndex: button.id, tag: button.tag });}
                                        }
                                    ])
                                }else{
                                    navigation.navigate('TypeStudyWr', { source: 'WR_TAG', paddedIndex: button.id, tag: button.tag });
                                }
                            }}
                        >
                            <Text style={styles.columnbutton}>{button.tag} </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    
    // 영역(section) 컨테이너
    buttonRow: {
        flexDirection: "row", 
        marginVertical: 20
    },

    // 유형(tag) 컨테이너
    buttonColumn: {
        flexDirection: 'column',
        marginTop: 30,
        marginBottom: 100
    },

    // 영역 버튼
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        borderRadius:  4,

        paddingVertical: 4
    },
    
    // 유형 버튼
    button: {
        backgroundColor: "#8caf95",
        borderRadius: 5,
       
        // alignItems: "center",
        // justifyContent: 'center',
        padding: 32
    },
    // 유형 버튼 텍스트 컬러
    columnbutton: {
        color: '#ffffff',
    },

    // 유형 버튼 
    buttonMargin: {
        marginTop: 15, // 버튼 간의 간격 조정
        marginHorizontal: 20
    },


    // 영역 버튼 색 변경 
    selectedButton: {
        backgroundColor: '#8caf95'
    },
    // 영역 버튼 색 변경
    noSelectedButton: {
        backgroundColor: '#c9c9c9'
    }

});

export default TypeScreen;
