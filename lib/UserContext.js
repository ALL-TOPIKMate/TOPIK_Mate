import firestore from '@react-native-firebase/firestore';
import react from "react"

class User{
	constructor(_uid = undefined, _email = undefined){
		this.uid = _uid
		this.email = _email
		this.level = undefined
		this.nickname = undefined
		this.recCorrect = undefined
		this.recIndex = undefined
	}

    initUser(user){
        this.uid = user.uid
        this.email = user.email
    }

	async initUserInfo(){
        try{
            await this.getUserDoc()
            await this.getUserRecommendDoc()
        }catch(err){
            console.log(`유저 로드 실패!\n${err}`)
        }
	}
	

     // user doc field read
    async getUserDoc(){
        const data = await firestore().collection("users").doc(this.uid).get()

        this.level = data._data.my_level
        this.nickname = data._data.nickname
    }

    // user > recommend > Recommend doc field read
    async getUserRecommendDoc(){
        const data = await firestore().collection("users").doc(this.uid).collection("recommend").doc("Recommend").get()

        this.recCorrect = data._data.userCorrect
        this.recIndex = data._data.userIndex
    }
}


const UserContext = react.createContext(new User())

export default UserContext