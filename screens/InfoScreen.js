import React, { useState, useEffect } from 'react';
import { subscribeAuth } from "../lib/auth";
import { View, Text } from 'react-native';
import AppNameHeader from './component/AppNameHeader';
import firestore from '@react-native-firebase/firestore';

const InfoScreen = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [nickname, setNickname] = useState(null); // 닉네임 상태 추가

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
      <AppNameHeader />
      <View>
        <Text>내 정보</Text>
        <Text>{userEmail}</Text>
        <Text>{nickname}</Text> 
        
      </View>
    </View>
  );
}

export default InfoScreen;
