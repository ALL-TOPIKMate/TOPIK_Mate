import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
const Box = ({ text }) => {
  return (
    <View style={styles.box}>
      <Text>{text}</Text>
    </View>
  );
};
const TypeQuestScreen = ({ navigation }) => {
  const [buttonText, setButtonText] = React.useState('제출');

  const handleButtonPress = () => {
    if (buttonText === '제출') {
      setButtonText('다음');
    } else {
      // '다음' 버튼을 눌렀을 때 처리할 로직 추가
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
        <Button title="보기 1" color='#A9DFBF'onPress={() => console.log('보기 1 선택됨')} />
        <Button title="보기 2" color='#A9DFBF'onPress={() => console.log('보기 2 선택됨')} />
        <Button title="보기 3" color='#A9DFBF'onPress={() => console.log('보기 3 선택됨')} />
        <Button title="보기 4" color='#A9DFBF'onPress={() => console.log('보기 4 선택됨')} />
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button title="이전" onPress={() => console.log("이전 선택됨")} />
      </View>
      <View style={styles.bottomButtonContainer2}>
        <Button title={buttonText} onPress={handleButtonPress} />
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
      width: 350
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
      position: "absolute",
      top: 450,
      left: 20,
      right: 20,
      width: 100
    },
    bottomButtonContainer2: {
      position: "absolute",
      top: 450,
      left: 300,
      right: 20,
      width: 100
    },
    
});
export default TypeQuestScreen;
