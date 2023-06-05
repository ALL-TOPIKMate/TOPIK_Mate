import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";

//import ProbMain from "./component/ProbMain";
//import AudRef from "./component/AudRef";
//import ProbChoice2 from "./component/ProbChoice2";
//Reading
const TypeQuestScreenWr = ({navigation, route}) =>{
  //const [userLevel, setUserLevel] = useState(null); // 나의 레벨
  //const [prbSection,setPrbSection] = useState(null); //LV 섹션 만들기
  const { source, paddedIndex, prbSection } = route.params;//이전 페이지에서 정보 받아오기
  const [data, setData] = useState([]);// 문제 담을 구성
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => { //이메일 가져와서 레벨 찾아오는 useEffect
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
        // 이메일에 해당하는 레벨 가져오기
        //getMylevel(user.email);
      }
    };
    console.log('읽어요',paddedIndex, prbSection)
    //사용자 레벨을 얻어오는 함수
  
    console.log('여기',prbSection)
    //setPrbSection(section);
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
        
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const value = {
            id: doc.id,
            PRB_MAIN: docData.PRB_MAIN,
            
          };
          console.log('문제',value);
          prblist.push(value);
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
          
          
        </View>
      )}
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
  
      
});

export default TypeQuestScreenWr;