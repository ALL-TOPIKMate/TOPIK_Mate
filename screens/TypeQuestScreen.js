import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';
const Box = ({ text }) => {
  return (
    <View style={styles.box}>
      <Text>{text}</Text>
    </View>
  );
};
const TypeQuestScreen = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answer2Color, setAnswer2Color] = useState("#8A2BE2");
  useEffect(() => {
    console.log(answer2Color);
  }, [answer2Color]);
  const handleOptionSelect = (optionNumber) => {
    setSelectedOption(optionNumber);
  }
  const handleSubmit = () => {
    setSubmitted(true);
    console.log(`선택한 보기: ${selectedOption}`);
    if (selectedOption === 2) {
      setAnswer2Color("#0000FF");
      console.log(answer2Color) // 여기서 바뀐거는 확인되는데 화면상 보이지 않음.
    } else {
      setAnswer2Color("#696969");
      console.log(answer2Color) // 여기서 바뀐거는 확인되는데 화면상 보이지 않음.
    }
    
  };
  
  return (
    <View>
      <AppNameHeader />
      <View>
        <Text>문제1. ( )에 들어갈 가장 알맞은 단어를 고르시오.</Text>
      </View>
      <View style={styles.container}>
        <Box text="밖에서 시끄럽게 공사를 (  ) 잠을 잘 수가 없다." />
      </View>
      <View style={styles.buttonContainer}>
      <Button
          title="보기 1"
          color={selectedOption === 1 ? '#F5B7B1' : '#A9DFBF'}
          onPress={() => handleOptionSelect(1)} //disabled={submitted}
        />
        <Button
          title="보기 2"
          color={selectedOption === 2 ? '#F5B7B1' : '#A9DFBF'}
          onPress={() => handleOptionSelect(2)} //disabled={submitted}
        />
        <Button
          title="보기 3"
          color={selectedOption === 3 ? '#F5B7B1' : '#A9DFBF'}
          onPress={() => handleOptionSelect(3)} //disabled={submitted}
        />
        <Button
          title="보기 4"
          color={selectedOption === 4 ? '#F5B7B1' : '#A9DFBF'}
          onPress={() => handleOptionSelect(4)} //disabled={submitted}
        />
      </View>
      <View style={styles.bottomButtonContainer3}>
      <Button title="제출" onPress={handleSubmit}
          disabled={!selectedOption} />
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button title="이전" onPress={() => console.log("이전 선택됨") } />
        <Button title="다음" onPress={() => navigation.navigate('TypeQuestLc')} disabled={!submitted}  />
      </View>
      
    </View>
    
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 330, // 하단에 마진 추가
    },
    box: {
      backgroundColor: '#D4EFDF',
      borderWidth: 1,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      width: 390,
      height: 100,
      margin: 10,
    },
    buttonContainer: {
      position: 'absolute',
      top: 200,
      left: 30,
      width: 350,
      justifyContent: 'flex-start', // 추가
    },
    button: {
      width: 100,
      height: 50,
      backgroundColor:'blue',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    bottomButtonContainer: {
      flexDirection: 'row',
      top: 70,
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      paddingHorizontal: 30,
    },
    bottomButtonContainer3: {
      position: "absolute",
      top: 380,
      left: 150,
      width: 100,
      justifyContent: 'center',
    },
    
});
export default TypeQuestScreen;
