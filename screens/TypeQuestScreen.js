import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity,Image } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";
import storage from '@react-native-firebase/storage'


//Reading
const TypeQuestScreen = ({navigation, route}) =>{
  const { source, paddedIndex, prbSection } = route.params;//이전 페이지에서 정보 받아오기
  const [data, setData] = useState([]);// 문제 담을 구성
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls,setImageUrls]=useState(null);
  useEffect(() => { //이메일 가져와서 레벨 찾아오는 useEffect
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
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
          .collection(source)//rdtag
          .doc(paddedIndex)//001
          .collection('PRB_LIST')//pbrblist
        const querySnapshot = await problemCollection.orderBy('__name__').limit(5).get();
        
        querySnapshot.forEach(async (doc) => {
          const docData = doc.data();
          const prbIndex = doc.id;
          const value = {
            id: doc.id,
            PRB_MAIN: docData.PRB_MAIN_CONT,
            PRB_TXT: docData.PRB_TXT,
            PRB_CHOICE1: docData.PRB_CHOICE1,
            PRB_CHOICE2: docData.PRB_CHOICE2,
            PRB_CHOICE3: docData.PRB_CHOICE3,
            PRB_CHOICE4: docData.PRB_CHOICE4,
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
  const handleChoice = (choice) => {
    console.log('Selected Choice:', choice);
    // 선택된 버튼에 대한 처리 로직을 추가할 수 있습니다.
  };
  const handleNextProblem = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      const nextProblem = data[currentIndex + 1];
    } else {
      loadProblems();
      setCurrentIndex(-1);
    }
  };
  const handleEndProblem = () => {
    navigation.navigate('Type')
  };
  const handlePreviousProblem =() =>{
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      const prevProblem = data[currentIndex - 1];
    } 
  }
  useEffect(() => {
    const loadImageUrls = async () => {
      const urls = [];
      for (let i = 0; i < data.length; i++) {
        const prbIndex = data[i].id;
        const modifiedPrbIndex = prbIndex + 54;
        try {
          const imageUrl = await imageUrl(modifiedPrbIndex); // 이미지 URL 가져오는 비동기 함수
          urls.push({
            id: prbIndex,
            image: imageUrl,
          });
        } catch (error) {
          console.log(error);
        }
      }
      setImageUrls(urls);
    };
  
    loadImageUrls();
  }, [data]);
  
  
  return (
    <View style={[styles.container, styles.containerPos]}>
      <View style={[styles.container, styles.containerPos]}>
        <Text> {source} , {paddedIndex} </Text>
      
        
        <View>
          {data.length > 0 && (
            <>
            <Text>{currentIndex+1}.{data[currentIndex].PRB_MAIN}</Text>
            {imageUrls.length > 0 && (
             <Image source={{ uri: imageUrls[currentIndex].image }} style={styles.image} />
            )}
            <Text>{data[currentIndex].PRB_TXT} </Text>
            
            <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE1)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE1}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE2)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE2}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE3)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE3}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE4)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE4}</Text>
            </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity style={[styles.buttonprevious]} onPress={handlePreviousProblem}>
              <Text style={styles.buttonTextprevious}>Previous</Text>
            </TouchableOpacity>
          )}
          {currentIndex < data.length - 1 ? (
            <TouchableOpacity style={styles.buttonpass} onPress={handleNextProblem}>
              <Text style={styles.buttonTextpass}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonpass} onPress={handleEndProblem}>
              <Text style={styles.buttonTextpass}>End</Text>
            </TouchableOpacity>
          )}
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10, 
    //justifyContent: 'space-between',
  },
  buttonpass: {
    marginTop: 100,
    alignSelf: 'flex-end',
    backgroundColor: '#A4BAA1',
    padding: 10,
    borderRadius: 5,
  },
  buttonprevious: {
    marginTop: 100,
    alignSelf: 'flex-start',
    backgroundColor: '#A4BAA1',
    padding: 10,
    borderRadius: 5,
  },
  buttonTextpass: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextprevious: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },  
  buttonContainer:{
    flexDirection: 'row',
  }
      
});

export default TypeQuestScreen;