import react from "react"

import {getUserDoc, getUserRecommendDoc, setUserWrongColl} from "./UserSetting"


class User{
	constructor(_uid = undefined, _email = undefined){
		this.uid = _uid
		this.email = _email
		this.level = undefined
		this.nickname = undefined
		this.recCorrect = undefined
		this.recIndex = undefined
	}

    // initialize
    initUser(user){
        this.uid = user.uid
        this.email = user.email
    }

	async initUserInfo(){
        try{
            await getUserDoc(this.uid).then((data) => {
                this.level = data.level
                this.nickname = data.nickname
            })
            await getUserRecommendDoc(this.uid).then((data) => {
                this.recCorrect = data.recCorrect
                this.recIndex = data.recIndex
            })
        }catch(err){
            console.log(`유저 로드 실패!\n${err}`)
        }
	}
	

    // update user coll
    updateUserWrongColl(problems, userProblems){
        setUserWrongColl(problems, userProblems, this.uid)
    }
    
}


const UserContext = react.createContext(new User())

export default UserContext