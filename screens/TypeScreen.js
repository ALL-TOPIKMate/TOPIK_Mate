import React, { useState,useEffect } from 'react';
import { View, Text, Button, StyleSheet,Image } from 'react-native';
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
  //레벨 세팅
  useEffect(() => {
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
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
  
  const handleWriteButtonPress = () => {
    console.log("Write Button press");
    setShowWriteButtons(true);
    setShowListenButtons(false);
    setShowReadButtons(false);
  };

  return (
    <View>
      <AppNameHeader />
      <View style={styles.buttonRow}>
        <Button color="#91aa9e" title="듣기" onPress={handleListenButtonPress} />
        <Button color="#91aa9e" title="읽기" onPress={handleReadButtonPress} />
        <Button color="#91aa9e" title="쓰기" onPress={handleWriteButtonPress} />
      </View>
      {showListenButtons && (
        <View style={styles.buttonColumn}>
          {listenButtonTags.map((button, index) => (
            <Button
              key={index}
              color="#8caf95"
              title={button.tag}
              onPress={() => {
                const paddedIndex = (index+1).toString().padStart(3, '0');
                console.log('paddedIndex:', paddedIndex);
                navigation.navigate('TypeQuestLc',{source:'LS_TAG', paddedIndex:paddedIndex, prbSection:prbSection});
              }}
            />
          ))}
        </View>
      )}

      
      {showReadButtons && (
        <View style={styles.buttonColumn}>
          {readButtonTags.map((button, index) => (
            <Button
              key={index}
              color="#8caf95"
              title={button.tag}
              onPress={() => {
                const paddedIndex = (index+1).toString().padStart(3, '0');
                console.log('paddedIndex:', paddedIndex);
                navigation.navigate('TypeQuest',{source:'RD_TAG', paddedIndex:paddedIndex, prbSection:prbSection});
              }}
            />
          ))}
        </View>
      )}
      {showWriteButtons && (
        <View style={styles.buttonColumn}>
          <Button color="#8caf95" title="쓰기 버튼1" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="쓰기 버튼2" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="쓰기 버튼3" onPress={() => {navigation.navigate('TypeQuest') }} />
        </View>
      )}
      <Text> {my_Level}, {prbSection} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  buttonColumn: {
    flexDirection: 'column',
    marginBottom: 20,
  },
});

export default TypeScreen;
