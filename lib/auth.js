import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function signIn({email, password}) {
  const userCredential = await  auth().signInWithEmailAndPassword(email, password);
  const {user} = userCredential; //login status save
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return userCredential;
}

export function signUp({email, password}) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

export async function signOut() {
  await AsyncStorage.removeItem('user');
  return auth().signOut();
}

export function updateUserPassword(currentPassword, newPassword) {
  const user = auth().currentUser;
  const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

  return user.reauthenticateWithCredential(credential)
    .then(() => {
      console.log('인증 성공');
      return user.updatePassword(newPassword);
    })
    .catch((error) => {
      console.log('인증 실패');
      throw new Error("현재 비밀번호가 일치하지 않습니다.");
      //return "현재 비밀번호가 일치하지 않습니다."
    });
}

export async function deleteAccount() { //유저 삭제
  await AsyncStorage.removeItem('user');
  const user = auth().currentUser;
  
  return user.delete();
}
export async function checkUserSession() { //유저세션 확인
  const userString = await AsyncStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

