import React, { useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/storage';
import {subscribeAuth } from "../lib/auth";
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';

// 내정보
const InfoScreen = () => {
  const [userEmail, setUserEmail] = useState(null); // 이메일
  const [nickname, setNickname] = useState(null); // 닉네임
  const [my_level, setmy_level] = useState(null); // 나의 레벨
  const [imageUrl, setImageUrl] = useState(null); // 이미지
  const [defaultImageUrl, setDefaultImageUrl] = useState('URL_OF_DEFAULT_IMAGE');
  const [isModalVisible, setIsModalVisible] = useState(false); //모달창
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'TOPIK 1', value: '1'},
    {label: 'TOPIK 2', value: '2'},
  ]);
  
  //이미지 선택
  const onSelectImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: false,
      },
      async (res) => {
        if (res.assets && res.assets.length > 0) {
          const fileName = `${userEmail}.jpg`;
          const storageRef = firebase.storage().ref(`profile/${fileName}`);
          const response = await fetch(res.assets[0].uri);
          const blob = await response.blob();
          await storageRef.put(blob);
          console.log('Image uploaded successfully:', fileName);
          loadImage()
        } else {
          console.log('No image selected.');
        }
      },
    );
  };
  //닉네임 useEffect
  useEffect(() => {
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
        setUserEmail(user.email);

        // 이메일에 해당하는 닉네임 가져오기
        getNicknameByEmail(user.email);
      }
    };

    const unsubscribe = subscribeAuth(handleAuthStateChanged);

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);
  //레벨 가져오기
  useEffect(() => {
    const handleAuthStateChanged = (user) => {
      if (user) {
        console.log('로그인', user.email);
        //setUserEmail(user.email);

        // 이메일에 해당하는 레벨 가져오기
        getMylevel(user.email);
      }
    };

    const unsubscribe = subscribeAuth(handleAuthStateChanged);

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);
  //이미지 useEffect
  useEffect(() => {
    loadImage();
  }, [userEmail]);
  //이미지 로드
  const loadImage = async () => {
    try {
      const fileName = `${userEmail}.jpg`;
      const storageRef = firebase.storage().ref(`profile/${fileName}`);
      const url = await storageRef.getDownloadURL();
      setImageUrl(url);
    } catch (error) {
      setImageUrl(defaultImageUrl);
    }
  };

//닉네임이랑 이메일 얻어오기
  const getNicknameByEmail = async (email) => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const nickname = userData.nickname;
        setNickname(nickname)
        return nickname;
      }
  
      return null; // 해당 이메일에 대한 사용자가 없을 경우 null 반환
    } catch (error) {
      console.error('Error fetching user data:', error);
      setNickname(null);
      return null; // 에러 발생 시 null 반환
    }
    
  };

  // 나의 레벨 가져오기
  const getMylevel = async (email) => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const my_level = userData.my_level;
        setmy_level(my_level)
        return my_level;
      }
  
      return null; // 해당 이메일에 대한 사용자가 없을 경우 null 반환
    } catch (error) {
      console.error('Error fetching user data:', error);
      setmy_level(null);
      return null; // 에러 발생 시 null 반환
    }
    
  };

  //나의 레벨 파이어베이스 적용하기
  const updateUserLevel = async (email, newLevel) => {
    try {
      const userRef = firestore().collection('users').where('email', '==', email);
      const querySnapshot = await userRef.get();
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await userDoc.ref.update({ my_level: newLevel });
        console.log('my_level 업데이트 완료');
      } else {
        console.log('사용자를 찾을 수 없음');
      }
    } catch (error) {
      console.error('my_level 업데이트 에러:', error);
    }
  };
  // 레벨 선택
  const saveLevelToFirebase = (selectedLevel) => {
    // Firebase에 선택한 레벨 저장하는 로직 구현
    console.log('선택한 레벨:', selectedLevel);
    updateUserLevel(userEmail, selectedLevel);
  };
  
  return (
    <View>
      <View style={styles.circleContainer}>
      <Text>내 정보</Text>
        <Pressable
          style={[
            styles.circle,
            !imageUrl && styles.circleDefaultImage,
            { overflow: 'hidden' },
          ]}
          onPress={onSelectImage}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.circleImage} />
          ) : (
            <View style={styles.circleDefaultImageTextContainer}>
              <Text style={styles.circleDefaultImageText}>+</Text>
            </View>
          )}
        </Pressable>
        
        <Text> 이메일 : {userEmail}</Text>  
      </View>
    
    <Text> 나의 레벨 </Text>
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
      Alert.alert('Modal has been closed.');
      setIsModalVisible(!isModalVisible);
      }}
    >
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>레벨 수정하기</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="레벨을 선택해 주세요"
        listMode="FLATLIST"
        modalProps={{
        animationType: 'fade',
        }}
        modalTitle="레벨 선택"
      />
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => {
          setIsModalVisible(!isModalVisible);
          saveLevelToFirebase(value);
        }}
      >
        <Text style={styles.textStyle}>저장</Text>
      </Pressable>
    </View>
  </View>
</Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setIsModalVisible(true)}>
        <Text style={styles.textStyle}>수정하기</Text>
      </Pressable>
      <Text> {my_level}</Text>  
      
  </View>
 
    
  );
    
  
};
const styles = StyleSheet.create({
  circleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#87CEEB',
  },
  circleDefaultImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#556B2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  circleDefaultImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  circleDefaultImageTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height: 200,
    margin: 20,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: 'absolute',
    right: 10,
    top: 200,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
  buttonOpen: {
    backgroundColor: '#6B8E23',
    width: 60,
    height: 35,
    justifyContent: 'center',
  },
  buttonClose: {
    backgroundColor: '#9ACD32',
    width: 100,
    position: 'absolute',
    top: 150,
    left: 130,
  },

});


export default InfoScreen;
