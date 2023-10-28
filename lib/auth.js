import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


// 유저 로그인
export async function signIn({email, password}) {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const {user} = userCredential; //login status save
    
    await AsyncStorage.setItem('user', JSON.stringify(user));
  
    return userCredential;
}

// 유저 회원가입
export async function signUp({email, password}) {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const {user} = userCredential; //signup status save

    await AsyncStorage.setItem('user', JSON.stringify(user));

    return userCredential
}

// 유저 상태정보 감지
export function subscribeAuth(callback) {
    return auth().onAuthStateChanged(callback);
}

// 유저 로그아웃
export async function signOut() {
    await AsyncStorage.removeItem('user');
    
    const logout = await auth().signOut();

    return logout
}

// 유저 정보 업데이트
export async function updateUserPassword(currentPassword, newPassword) {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

    return user.reauthenticateWithCredential(credential).then(() => {
        console.log('인증 성공');
        
        return user.updatePassword(newPassword);
    })
}

// 유저 삭제
// 세션 별도 처리 
export async function deleteAccount(email, password) { 
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(email, password);

    return user.reauthenticateWithCredential(credential).then(() => {
        console.log('인증 성공');
        
        return user.delete();
    })
}

// 유저세션 확인
export async function checkUserSession() { 
    const userString = await AsyncStorage.getItem('user');
    
    return userString ? JSON.parse(userString) : null;
}

// 유저세션 생성 및 수정
export async function createUserSession(user){
    await AsyncStorage.setItem('user', JSON.stringify(user));
}

// 유저세션 삭제
export async function deleteUserSession(){
    await AsyncStorage.removeItem('user');
}
