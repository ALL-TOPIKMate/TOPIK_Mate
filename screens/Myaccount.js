import React, { useState, useEffect} from 'react';
import {Text,View, TouchableOpacity, StyleSheet, Modal, Pressable, TextInput, Alert} from 'react-native';
import {subscribeAuth, signOut, updateUserPassword } from "../lib/auth";
import { CommonActions } from '@react-navigation/native'; // CommonActions 추가
const Myaccount = ({navigation}) => {
  const [userEmail, setUserEmail] = useState(null); // 이메일
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); //모달창
  useEffect(() => {
    const handleAuthStateChanged = (user) => {
      if (user) {
        //console.log('로그인', user.email);
        setUserEmail(user.email);
      }
    };

    const unsubscribe = subscribeAuth(handleAuthStateChanged);
    return () => unsubscribe();
    }, []);
    
    const handlePasswordChange = (currentPassword, newPassword) => {
    
      if (currentPassword === newPassword) {
        //setError("새로운 비밀번호는 기존 비밀번호와 다르게 입력해야 합니다.");
        Alert.alert('에러: 새로운 비밀번호는 기존 비밀번호와 다르게 입력해야 합니다.')
        return;
      }
      updateUserPassword(currentPassword, newPassword)
        .then(() => {
          console.log('비밀번호 변경 성공');
          setIsModalVisible(false);
          setCurrentPassword('');
          setNewPassword('');
          // 비밀번호 변경 후 필요한 동작 수행
        })
        .catch((error) => {
          console.log('비밀번호 변경 실패', error);
          //setError(error.message);
          Alert.alert('에러:', error.message)
        });
    };
    
    // 컴포넌트 언마운트 시 구독 해제
    
    const handleLogout = () => {
      signOut()
        .then(() => {
          console.log('로그아웃 성공');
          // 로그아웃 후 필요한 동작 수행
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Signin' }] // 로그인 페이지 이름으로 변경
            })
          );
        })
        .catch((error) => {
          console.log('로그아웃 실패', error);
        });
    };
  
    return (
      <View style={styles.container}>
        <Text>계정 내용</Text>
        <Text> 이메일 : {userEmail}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>로그아웃</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setIsModalVisible(!isModalVisible);
            }}
          >
        
          <View style={styles.modalView}>
            <Text style={styles.modalText}>비밀번호 변경하기 </Text>
            <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="새로운 비밀번호"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                handlePasswordChange(currentPassword, newPassword)
              }}
            >
              <Text style={styles.textStyle}>변경하기</Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.textStyle2}>비밀번호 변경</Text>
        </Pressable>
        </View>
      </View>
    );
};
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    marginTop: 50,
  },
  button: {
    backgroundColor: '#66CC66',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 100,
    height: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText2: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 10,
  },
  modalView: {
    height: 250,
    margin: 20,
    marginTop: 200, // 내리고자 하는 만큼의 값으로 조정
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#9ACD32',
    width: 100,
    position: 'absolute',
    top: 120,
    left: 60,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  textStyle2: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
});
export default Myaccount;