import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


// 유저 로그인
export async function signIn({email, password}) {
    const userCredential = await  auth().signInWithEmailAndPassword(email, password);
    const {user} = userCredential; //login status save
    
    await AsyncStorage.setItem('user', JSON.stringify(user));
  
    return userCredential;
}

// 유저 회원가입
export function signUp({email, password}) {
    return auth().createUserWithEmailAndPassword(email, password);
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
    }).catch((error) => {
        console.log('인증 실패');
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
        
        //return "현재 비밀번호가 일치하지 않습니다."
    });
}

// 유저 삭제
export async function deleteAccount() { 
    await AsyncStorage.removeItem('user');
    const user = auth().currentUser;
    
    return user.delete();
}

// 유저세션 확인
export async function checkUserSession() { 
    const userString = await AsyncStorage.getItem('user');
    
    return userString ? JSON.parse(userString) : null;
}

