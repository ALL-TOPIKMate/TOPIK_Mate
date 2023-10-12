import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, Pressable, TextInput, Alert, Button } from 'react-native';
import { subscribeAuth, signOut, updateUserPassword, deleteAccount } from "../lib/auth";
import { CommonActions } from '@react-navigation/native'; // CommonActions 추가
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import UserContext from '../lib/UserContext';

// error list 
const resultMessages = {
	"auth/invalid-email": "존재하지 않는 계정입니다",
	"auth/wrong-password": "패스워드가 일치하지 않습니다",
	"auth/weak-password": "패스워드가 약합니다. 6문자 이상 입력하세요"
}


const checkNickname = (nickname) => {
    // 글자 수 제한: 1자 ~ 32자 
    // 공백 제한

    return nickname.length >=1 && nickname.length<=32 && !nickname.includes(" ")
}


const checkPassword = (password) => {
    // 글자 수 제한: 1자 ~

    return password.length > 5 && !password.includes(" ")
}

const Myaccount = ({ navigation }) => {

	const USER = useContext(UserContext);


	// 패스워드
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	// 탈퇴 - 사용자인증
	const [email, setEmail] = useState(USER.email)
	const [password, setPassword] = useState('')

	// 닉네임
	const [currentNickname, setCurrentNickname] = useState(USER.nickname); 
	const [newNickname, setNewNickname] = useState('');
	

	// 모달창
	const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
	const [isResignModalVisible, setIsResignModalVisible] = useState(false);
	const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);



	useEffect(() => {
		if(!isPasswordModalVisible){
			setCurrentPassword("")
			setNewPassword("")
		}if(!isResignModalVisible){
			setPassword("")
		}if(!isNicknameModalVisible){
			setNewNickname("")
		}
	}, [isPasswordModalVisible, isResignModalVisible, isNicknameModalVisible])


	// 로그아웃 
	const handleLogout = () => {
		signOut()
			.then(() => {
				console.log('로그아웃 성공');
				// 로그아웃 후 필요한 동작 수행
				navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: 'AuthStack' }] // 로그인 페이지 이름으로 변경
					})
				);
			})
			.catch((error) => {
				console.log('로그아웃 실패', error);
			}
		);
	};

	

	// 패스워드 변경
	const handlePasswordChange = (currentPassword, newPassword) => {

		if(!checkPassword(currentPassword) || !checkPassword(newPassword)){
			Alert.alert('에러','6문자 이상 입력하세요')
			return;
		}
		else if (currentPassword === newPassword) {
			//setError("새로운 비밀번호는 기존 비밀번호와 다르게 입력해야 합니다.");
			Alert.alert('에러','새로운 비밀번호는 기존 비밀번호와 다르게 입력해야 합니다.')
			return;
		}
		updateUserPassword(currentPassword, newPassword)
			.then(() => {
				console.log('비밀번호 변경 성공');
				Alert.alert('비밀번호 변경 성공');

				setIsPasswordModalVisible(false);
			})
			.catch((error) => {
				console.log('비밀번호 변경 실패', error);
				//setError(error.message);
				Alert.alert('에러:', resultMessages[error.code])
			});
	};


	// 회원 탈퇴
	const handleDeleteAccount = () => {
		if(!checkPassword(password)){
			Alert.alert('에러','패스워드 6문자 이상 입력하세요');
			return 
		}
		
		// 계정 탈퇴
		deleteAccount(email, password)
		.then(() => {
			console.log('계정 삭제 성공');

			/* 
				asyncStorage로 uid 유저 하위문서 정리
			*/
			
			USER.deleteUser()


			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: 'AuthStack' }],
				})
			);
		})
		.catch((error) => {
			console.log('계정 삭제 실패', error.message);
			
			Alert.alert('에러:', resultMessages[error.code]);
		});
	};



	// 닉네임 변경
	const handleUpdateNickname = async () => {
		const userEmail = USER.email
		await updateNicknameByEmail(userEmail, newNickname);
	};



	
	// 닉네임 적용
	const updateNicknameByEmail = async (email, nickname) => {
		try {
			if(!checkNickname(nickname)){
				Alert.alert('에러','공백을 제외한 문자를 입력하세요');
				return 
			}
			const userRef = firestore().collection('users');
			const querySnapshot = await userRef.where('email', '==', email).get();

			querySnapshot.forEach(async (documentSnapshot) => {
				const u_uid = documentSnapshot.data().u_uid;
				await userRef.doc(u_uid).update({ nickname: nickname });
			});

			console.log('닉네임 변경 완료');
			setIsNicknameModalVisible(false);
			setCurrentNickname(newNickname);

			USER.nickname = newNickname
		} catch (error) {
			console.error('닉네임 변경 오류:', error);
		}
	};

	return (
		<View style={styles.container}>

			<Text>계정 내용</Text>
			<Text> 이메일 : {USER.email}</Text>
			
			<View style={styles.buttonContainer}>

				{/* logout */}
				<TouchableOpacity
					style={styles.button}
					onPress={handleLogout}
				>
					<Text style={styles.buttonText}>로그아웃</Text>
				</TouchableOpacity>


				{/* change password */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={isPasswordModalVisible}
					onRequestClose={() => {
						// Alert.alert('Modal has been closed.');
						setIsPasswordModalVisible(!isPasswordModalVisible);
					}}
				>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>비밀번호 변경하기 </Text>
						<View>
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
							</Pressable>
						</View>
					</View>
				</Modal>
				<Pressable
					style={[styles.button, styles.buttonOpen]}
					onPress={() => setIsPasswordModalVisible(true)}>
					<Text style={styles.textStyle2}>비밀번호 변경</Text>
				</Pressable>


				{ /* 회원 탈퇴 */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={isResignModalVisible}
					onRequestClose={() => setIsResignModalVisible(false)}
				>
					<View style={styles.modalView}>
						<Text style={styles.modalText}> 사용자 인증 </Text>
						<View>
							<TextInput
								style={styles.input}
								placeholder="email"
								value={email}
								editable = {false}
							/>
							<TextInput
								style={styles.input}
								placeholder="password"
								value={password}
								secureTextEntry
								onChangeText={setPassword}
							/>

							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									handleDeleteAccount()
								}}
							>
								<Text style={styles.textStyle}>탈퇴하기</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
				<TouchableOpacity style={styles.button} onPress={() => setIsResignModalVisible(true)}>
					<Text style={styles.buttonText}>회원 탈퇴</Text>
				</TouchableOpacity>


				{/* 닉네임 변경 */ }
				<Modal
					animationType="slide"
					transparent={true}
					visible={isNicknameModalVisible}
					onRequestClose={() => setIsNicknameModalVisible(false)}

				>
					<View style={styles.modalView}>
						<Text style={styles.modalText}> 닉네임 변경 </Text>
						<View>
							<TextInput
								style={styles.input}
								placeholder="현재 닉네임"
								value={"현재 닉네임: "+ currentNickname}
								editable = {false}
							/>
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