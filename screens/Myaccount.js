import React, { useState, useEffect} from 'react';
import {Text,View, TouchableOpacity, StyleSheet, Modal, Pressable, TextInput, Alert, Button} from 'react-native';
import {subscribeAuth, signOut, updateUserPassword, deleteAccount } from "../lib/auth";
import { CommonActions } from '@react-navigation/native'; // CommonActions 추가
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
const Myaccount = ({navigation}) => {
  const [userEmail, setUserEmail] = useState(null); // 이메일
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); //모달창
  const [currentNickname, setCurrentNickname] = useState('');//기존 닉네임
  const [newNickname, setNewNickname] = useState('');//새로운 닉네임
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  useEffect(() => {
    const handleAuthStateChanged = (user) => {
      if (user) {
        //console.log('로그인', user.email);
        setUserEmail(user.email);
        getNicknameByEmail(user.email);
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
    const handleUpdateNickname = async () => {
      await updateNicknameByEmail(userEmail, newNickname);
      setIsNicknameModalVisible(false);
    };
  //탈퇴기능 추가
  const deleteUser = async (email) => {
    try {
      const userRef = firestore().collection('users');
      const storageRef = storage().ref().child('profile');
      const querySnapshot = await userRef.where('email', '==', email).get();
  
      querySnapshot.forEach(async (documentSnapshot) => {
        const u_uid = documentSnapshot.data().u_uid;
        await userRef.doc(u_uid).delete();
        const imageRef = storageRef.child(`${email}.jpg`);
        await imageRef.delete();
      });
  
      console.log('하위 문서 삭제 완료');
    } catch (error) {
      console.error('문서 삭제 오류:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말로 계정을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          onPress: () => {
            const email = userEmail;
            deleteAccount(email)
              .then(() => {
                console.log('계정 삭제 성공');
                //const userUid = firebase.auth().currentUser.uid;//null 값 가져온다고 뜬다.
                deleteUser(email);
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Signin' }],
                  })
                );
              })
              .catch((error) => {
                console.log('계정 삭제 실패', error);
                Alert.alert('에러:', error.message);
              });
            },
          },
        ],
        { cancelable: false }
      );
    };
    //닉네임 가져오기
    const getNicknameByEmail = async (email) => {
      try {
        const userRef = firestore().collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();
    
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const nickname = documentSnapshot.data().nickname;
          setCurrentNickname(nickname);
          return nickname;
        }
    
        return null; // 이메일에 해당하는 사용자가 없을 경우 null 반환
      } catch (error) {
        console.error('닉네임 가져오기 오류:', error);
        return null;
      }
    };
    //닉네임 적용
    const updateNicknameByEmail = async (email, nickname) => {
      try {
        const userRef = firestore().collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();
  
        querySnapshot.forEach(async (documentSnapshot) => {
          const u_uid = documentSnapshot.data().u_uid;
          await userRef.doc(u_uid).update({ nickname: nickname });
        });
  
        console.log('닉네임 변경 완료');
        setCurrentNickname(newNickname);
        setNewNickname('');
      } catch (error) {
        console.error('닉네임 변경 오류:', error);
      }
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
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>회원 탈퇴</Text>
        </TouchableOpacity>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isNicknameModalVisible}
            onRequestClose={() => setIsNicknameModalVisible(false)}
            
          >
        
          <View style={styles.modalView}>
            <Text style={styles.modalText}> 닉네임 변경 </Text>
            <View style={styles.passwordContainer}>
            <Text>현재 닉네임: {currentNickname}</Text>
            <TextInput
              style={styles.input}
              placeholder="새로운 닉네임"
              value={newNickname}
              onChangeText={setNewNickname}
            />
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                handleUpdateNickname(newNickname)
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
          onPress={() => setIsNicknameModalVisible(true)}>
          <Text style={styles.textStyle2}>닉네임 변경</Text>
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