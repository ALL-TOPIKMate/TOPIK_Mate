import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import react from "react"

// import 유틸
import { getNow, getScoring } from './utils';


// USER DOC 
export async function getUserDoc(uid) {
	const data = await firestore().collection("users").doc(uid).get()

	const user = {
		level: data._data.my_level,
		nickname: data._data.nickname,
	}


	return user
}


// USER's RECOMMEND DOC
export async function getUserRecommendDoc(uid) {
	const data = await firestore().collection("users").doc(uid).collection("recommend").doc("Recommend").get()

	const user = {
		recCorrect: data._data.userCorrect,
		recIndex: data._data.userIndex
	}


	return user
}


// USER's LEVELTEST DOC
export async function getUserLevelDoc(uid){
	const data = await firestore().collection("users").doc(uid).collection("leveltest").doc("Leveltest").get()

	const user = {
		levelIdx: data._data.userIndex,
		levelTag: data._data.userLvtag
	}

	return user
}




// update user's wrong problems 
export function setUserWrongColl(problems, userProblems, uid) {
	try {
		const wrongColl_lv1 = firestore().collection("users").doc(uid).collection("wrong_lv1")
		const wrongColl_lv2 = firestore().collection("users").doc(uid).collection("wrong_lv2")


		problems.forEach((problem, index) => {

			// 해당 문제의 토픽 레벨을 찾음
			const PRB_TOPIK_LEVEL = problem.PRB_ID[2] // ex) LV20041001

			const wrongColl = PRB_TOPIK_LEVEL == 1 ? wrongColl_lv1 : wrongColl_lv2

			// console.log(problem.PRB_ID)
			// console.log(PRB_TOPIK_LEVEL)
			// 답을 맞췄을 경우
			if (problem.PRB_SECT !== "WR" && problem.PRB_CORRT_ANSW == userProblems[index].PRB_USER_ANSW) {

				deleteToWrongColl(problem, wrongColl)

			} else { // 답을 틀렸을 경우 or 못풀었을 경우(모의고사) or 서답형일 경우우 

				addToWrongColl(problem, wrongColl, userProblems[index])

			}
		})

	} catch (err) {
		console.log(err)
	}

}



// 복습하기 콜렉션에서 유저가 맞춘 문제를 제거
async function deleteToWrongColl( problem, wrongColl ){
	console.log("정답! 문서 삭제")
	try{
		const sectTagDoc = wrongColl.doc(`${problem.PRB_SECT}_TAG`); sectTagDoc.set({})

		const tagDoc = sectTagDoc.collection("PRB_TAG").doc(problem.TAG); tagDoc.set({})
		
		// delete document
		tagDoc.collection("PRB_LIST").doc(problem.PRB_ID).delete().then(()=>{
			console.log(`${problem.PRB_ID} 문서 삭제 완료`)
		})



		// 해당 유형에 더이상 문제가 존재하지 않을경우 TAG document(001) 삭제
		tagDoc.collection("PRB_LIST").limit(1).get().then((doc) => {
			// console.log(doc.size)
			if(!doc.size){
				tagDoc.delete().then(()=>{
					console.log(`유형 ${problem.TAG} - 빈 문서 삭제 완료`)
				})
			}
		})
	}catch(err){
		console.log("오답노트 삭제 에러!" + err)
	}

}


// 복습하기 콜렉션에서 유저가 틀린문제를 추가
async function addToWrongColl( problem, wrongColl, userProblem ) {
	console.log("오답! 문서 추가")
	try {
		// 듣기, 읽기 영역일 경우
		if (problem.PRB_SECT == "LS" || problem.PRB_SECT == "RD") {

			const sectTagDoc = wrongColl.doc(`${problem.PRB_SECT}_TAG`); sectTagDoc.set({})

			const tagDoc = sectTagDoc.collection("PRB_TAG").doc(problem.TAG); tagDoc.set({})

			tagDoc.collection("PRB_LIST").doc(problem.PRB_ID).set(problem).then(()=>{
				console.log(`${problem.PRB_ID} 문서 추가 완료`)
			})


		} else if (problem.PRB_SECT == "WR") { // 쓰기 영역일 경우

			const date = getNow()
			
			const tagDoc = wrongColl.doc('WR_TAG').collection('PRB_TAG')
			                        .doc(problem.TAG); tagDoc.set({});
			        
			const prbRscList = tagDoc.collection('PRB_RSC_LIST');

			const prbDoc = prbRscList.doc(problem.PRB_ID);
			prbDoc.set({
				PRB_RSC: problem.PRB_RSC
			});



			// 사용자가 풀지 않은 문제 필드(PRB_USER_ANSW, PRB_USER_ANSW2) 강제 생성
			settingUserField(userProblem)


			// 채점되기 전에 화면에서 나갔을 경우 재채점 수행
			if(userProblem.SCORE == undefined){
				console.log("다시 채점합니다")
				userProblem = await getScoring(userProblem)
				console.log(userProblem)
			}
			
		
			// 현재 날짜/시간으로 도큐먼트 ID 지정
			// 문서에 SCORE와 PRB_USER_ANSW / PRB_USER_ANSW2 가 포함
			prbDoc.collection('PRB_LIST').doc(date).set(userProblem).then(()=>{
				console.log(`${problem.PRB_ID} 문서 추가 완료`)
			})

		} else {
			console.log("영역을 찾을 수 없습니다! err")
		}

	} catch (err) {
		console.log("오답노트 추가 에러!" + err)
	}

}


function settingUserField( problem ){
	// 사용자가 답안을 지정하지 않은 경우 undefined 대신 다른 값으로 지정 (firebase에서 undefiend datatype을 제공하지 않아 에러)
	
	if(problem.TAG == "001" || problem.TAG == "002"){
		problem.PRB_USER_ANSW2 = problem.PRB_USER_ANSW2 || ""
	}
	
	problem.PRB_USER_ANSW = problem.PRB_USER_ANSW || ""

}


// add history collection
export function setHistoryColl(problems, user_id, user_level){

	const historyColl = firestore().collection("historys")

	console.log(problems)
	for(let i=0; i<problems.length; i++){
		const DATA = {
			ELAPSED_TIME: problems[i].ELAPSED_TIME,
			PRB_CORRT_ANSW: problems[i].PRB_CORRT_ANSW,
			PRB_ID: problems[i].PRB_ID,
			PRB_USER_ANSW: problems[i].PRB_USER_ANSW,
			TAG: problems[i].TAG,
			USER_ID: user_id,
			USER_LEVEL: user_level
		}

		historyColl.add(DATA)
	}
	
}


// add leveltest history collection
export function setLeveltestColl(problems, user_id, user_level){

	const historyColl = firestore().collection("users").doc(user_id).collection("leveltest")

	console.log(problems)
	for(let i=0; i<problems.length; i++){
		const DATA = {
			ELAPSED_TIME: problems[i].ELAPSED_TIME,
			PRB_CORRT_ANSW: problems[i].PRB_CORRT_ANSW,
			PRB_ID: problems[i].PRB_ID,
			PRB_USER_ANSW: problems[i].PRB_USER_ANSW,
			TAG: problems[i].TAG,
			USER_ID: user_id,
			USER_LEVEL: user_level
		}

		historyColl.add(DATA)
	}
	
}


// 유저 탈퇴 - 유저 도큐먼트의 하위 문서 정리
export async function deleteUserDoc(uid){
	try {
		const userDoc = firestore().collection("users").doc(uid)
		
		/*
			wrong_lv1 > LS_TAG > PRB_TAG > 001 > PRB_LIST
			wrong_lv2 > WR_TAG  > PRB_TAG > 001 > PRB_RSC_LIST > LV2PQ0041051 > PRB_LIST
		*/

		// delete wrong collection
		deleteColl(1, "LS_TAG", userDoc)
		deleteColl(1, "RD_TAG", userDoc)
		deleteColl(2, "LS_TAG", userDoc)
		deleteColl(2, "RD_TAG", userDoc)
		deleteColl(2, "WR_TAG", userDoc)
	
		
		const recColl = userDoc.collection("recommend")

		// delete recommend collection
		recColl.get().then(async querySnapshot => {

			// 생산된 추천 문서 삭제
			// docs = ["Recommend", "LV1PQ0041001", "LV1PQ0051011" ... ]
			querySnapshot.docs.forEach(async doc => {
				await recColl.doc(doc.id).delete()
			})
		})


		const lvColl = userDoc.collection("leveltest")

		// delete leveltest collection
		lvColl.get().then(querySnapshot => {

			// 유저 레벨테스트 기록 삭제
			querySnapshot.docs.forEach(async doc => {
				await lvColl.doc(doc.id).delete()
			})
		})



		// delete user document
		await userDoc.delete()
	} catch (error) {
		console.error('문서 삭제 오류:', error);
	}
}

// 유저 탈퇴 - 사용자 프로필사진 삭제
export async function deleteUserProfile(email){
	try{
		const storageRef = storage().ref(`profile/${email}.jpg`)
		
		await storageRef.delete()
	}catch(err){

		if(err.code == "storage/object-not-found"){
			console.log("삭제 실패! 프로필 이미지가 없습니다")
		}else{
			console.log(err)
		}

	}
	
}



// 탈퇴 - 복습하기 컬렉션의 듣기 읽기 영역 하위 문서 모두 삭제
const deleteColl = async(level, section, userDoc) => {
	/*
		wrong_lv1 > LS_TAG > PRB_TAG > 001 > PRB_LIST
		wrong_lv2 > WR_TAG  > PRB_TAG > 001 > PRB_RSC_LIST > LV2PQ0041051 > PRB_LIST
	*/
	
	const sectDoc = userDoc.collection(`wrong_lv${level}`).doc(section)
	
	// LS_TAG > PRB_TAG > 001 > PRB_LIST 
	sectDoc.collection("PRB_TAG").get().then(async querySnapshot => {
	
		// docs = ["001", "002", "004", "Wrong"] 
		querySnapshot.docs.forEach(async doc => {
			const tagDoc = sectDoc.collection("PRB_TAG").doc(doc.id)

			if(doc.id != "Wrong"){
				
				// 001 > PRB_LIST 
				if(section == "LS_TAG" || section == "RD_TAG"){
					deleteSect(tagDoc)
				}else{ // 001 > PRB_RSC_LIST > LV1PQ0041021 > PRB_LIST 
					deleteSectWr(tagDoc)
				}

			}

			// 유형 문서 삭제
			// delete 001
			await tagDoc.delete()
		})

	})

	// 영역 문서 삭제
	// delete LS_TAG
	await sectDoc.delete()
}




// delete LS / RD 
const deleteSect = async(tagDoc) => {
	const prbColl = tagDoc.collection("PRB_LIST") 
				
	// 001 > PRB_LIST 
	prbColl.get().then(async querySnapshot => {
		
		// docs = ["LV1PQ0041001", "LV1PQ0051001"]
		// PRB_LIST > docs
		querySnapshot.docs.forEach(async doc => {
			await prbColl.doc(doc.id).delete()
		})
	
	})	
}


// delete WR 
const deleteSectWr = async(tagDoc) => {
	// 001 > PRB_RSC_LIST > LV1PQ0041021 > PRB_LIST

	const rscColl = tagDoc.collection("PRB_RSC_LIST")

	rscColl.get().then(async querySnapshot => {
		
		// PRB_RSC_LIST > LV1PQ0041001 > PRB_LIST
		querySnapshot.docs.forEach(async doc => {
			const prbDoc = rscColl.doc(doc.id)
			const prbColl = prbDoc.collection("PRB_LIST")

			// PRB_LIST 
			prbColl.get().then(async querySnapshot_ =>{

				// delete DATE history
				querySnapshot_.docs.forEach(async doc => {
					await prbColl.doc(doc.id).delete()
				})

			})

			// delete LV1PQ0041001
			await prbDoc.delete()
		})

	})
}
