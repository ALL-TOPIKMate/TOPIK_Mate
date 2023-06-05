import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'

//import ProbMain from "./component/ProbMain";
//import AudRef from "./component/AudRef";
//import ProbChoice2 from "./component/ProbChoice2";
//Reading
const TypeQuestScreenLc = ({navigation, route}) =>{
  //const [userLevel, setUserLevel] = useState(null); // 나의 레벨
  //const [prbSection,setPrbSection] = useState(null); //LV 섹션 만들기
  const { source, paddedIndex, prbSection } = route.params;//이전 페이지에서 정보 받아오기
  const [data, setData] = useState([]);// 문제 담을 구성
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choice1ImageUrl, setChoice1ImageUrl] = useState(null)
  const [choice2ImageUrl, setChoice2ImageUrl] = useState(null)
  const [choice3ImageUrl, setChoice3ImageUrl] = useState(null)
  const [choice4ImageUrl, setChoice4ImageUrl] = useState(null)
  useEffect(() => { //이메일 가져와서 레벨 찾아오는 useEffect
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
      }
    };
    
    console.log('여기',prbSection)
    const unsubscribe = subscribeAuth(handleAuthStateChanged);

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);
 
  useEffect(() => {
    // 콜렉션 불러오기
    const loadPrbList = async () => {
      try {
        const prblist = [];
        const problemCollection = firestore()
          .collection('problems')
          .doc(prbSection)//lv2
          .collection(source)//rdtag
          .doc(paddedIndex)//001
          .collection('PRB_LIST')//pbrblist
        const querySnapshot = await problemCollection.orderBy('__name__').limit(5).get();
        //const problems = [];
        
        querySnapshot.forEach(async (doc) => {
          const docData = doc.data();
          const value = {
            id: doc.id,
            PRB_MAIN: docData.PRB_MAIN,
            PRB_CHOICE1: docData.PRB_CHOICE1,
            PRB_CHOICE2: docData.PRB_CHOICE2,
            PRB_CHOICE3: docData.PRB_CHOICE3,
            PRB_CHOICE4: docData.PRB_CHOICE4,
          };
          console.log('문제',value);
          prblist.push(value);
          if(paddedIndex === '001'){
            try {
              const choice1ImageRef = storage()
                .ref()
                .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${doc.id}_1.png`);
              const choice2ImageRef = storage()
                .ref()
                .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${doc.id}_2.png`);
              const choice3ImageRef = storage()
                .ref()
                .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${doc.id}_3.png`);
              const choice4ImageRef = storage()
                .ref()
                .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${doc.id}_4.png`);
        
              const choice1ImageUrl = await choice1ImageRef.getDownloadURL();
              const choice2ImageUrl = await choice2ImageRef.getDownloadURL();
              const choice3ImageUrl = await choice3ImageRef.getDownloadURL();
              const choice4ImageUrl = await choice4ImageRef.getDownloadURL();
        
              setChoice1ImageUrl(choice1ImageUrl);
              setChoice2ImageUrl(choice2ImageUrl);
              setChoice3ImageUrl(choice3ImageUrl);
              setChoice4ImageUrl(choice4ImageUrl);
            } catch (error) {
              console.log('Error occurred while downloading image', error);
            }
          }
          
        });
        setData(prblist);
        setCurrentIndex(0);
      } catch (error) {
        console.log(error);
      }
      
    };
    
    loadPrbList();
  }, [source, paddedIndex]);
  
  useEffect(() => {
    console.log(data);
  }, [data]);
  const handleChoice = (choice) => {
    console.log('Selected Choice:', choice);
    // 선택된 버튼에 대한 처리 로직을 추가할 수 있습니다.
  };
  const handleNextProblem = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      loadProblems();
    }
  };
  const handleEndProblem = () => {
    navigation.navigate('Type')
  };
    
  
  return (
    <View style={[styles.container, styles.containerPos]}>
      <View style={[styles.container, styles.containerPos]}>
        <Text> {source} , {paddedIndex} </Text>
  
        {data.length > 0 && (
          <View>
            <Text>{data[currentIndex].PRB_MAIN}</Text>
            {paddedIndex === '001' && (
              <>
                <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE1)}>
                {(choice1ImageUrl && paddedIndex === '001') && <Image source={{ uri: choice1ImageUrl }} style={styles.choiceImage} />}
                  {(!choice1ImageUrl || paddedIndex !== '001') && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE1}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE2)}>
                {(choice2ImageUrl && paddedIndex === '001') && <Image source={{ uri: choice2ImageUrl }} style={styles.choiceImage} />}
                  {(!choice2ImageUrl || paddedIndex !== '001') && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE2}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE3)}>
                {(choice3ImageUrl && paddedIndex === '001') && <Image source={{ uri: choice3ImageUrl }} style={styles.choiceImage} />}
                  {(!choice3ImageUrl || paddedIndex !== '001') && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE3}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE4)}>
                {(choice4ImageUrl && paddedIndex === '001') && <Image source={{ uri: choice4ImageUrl }} style={styles.choiceImage} />}
                  {(!choice4ImageUrl || paddedIndex !== '001') && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE4}</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        <Button title = "정답 확인" onPress={()=>console.log('확인하기')}> </Button>
        {currentIndex < data.length - 1 ? (
          <Button title="Next" onPress={handleNextProblem} />
        ) : (
          <Button title="End" onPress={handleEndProblem}/>
        )}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
      padding: 10,
    },
    containerPos: {
      flex:20
    },
    choiceImage: {
      width: 100,
      height: 100,
    },
    
  
      
});

export default TypeQuestScreenLc;