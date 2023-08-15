import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity,TextInput,Image } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";

//Write
const TypeStudyWr = ({navigation, route}) =>{
  
  const { source, paddedIndex, prbSection } = route.params;//이전 페이지에서 정보 받아오기
  const [data, setData] = useState([]);// 문제 담을 구성
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textInputValue, setTextInputValue] = useState('');
  const [imageUrls,setImageUrls]=useState(null);
  useEffect(() => { //이메일 가져와서 레벨 찾아오는 useEffect
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
        // 이메일에 해당하는 레벨 가져오기
        //getMylevel(user.email);
      }
    };
    
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
          .collection(source)//wrtag
          .doc(paddedIndex)//001
          .collection('PRB_LIST')//pbrblist
        const querySnapshot = await problemCollection.orderBy('__name__').limit(5).get();
  
        
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const value = {
            id: doc.id,
            PRB_MAIN: docData.PRB_MAIN_CONT,
            
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
  const handleNextProblem = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      loadProblems();
      setCurrentIndex(-1);
    }
  };
  const handleEndProblem = () => {
    navigation.navigate('Type');
  };
  const handlePreviousProblem =() =>{
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      const prevProblem = data[currentIndex - 1];
    } 
  }
    
  
  return (
    <View style={[styles.container, styles.containerPos]}>
      <View style={[styles.container, styles.containerPos]}>
        <Text> {source} , {paddedIndex} </Text>
      
        {data.length > 0 && (
        <View>
          <Text>{currentIndex+1}.{data[currentIndex].PRB_MAIN}</Text>
          <View style ={styles.textfield}>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              onChangeText={text => setTextInputValue(text)}
              value={textInputValue}
              style={{padding: 10}}
              />
          </View>
        </View>
      )}
      {currentIndex < data.length - 1 ? (
        <TouchableOpacity style={styles.button} onPress={handleNextProblem}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleEndProblem}>
          <Text style={styles.buttonText}>End</Text>
        </TouchableOpacity>
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
    textfield:{
      backgroundColor: '#FFFFFF',
      borderColor: '#000000',
      borderWidth: 1,
      position: 'absolute',
      top: 50,
      left: 0,
      width: 350,
      height: 200,
    },
    button: {
      marginTop: 300,
      alignSelf: 'flex-end',
      backgroundColor: '#A4BAA1',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
      
});

export default TypeStudyWr;