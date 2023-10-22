import react from "react"
import {getUserDoc, getUserRecommendDoc, getUserLevelDoc, setUserWrongColl, setHistoryColl, setLeveltestColl, deleteUserDoc, deleteUserProfile} from "./UserSetting"
import { checkUserSession, deleteUserSession } from "./auth"

class User{
	constructor(_uid = undefined, _email = undefined){
		this.uid = _uid 
		this.email = _email

		this.level = undefined
		this.nickname = undefined

        this.levelIdx = undefined
		this.recCorrect = undefined
		this.recIndex = undefined
	}

    // initialize
    initUser(user){
        this.uid = user.uid
        this.email = user.email
    }

	async getUserInfo(){
        try{
            await getUserDoc(this.uid).then((data) => {
                this.level = data.level
                this.nickname = data.nickname
            })
            await getUserRecommendDoc(this.uid).then((data) => {
                this.recCorrect = data.recCorrect
                this.recIndex = data.recIndex
            })
            await getUserLevelDoc(this.uid).then((data) => {
                this.levelIdx = data.levelIdx
            })
        }catch(err){
            console.log(`유저 로드 실패!\n${err}`)
        }
	}
	
    // create user account
    setUserInfo(_level, _nickname, _levelIdx = 0, _recCorrect = 0, _recIndex = 10){
        this.level = _level
        this.nickname = _nickname
        this.levelIdx = _levelIdx
        this.recCorrect = _recCorrect
        this.recIndex = _recIndex
    }
    

    // update user coll
    updateUserWrongColl(problems, userProblems){
        setUserWrongColl(problems, userProblems, this.uid)
    }

    // add history coll
    updateHistoryColl(problems){
        setHistoryColl(problems, this.uid, this.level)
    }

    // add leveltest history coll
    updateLevelHistoryColl(problems){
        setLeveltestColl(problems, this.uid, this.level)
    }
    
    

    // delete user (탈퇴하기)
    async deleteUser(){
        const user = await checkUserSession()

        deleteUserDoc(user.uid)
        deleteUserProfile(user.email)

        deleteUserSession()
    }
}


const UserContext = react.createContext(new User())

export default UserContext