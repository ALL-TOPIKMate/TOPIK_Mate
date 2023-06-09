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
  const [submitted, setSubmitted]=useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);

   
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
            PRB_CORRT_ANSW: docData.PRB_CORRT_ANSW,
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
 //선택지 함수
  const handleChoice = (choice) => {
    setSelectedChoice(choice.toString()); 
  };
  //다음 버튼 클릭
  const handleNextProblem = () => {
    if (currentIndex < data.length - 1) {
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setCurrentIndex((prevIndex) => prevIndex + 1);
      //const nextProblem = data[currentIndex + 1];
    } else {
      loadProblems();
      setCurrentIndex(-1);
    }
  };
  //문제 끝날 경우 처리
  const handleEndProblem = () => {
    navigation.navigate('Type')
  };
  //이전 문제
  const handlePreviousProblem =() =>{
    if (currentIndex > 0) {
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setCurrentIndex((prevIndex) => prevIndex - 1);
      //const prevProblem = data[currentIndex - 1];
    } 
  }
  //제출버튼
  const handleSubmitProblem = () => {
    console.log('제출 버튼 클릭');
    console.log('선택한 보기:', selectedChoice, '실제 정답:', data[currentIndex].PRB_CORRT_ANSW);
    const isCorrect = selectedChoice.toString() === data[currentIndex].PRB_CORRT_ANSW;
    console.log(isCorrect)
    setSubmitted(true);
    
  };
//이미지 로드 관련, 에러 있음.
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
            
            <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='1'? selectedChoice=== data[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': data[currentIndex].PRB_CORRT_ANSW === '1'? '#BAD7E9': '#D9D9D9' : selectedChoice === '1'? '#BBD6B8': '#D9D9D9'} ]} onPress={() => handleChoice(1)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE1}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='2'? selectedChoice=== data[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': data[currentIndex].PRB_CORRT_ANSW === '2'? '#BAD7E9': '#D9D9D9' : selectedChoice === '2'? '#BBD6B8': '#D9D9D9'}]} onPress={() => handleChoice(2)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE2}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='3'? selectedChoice=== data[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': data[currentIndex].PRB_CORRT_ANSW === '3'? '#BAD7E9': '#D9D9D9' : selectedChoice === '3'? '#BBD6B8': '#D9D9D9'}]} onPress={() => handleChoice(3)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE3}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='4'? selectedChoice=== data[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': data[currentIndex].PRB_CORRT_ANSW === '4'? '#BAD7E9': '#D9D9D9' : selectedChoice === '4'? '#BBD6B8': '#D9D9D9'}]} onPress={() => handleChoice(4)}>
              <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE4}</Text>
            </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.buttonSumitContainer}>
          <TouchableOpacity style={[styles.buttonsubmit]} onPress={handleSubmitProblem}>
            <Text style={styles.buttonTextpass}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fixToText}>
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
  button: {
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
    borderRadius: 5,
    height: 30,
  },
  buttonText:{
    marginLeft: 10,
    fontSize: 15,
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
    textAlign: 'center',
  },
  buttonTextprevious: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },  
  buttonContainer:{
    flexDirection: 'row',
  },
  buttonsubmit:{
    backgroundColor: '#AFB9AE',
    height: 30,
    width: 80,
    borderRadius: 5,
  },
  buttonSumitContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixToText:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
      
});

export default TypeQuestScreen;