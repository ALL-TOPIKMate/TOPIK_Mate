import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity, Image } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'

//Listening
const TypeQuestScreenLc = ({navigation, route}) =>{
  const { source, paddedIndex, prbSection } = route.params;//이전 페이지에서 정보 받아오기
  const [data, setData] = useState([]);// 문제 담을 구성
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choice1ImageUrl, setChoice1ImageUrl] = useState(null)
  const [choice2ImageUrl, setChoice2ImageUrl] = useState(null)
  const [choice3ImageUrl, setChoice3ImageUrl] = useState(null)
  const [choice4ImageUrl, setChoice4ImageUrl] = useState(null)
  const [submitted, setSubmitted]=useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  //const [buttonColors, setButtonColors]=useState(null);
  useEffect(() => { //이메일 가져와서 레벨 찾아오는 useEffect
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
      }
    };
    
    //console.log('여기',prbSection)
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
          .collection(source)//lctag
          .doc(paddedIndex)//001
          .collection('PRB_LIST')//pbrblist
        const querySnapshot = await problemCollection.orderBy('__name__').limit(5).get();
        //const problems = [];
        
        querySnapshot.forEach(async (doc) => {
          const docData = doc.data();
          const value = {
            id: doc.id,
            PRB_MAIN_CONT: docData.PRB_MAIN_CONT,
            PRB_CHOICE1: docData.PRB_CHOICE1,
            PRB_CHOICE2: docData.PRB_CHOICE2,
            PRB_CHOICE3: docData.PRB_CHOICE3,
            PRB_CHOICE4: docData.PRB_CHOICE4,
            PRB_CORRT_ANSW: docData.PRB_CORRT_ANSW,
          };
          console.log('문제',value);
          prblist.push(value);
          /*
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
         */ 
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
    setSelectedChoice(choice.toString());  
  };

  const handleNextProblem = async () => {
    if (currentIndex < data.length - 1) {
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setCurrentIndex((prevIndex) => prevIndex + 1);
  
      const nextProblem = data[currentIndex + 1];
  
      if (paddedIndex === '001') {
        try {
          const choice1ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${nextProblem.id}_1.png`);
          const choice2ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${nextProblem.id}_2.png`);
          const choice3ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${nextProblem.id}_3.png`);
          const choice4ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${nextProblem.id}_4.png`);
  
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
    } else {
      loadProblems();
    }
  };
  const handleEndProblem = () => {
    navigation.navigate('Type')
  };
  const handlePreviousProblem = async () => {
    if (currentIndex > 0) {
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setCurrentIndex((prevIndex) => prevIndex - 1);

      const prevProblem = data[currentIndex - 1];

      if (paddedIndex === '001') {
        try {
          const choice1ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${prevProblem.id}_1.png`);
          const choice2ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${prevProblem.id}_2.png`);
          const choice3ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${prevProblem.id}_3.png`);
          const choice4ImageRef = storage()
            .ref()
            .child(`images/${prbSection}/LS_TAG/${paddedIndex}/${prevProblem.id}_4.png`);

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
    } else{
      loadProblems();
      setCurrentIndex(-1)
    }

  };
  const handleSubmitProblem = () => {
    console.log('제출 버튼 클릭');
    console.log('선택한 보기:', selectedChoice, '실제 정답:', data[currentIndex].PRB_CORRT_ANSW);
    const isCorrect = selectedChoice.toString() === data[currentIndex].PRB_CORRT_ANSW;
    console.log(isCorrect)
    setSubmitted(true);
  };
  
  return (
    <View style={[styles.container, styles.containerPos]}>
      <View style={[styles.container, styles.containerPos]}>
        <Text> {source} , {paddedIndex} </Text>
  
        {data.length > 0 && (
        <View>
          <Text>{currentIndex+1}.{data[currentIndex].PRB_MAIN_CONT}</Text>
          {paddedIndex === '001' && (
            <>
              <TouchableOpacity style={[styles.button,choice1ImageUrl ? { height: 103,width:150} : null]} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE1)}>
                {choice1ImageUrl && <Image source={{ uri: choice1ImageUrl }} style={styles.choiceImage} />}
                {!choice1ImageUrl && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE1}</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button,choice2ImageUrl ? { height: 103,width:150} : null]} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE2)}>
                {choice2ImageUrl && <Image source={{ uri: choice2ImageUrl }} style={styles.choiceImage} />}
                {!choice2ImageUrl && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE2}</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button,choice3ImageUrl ? { height: 103,width:150}: null ]} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE3)}>
                {choice3ImageUrl && <Image source={{ uri: choice3ImageUrl }} style={styles.choiceImage} />}
                {!choice3ImageUrl && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE3}</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, ,choice3ImageUrl ? { height: 103,width:150}: null]} onPress={() => handleChoice(data[currentIndex].PRB_CHOICE4)}>
                {choice4ImageUrl && <Image source={{ uri: choice4ImageUrl }} style={styles.choiceImage} />}
                {!choice4ImageUrl && <Text style={styles.buttonText}>{data[currentIndex].PRB_CHOICE4}</Text>}
              </TouchableOpacity>
            </>
          )}
          {paddedIndex !== '001' && (
            <>
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
          <View style={styles.buttonSumitContainer}>
            <TouchableOpacity style={[styles.buttonsubmit]} onPress={handleSubmitProblem}>
              <Text style={styles.buttonTextpass}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        )}
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
    //justifyContent: 'space-between',
  },
  containerPos: {
    flex:20
  },
  choiceImage: {
    width: 150,
    height: 100,
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
  fixToText:{
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  
});

export default TypeQuestScreenLc;