import auth from "@react-native-firebase/auth";

export function signIn({email, password}) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function signUp({email, password}) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

export function signOut() {
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

export function deleteAccount() { //유저 삭제
  const user = auth().currentUser;

  return user.delete();
}

