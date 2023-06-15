import React, { useState,useEffect } from 'react';
import { View, Text, Button, StyleSheet,Image, TouchableOpacity } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";
const TypeScreen = ({ navigation }) => {
  const [showListenButtons, setShowListenButtons]=useState(false);
  const [showReadButtons, setShowReadButtons] = useState(false);
  const [showWriteButtons, setShowWriteButtons] = useState(false);
  const [my_Level, setmy_Level] = useState(null); // 나의 레벨
  const [prbSection, setprbSection] = useState('')
  const [listenButtonTags, setListenButtonTags] = useState([]); // 듣기 버튼의 태그 값
  const [readButtonTags, setReadButtonTags] = useState([]); // 읽기 버튼의 태그 값
  const [writeButtonTags, setWriteButtonTags] = useState([]); // 쓰기 버튼의 태그 값
  const [selectedButton, setSelectedButton] = useState(null);//버튼 클릭하는것 감지

  useEffect(() => {
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('유형별 문제 진입 페이지');
        //setUserEmail(user.email);

        // 이메일에 해당하는 레벨 가져오기
        getMyLevel(user.email);
      }
    };

    const unsubscribe = subscribeAuth(handleAuthStateChanged);

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);
  // 나의 레벨 가져오기
  const getMyLevel = async (email) => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const my_Level = userData.my_level;
        setmy_Level(my_Level)
        setprbSection('LV'+my_Level);
        return my_Level;
      }
  
      return null; // 해당 이메일에 대한 사용자가 없을 경우 null 반환
    } catch (error) {
      console.error('Error fetching user data:', error);
      setmy_Level(null);
      return null; // 에러 발생 시 null 반환
    }
    
  };
  const handleListenButtonPress = async () => {
    console.log("Listen Button press");
    setSelectedButton('listen');
    setShowListenButtons(true);
    setShowReadButtons(false);
    setShowWriteButtons(false);

    try {
      const querySnapshot = await firestore()
        .collection('problems')
        .doc(prbSection)
        .collection('LS_TAG')
        .get();
  
      if (!querySnapshot.empty) {
        const buttons = querySnapshot.docs.map((doc) => doc.data());

        setListenButtonTags(buttons); // 듣기 버튼의 태그 값을 설정
      }
    } catch (error) {
      console.error('Error fetching listen button data:', error);
    }
  };

  const handleReadButtonPress = async () => {
    console.log("Read Button press");
    setSelectedButton('read');
    setShowReadButtons(true);
    setShowListenButtons(false);
    setShowWriteButtons(false);

    try {
      const querySnapshot = await firestore()
        .collection('problems')
        .doc(prbSection)
        .collection('RD_TAG')
        .get();
  
      if (!querySnapshot.empty) {
        const buttons = querySnapshot.docs.map((doc) => doc.data());

        setReadButtonTags(buttons); // 듣기 버튼의 태그 값을 설정
      }
    } catch (error) {
      console.error('Error fetching Read button data:', error);
    }
  };
  
  const handleWriteButtonPress = async () => {
    setSelectedButton('write');
    console.log("Write Button press");
    setShowWriteButtons(true);
    setShowListenButtons(false);
    setShowReadButtons(false);

    try {
      const querySnapshot = await firestore()
        .collection('problems')
        .doc(prbSection)
        .collection('WR_TAG')
        .get();
  
      if (!querySnapshot.empty) {
        const buttons = querySnapshot.docs.map((doc) => doc.data());

        setWriteButtonTags(buttons); // 쓰기 버튼의 태그값 설정
      }
    } catch (error) {
      console.error('Error fetching Write button data:', error);
    }
  };
  const handleShowDetail=()=>{
    console.log('디테일 부분');
  };
  return (
    <View>
      <AppNameHeader />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.buttonContainer, selectedButton === 'listen'? styles.selectedButton : null]} onPress={handleListenButtonPress}>
          <Button title="듣기" onPress={handleListenButtonPress} color={selectedButton === 'listen' ? '#8caf95' : '#c9c9c9'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer, selectedButton === 'read'? styles.selectedButton : null]} onPress={handleReadButtonPress} >
          <Button title="읽기" onPress={handleReadButtonPress} color={selectedButton === 'read' ? '#8caf95' : '#c9c9c9'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer, selectedButton === 'write' ? styles.selectedButton : null]} onPress={handleWriteButtonPress}>
          <Button title="쓰기" onPress={handleWriteButtonPress} color={selectedButton === 'write' ? '#8caf95' : '#c9c9c9'} />
        </TouchableOpacity>
      </View>
      {showListenButtons && (
        <View style={styles.buttonColumn}>
          {listenButtonTags.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button,styles.buttonMargin]}
              onPress={() => {
                const paddedIndex = (index+1).toString().padStart(3, '0');
                console.log('paddedIndex:', paddedIndex);
                navigation.navigate('TypeQuestLc',{source:'LS_TAG', paddedIndex:paddedIndex, prbSection:prbSection});
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
              style={[styles.button,styles.buttonMargin]}
              onPress={() => {
                const paddedIndex = (index+1).toString().padStart(3, '0');
                console.log('paddedIndex:', paddedIndex);
                navigation.navigate('TypeQuest',{source:'RD_TAG', paddedIndex:paddedIndex, prbSection:prbSection});
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
              style={[styles.button,styles.buttonMargin]}
              onPress={() => {
                const paddedIndex = (index+1).toString().padStart(3, '0');
                console.log('paddedIndex:', paddedIndex);
                navigation.navigate('TypeQuestWr',{source:'WR_TAG', paddedIndex:paddedIndex, prbSection:prbSection});
              }}
            >
            <Text style={styles.columnbutton}>{button.tag} </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text> {my_Level}, {prbSection} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 30,
    //marginRight: 20,
  },
  buttonColumn: {
    flexDirection: 'column',
    marginBottom: 20,
    width: 300,
    //borderRadius: 10,
  },
  buttonContainer:{
    marginRight: 5,
  },
  button:{
    backgroundColor: "#8caf95",
    borderRadius: 5,
    width: 300,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  columnbutton:{
    //borderRadius: 20,
    textAlign: 'left',
    color: '#ffffff',
  },
  buttonMargin: {
    marginTop: 5, // 버튼 간의 간격 조정
  },
  selectedButton:{
    color:'#8caf95'
  },
  
});

export default TypeScreen;
