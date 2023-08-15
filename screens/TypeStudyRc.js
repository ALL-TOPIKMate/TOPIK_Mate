import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity,Image, Modal,ScrollView } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
import {subscribeAuth,getCurrentUserEmail } from "../lib/auth";
import storage from '@react-native-firebase/storage'


//Reading
const TypeStudyRc = ({navigation, route}) =>{
  const { source, paddedIndex, prbSection, userEmail } = route.params;//이전 페이지에서 정보 받아오기
  const [problems, setProblems] = useState([]); //문제 데이터 적재
  const [currentIndex, setCurrentIndex] = useState(0); //현재 문제 번호
  const [imageUrls,setImageUrls]=useState(null); //이미지 링크 적재
  const [submitted, setSubmitted]=useState(false); //제출여부 
  const [selectedChoice, setSelectedChoice] = useState(null); //선택한 보기
  const [modalVisible, setModalVisible] = useState(false); //결과화면 모달
  const [Last,setLast] = useState(null) //문제 기준 잡기
  const [isLoading, setIsLoading] = useState(true); //로딩창
  const [totalProblem, setTotalProblem] = useState(0); // 전체 문제 갯수
  const [CorrectProb, setCorrectProb] = useState(0); // 맞은 문제 갯수
  const [prbchoice, setPrbChoice] = useState([]); //문제 풀 때 선택한 정보 저장
  const [prbstatus, setprbstatus]=useState(true); //문제 끝
  //const [useremail, setuseremail]= useState(null)
  
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
      if(temp_snapshot.empty){
        setprbstatus(false);
      }
      //console.log('확인', temp_snapshot.empty);
      //console.log(`데이터 불러오기 완료. temp:`, prblist);
      if(prblist.length > 0 &&prbstatus == true){
        const lastDoc = temp_snapshot.docs[temp_snapshot.docs.length - 1];
        console.log('문제 끝: ', lastDoc.id);
        if (lastDoc) {
          const lastDocId = lastDoc.id;
          setLast(lastDocId);
        }else {
          setLast(null);
        }

        //setProblems(...problems,...prblist);
        //setProblems((prevProblems) => [...prevProblems, ...prblist])
        setProblems((prevProblems) => {//이미지 로드
          const newProblems = [...prevProblems, ...prblist];
          console.log('problems in loadProblems:', newProblems);
          if (newProblems.length === prblist.length) {
            // 첫 데이터 로딩 후 이미지 로딩 처리
            console.log('데이터 적립완료');
            //console.log(newProblems)
            ImageLoading(newProblems);
          }
          return newProblems;
        });
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
    //console.log('email get', userEmail);
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
    //console.log('길이 확인', problems.length-1 === currentIndex);
    if(problems.length!==0 && problems.length-1 === currentIndex){
      //console.log('다다랐음');
      loadProblems()
      ImageLoading(problems);
    } else if (problems.length !== 0) {
      //console.log('그냥 진입');
      //setSelectedChoice(null);
      //setSubmitted(false);
      ImageLoading(problems);
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

  const ImageLoading = async (problems_new)=>{
    console.log('이미지 로드 시작');
    //console.log('문제 아이디', problems_new);
    const nextProblem = problems_new[currentIndex].PRB_ID;
    const nextProbslice = nextProblem.slice(0,9)
    //console.log(`문제 경로: images/${nextProbslice}/${problems_new.find(problem_new => problem_new.PRB_ID === nextProblem).IMG_REF}`)
    const problem = problems_new.find(problem_new => problem_new.PRB_ID === nextProblem);
    if (problem && problem.IMG_REF !== "") {
      const ImageRef = storage()
        .ref()
        .child(`images/${nextProbslice}/${problem.IMG_REF}`);

      try {
        const imageUrl = await ImageRef.getDownloadURL();
        setImageUrls(imageUrl);
        console.log(imageUrl);
      } catch (error) {
        console.log('Error occurred while downloading image', error);
      }
    }
    
  }
  //다음 버튼 클릭
  const handleNextProblem = () => {
    if (currentIndex < problems.length - 1) {
      
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setImageUrls(null);
      console.log('현재 문제 번호', currentIndex+1)
      //console.log('같은지 확인중', problems[currentIndex+1].PRB_ID,prbchoice.find(item => item.Prb_num === problems[currentIndex+1].PRB_ID).Prb_num)
      const check =  prbchoice.find(item => item.Prb_num === problems[currentIndex+1].PRB_ID);
      if ( check && problems[currentIndex+1].PRB_ID === check.Prb_num) {
        console.log('같습니다.', currentIndex+1)
        setSubmitted(true); 
        setSelectedChoice(prbchoice.find(item => item.Prb_num === problems[currentIndex+1].PRB_ID).User_answer);
      }
    } 
  };

  //이전 문제
  const handlePreviousProblem =() =>{
    if (currentIndex > 0) {
      setSelectedChoice(null); // 선택한 답변 초기화
      setSubmitted(false); // 제출 여부 초기화
      setImageUrls(null);
      setCurrentIndex((prevIndex) => prevIndex - 1);

      //const prevProblem = problems[currentIndex - 1];
      const check =  prbchoice.find(item => item.Prb_num === problems[currentIndex-1].PRB_ID)?.Prb_num
      console.log('뒤로 가기 확인',  problems[currentIndex-1].PRB_ID, check);
      if ( problems[currentIndex-1].PRB_ID === check) {
        console.log('뒤로 같습니다.', currentIndex-1)
        setSubmitted(true); 
        setSelectedChoice(prbchoice.find(item => item.Prb_num === problems[currentIndex-1].PRB_ID)?.User_answer);
      }
    } 
  }
  //제출버튼
  const handleSubmitProblem = async () => {
    console.log('제출 버튼 클릭');
    console.log('선택한 보기:', selectedChoice, '실제 정답:', problems[currentIndex].PRB_CORRT_ANSW);
    const isCorrect = selectedChoice === problems[currentIndex].PRB_CORRT_ANSW;
    const nowProb = {
      Prb_num: problems[currentIndex].PRB_ID, //제출 버튼 누르면 번호와
      User_answer: selectedChoice.toString() //사용자가 선택한 답을 넣어서
    };
    prbchoice.push(nowProb);   //딕셔너리로 넣어주자
    console.log('선택지 상태: ', prbchoice);
    if (isCorrect) { //맞춘 갯수 저장
      setCorrectProb(prevCorrectProb => prevCorrectProb + 1);
    } else if (!isCorrect) { //틀린 경우에 오답노트로 전달, 여기 만들어야 함.
      console.log('틀렸음', problems[0]);
      try {
        const querySnapshot = await firestore()
          .collection('users')
          .where('email', '==', userEmail)
          .get();
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const userId = userData.u_uid;
          console.log(userId);
          let collectionPath = '';
  
          if (prbSection == 'LV1') {
            collectionPath = `wrong_lv1/${source}/PRB_TAG/${paddedIndex}`;
          } else {
            collectionPath = `wrong_lv2/${source}/PRB_TAG/${paddedIndex}`;
          }
  
          console.log('경로확인', collectionPath);
          //const collectionPath = `${source}/PRB_TAG/${paddedIndex}/PRB_LIST`;
          const problemId = problems[currentIndex].PRB_ID;
  
          const querySnapshot2 = await firestore()
            .collection(collectionPath)
            .where('PRB_ID', '==', problemId)
            .get();
  
          if (querySnapshot2.empty) {
            const docId = problems[currentIndex].PRB_ID;
            console.log(problems[currentIndex]);
            const docData = {
              AUD_REF: problems[currentIndex].AUD_REF,
              IMG_REF: problems[currentIndex].IMG_REF,
              PRB_CHOICE1: problems[currentIndex].PRB_CHOICE1,
              PRB_CHOICE2: problems[currentIndex].PRB_CHOICE2,
              PRB_CHOICE3: problems[currentIndex].PRB_CHOICE3,
              PRB_CHOICE4: problems[currentIndex].PRB_CHOICE4,
              PRB_CORRT_ANSW: problems[currentIndex].PRB_CORRT_ANSW,
              PRB_ID: problems[currentIndex].PRB_ID,
              PRB_MAIN_CONT: problems[currentIndex].PRB_MAIN_CONT,
              PRB_NUM: problems[currentIndex].PRB_NUM,
              PRB_POINT: problems[currentIndex].PRB_POINT,
              PRB_RSC: problems[currentIndex].PRB_RSC,
              PRB_SCRPT: problems[currentIndex].PRB_SCRPT,
              PRB_SECT: problems[currentIndex].PRB_SECT,
              PRB_SUB_CONT: problems[currentIndex].PRB_SUB_CONT,
              PRB_TXT: problems[currentIndex].PRB_TXT,
              TAG: problems[currentIndex].TAG,
              USER_CHOICE: prbchoice.find(item => item.Prb_num === problems[currentIndex].PRB_ID)?.User_answer,
              듣기대본: problems[currentIndex].듣기대본,
              연속문제: problems[currentIndex].연속문제,
            };
            console.log(`최종 확인 users/${userId}/${collectionPath}/PRB_LIST/${docId}`)
            await firestore().doc(`users/${userId}/${collectionPath}/PRB_LIST/${docId}`).set(docData); //기존 문제 로드
            await firestore().doc(`users/${userId}/${collectionPath}`).set({ PRB_LIST_COUNT: 1 }); //문제 수 카운트
            console.log('새로운 문서 생성 완료');
          } else {
            console.log('이미 같은 PRB_ID를 가진 문서가 존재합니다.');
          }
        } else {
          console.log('일치하는 이메일을 가진 사용자가 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('문서 생성 에러:', error);
      }
    }
    setTotalProblem(prevTotalProblem => prevTotalProblem + 1); // 전체 문제 갯수 저장
    console.log(isCorrect, '전체 문제: ', totalProblem, '맞은 문제: ', CorrectProb);
    setSubmitted(true);
  };
  
  const handlePress = () => { // 모달창 보이기
    setModalVisible(true);
  };

  const handleConfirm = () => { //모달창 확인
    setModalVisible(false);
    navigation.navigate('Home');
  };
  
  return (
    <View style={[styles.container, styles.containerPos]}>
      <View style={[styles.container, styles.containerPos]}>
        <ScrollView>
          <Text> {source} , {paddedIndex} , {currentIndex}</Text>
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
                <Text style={{ padding: 10 }}>{currentIndex + 1}.{problems[currentIndex].PRB_MAIN_CONT}</Text>
                {imageUrls && imageUrls.length > 0 && imageUrls[currentIndex] ? (
                  <View style={{flex: 1}}>
                    <Image source={{ uri: imageUrls }} style={styles.image} /> 
                  </View>
                ) : (
                  <Text style={{ borderWidth: 1, borderColor: 'black', padding: 10 }}>
                    {problems[currentIndex].PRB_TXT}
                  </Text>
                )}

                
                <TouchableOpacity style={[styles.button,styles.buttonContainer,{backgroundColor: submitted? selectedChoice ==='1'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '1'? '#BAD7E9': '#D9D9D9' : selectedChoice === '1'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 } ]} onPress={() => handleChoice(1)} disabled={submitted}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,styles.buttonContainer,{backgroundColor: submitted? selectedChoice ==='2'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '2'? '#BAD7E9': '#D9D9D9' : selectedChoice === '2'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 }]} onPress={() => handleChoice(2)} disabled={submitted}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE2}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,styles.buttonContainer,{backgroundColor: submitted? selectedChoice ==='3'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '3'? '#BAD7E9': '#D9D9D9' : selectedChoice === '3'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 }]} onPress={() => handleChoice(3)} disabled={submitted}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE3}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,styles.buttonContainer,{backgroundColor: submitted? selectedChoice ==='4'? selectedChoice=== problems[currentIndex].PRB_CORRT_ANSW? '#BAD7E9':'#FFACAC': problems[currentIndex].PRB_CORRT_ANSW === '4'? '#BAD7E9': '#D9D9D9' : selectedChoice === '4'? '#BBD6B8': '#D9D9D9'}, { marginTop: 10 }]} onPress={() => handleChoice(4)} disabled={submitted}>
                  <Text style={styles.buttonText}>{problems[currentIndex].PRB_CHOICE4}</Text>
                </TouchableOpacity>
                </>
              )}
            </View>
          )}
            <View style={styles.buttonSumitContainer}>
              <TouchableOpacity style={[styles.buttonsubmit, { opacity: (selectedChoice !== null && !submitted) ? 1 : 0.5 }]} onPress={handleSubmitProblem} disabled={selectedChoice === null || submitted === true}>
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
              <TouchableOpacity style={[styles.buttonpass, { opacity: submitted !== false ? 1 : 0.5 }]} onPress={handleNextProblem} disabled={submitted === false}>
                <Text style={styles.buttonTextpass}>Next</Text>
              </TouchableOpacity>
            ) : (
              <View style={{flexDirection:'row'}}> 

                <TouchableOpacity style={[styles.buttonpass,  { opacity: submitted !== false ? 1 : 0.5 }]} onPress={handlePress} disabled={submitted === false}>
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
    justifyContent: 'center',
    alignItems: 'center',
    //flex: 1,
  },
  button: {
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
    borderRadius: 5,
    //height: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText:{
    marginLeft: 10,
    fontSize: 15,
    //flex: 1,
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
  },
  image:{
    width: 350,
    height: 200,
    alignItems: 'center',
    resizeMode: 'contain'
  }
      
});

export default TypeStudyRc;