import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity,Image, Modal,ScrollView } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth } from "../lib/auth";
import storage from '@react-native-firebase/storage'


//Reading
const TypeQuestScreen = ({navigation, route}) =>{
  const { source, paddedIndex, prbSection } = route.params;//이전 페이지에서 정보 받아오기
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls,setImageUrls]=useState(null);
  const [submitted, setSubmitted]=useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [Last,setLast] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [totalProblem, setTotalProblem] = useState(0);
  const [CorrectProb, setCorrectProb] = useState(0);
 
  // 콜렉션 불러오기
  const loadProblems = async () => {
    //console.log('진입')
    
    try {
      const prblist = [];
      const problemCollection = firestore()
        .collection('problems')
        .doc(prbSection)
        .collection(source)
        .doc(paddedIndex)
        .collection('PRB_LIST');
      //const temp = await problemCollection.where("PRB_ID", ">=", "").orderBy('PRB_ID').get();
      let query = problemCollection.orderBy('__name__').limit(5);
      if(Last){
        query = query.startAfter(Last);
      }
      const temp_snapshot = await query.get();
    
      temp_snapshot.forEach((doc) => {
        const data = doc.data();
        prblist.push(data);
      });
      //console.log(`데이터 불러오기 완료. temp:`, prblist);
      if(prblist.length > 0){
        const lastDoc = temp_snapshot.docs[temp_snapshot.docs.length - 1];
        if (lastDoc) {
          const lastDocId = lastDoc.id;
          setLast(lastDocId);
        }else {
          setLast(null);
        }
        //setProblems(...problems,...prblist);
        setProblems((prevProblems) => [...prevProblems, ...prblist])
        console.log(`problems in loadProblems:`, problems);
        
      } else {
        console.log('No more problems to load.');
        setLast(null);
      }
    } catch (error) {
      console.log(error);
    }
    
  };

  useEffect(() => {
    if (problems.length !== 0) {
      setProblems([]);
      //loadProblems();
    }

    //
  }, [paddedIndex]);
  useEffect(() => {
    if (problems.length === 0) {
      setCurrentIndex(0);
      loadProblems();
    }
  }, [problems]);

  useEffect(()=>{
    //setIsLoading(true);
    console.log('problems.length:', problems.length, currentIndex);
    if(problems.length!==0 && problems.length-1 === currentIndex){
      //console.log('다다랐음');
      loadProblems()
    } else if (problems.length !== 0) {
      //console.log('그냥 진입');
      setSelectedChoice(null);
      setSubmitted(false);
      console.log(currentIndex)
    }
    setIsLoading(false);
  }, [currentIndex])


  // 불러온 문제 확인
  useEffect(()=>{
    
    if (problems.length !== 0) {
      console.log(`problems[0].PRB_ID: ${problems[0].PRB_ID}`);
    }
  }, [problems])

 //선택지 함수
  const handleChoice = (choice) => {
    setSelectedChoice(choice.toString()); 
  };
  //다음 버튼 클릭
  const handleNextProblem = () => {
    if (currentIndex < problems.length - 1) {
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setCurrentIndex((prevIndex) => prevIndex + 1);
      //const nextProblem = data[currentIndex + 1];
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

      const prevProblem = problems[currentIndex - 1];
    } 
  }
  //제출버튼
  const handleSubmitProblem = () => {
    console.log('제출 버튼 클릭');
    console.log('선택한 보기:', selectedChoice, '실제 정답:', problems[currentIndex].PRB_CORRT_ANSW);
    const isCorrect = selectedChoice.toString() === problems[currentIndex].PRB_CORRT_ANSW;
    if(isCorrect){
      setCorrectProb(prevCorrectProb => prevCorrectProb+1)
    }
    setTotalProblem(prevTotalProblem => prevTotalProblem+1)
    console.log(isCorrect,'전체 문제: ', totalProblem, '맞은 문제: ', CorrectProb);
    setSubmitted(true);
    
  };
//이미지 로드 관련, 에러 있음.
  useEffect(() => {
    const loadImageUrls = async () => {
      const urls = [];
      for (let i = 0; i < problems.length; i++) {
        const prbIndex = problems[i].id;
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
  }, [problems]);
  const handlePress = () => {
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };
  
  return (
    <View style={[styles.container, styles.containerPos]}>
      <View style={[styles.container, styles.containerPos]}>
        <ScrollView>
          <Text> {source} , {paddedIndex} </Text>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={handlePress}> 
            <View>
              <Image
                source={require('../assets/out-icon.png')}
                style={styles.outButton}
              />
            </View>
            </TouchableOpacity>
            <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <Text style={styles.typeend}> 유형별 문제 풀이 종료 </Text>
                <View style={styles.circle}>
                  <Text style={styles.score}>{CorrectProb}/{totalProblem}</Text>
                  
                </View>
                <Text style={{fontSize:25,textAlign:'center'}}>{totalProblem}문제 중 {CorrectProb}문제 맞췄습니다.</Text>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                  <Text style={[styles.buttonTextpass]}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          </View>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <View>
              {problems.length > 0 && (
                <>
                <Text style={{padding:10}}>{currentIndex+1}.{problems[currentIndex].PRB_MAIN_CONT}</Text>
                {imageUrls.length > 0 && (
                <Image source={{ uri: imageUrls[currentIndex].image }} style={styles.image} />
                )}
                <Text style={{borderWidth: 1, borderColor: 'black', padding: 10}}>{problems[currentIndex].PRB_TXT} </Text>
                
                <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='1'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '1'? '#BAD7E9': '#D9D9D9' : selectedChoice === '1'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 } ]} onPress={() => handleChoice(1)}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='2'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '2'? '#BAD7E9': '#D9D9D9' : selectedChoice === '2'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 }]} onPress={() => handleChoice(2)}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE2}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='3'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '3'? '#BAD7E9': '#D9D9D9' : selectedChoice === '3'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 }]} onPress={() => handleChoice(3)}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE3}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor: submitted? selectedChoice ==='4'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '4'? '#BAD7E9': '#D9D9D9' : selectedChoice === '4'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 }]} onPress={() => handleChoice(4)}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE4}</Text>
                </TouchableOpacity>
                </>
              )}
            </View>
          )}
            <View style={styles.buttonSumitContainer}>
              <TouchableOpacity style={[styles.buttonsubmit]} onPress={handleSubmitProblem}>
                <Text style={styles.buttonTextpass}>Submit</Text>
              </TouchableOpacity>
            </View>
            
          <View style={styles.fixToText}>
            {currentIndex >= 0 && (
              <TouchableOpacity style={[styles.buttonprevious, currentIndex === 0 && { opacity: 0.5 }]} onPress={handlePreviousProblem} disabled={currentIndex === 0}>
                <Text style={styles.buttonTextprevious}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentIndex < problems.length - 1 ? (
              <TouchableOpacity style={styles.buttonpass} onPress={handleNextProblem}>
                <Text style={styles.buttonTextpass}>Next</Text>
              </TouchableOpacity>
            ) : (
              <View style={{flexDirection:'row'}}> 

                <TouchableOpacity style={styles.buttonpass} onPress={handlePress}>
                  <Text style={styles.buttonTextpass}>End</Text>
                </TouchableOpacity>
                <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.typeend}> 유형별 문제 풀이 종료 </Text>
                      <View style={styles.circle}>
                        <Text style={styles.score}>{CorrectProb}/{totalProblem}</Text>
                        
                      </View>
                      <Text style={{fontSize:25,textAlign:'center'}}>{totalProblem}문제 중 {CorrectProb}문제 맞췄습니다.</Text>
                      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={[styles.buttonTextpass]}>확인</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </View>
        </ScrollView>
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
    textAlignVertical:'center',
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
  },
  outButton:{
    width: 20,
    height: 20,
    right: 10,
  },
  confirmButton:{
    backgroundColor: '#BBD6B8',
    borderRadius: 5,
    top: 50,
    height: 35,
    width: 100,
    alignSelf: 'center',
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: '#BBD6B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeend:{
    fontSize: 30,
    textAlign:'center',
    fontWeight:'bold',
    marginTop: 5,
  },
  score:{
    fontSize: 80,
    color: 'white',
    textAlign:'center',
    fontWeight:'bold',
  }
      
});

export default TypeQuestScreen;