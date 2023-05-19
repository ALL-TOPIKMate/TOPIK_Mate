import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/storage';
import {subscribeAuth } from "../lib/auth";
import firestore from '@react-native-firebase/firestore';


const InfoScreen = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [defaultImageUrl, setDefaultImageUrl] = useState('URL_OF_DEFAULT_IMAGE');
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

  useEffect(() => {
    loadImage();
  }, [userEmail]);

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
  
 
  return (
    <View>
      <View style={styles.circleContainer}>
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
      </View>

      <Text>내 정보</Text>
      <Text>{userEmail}</Text>
      <Text>{nickname}</Text>
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
});


export default InfoScreen;
