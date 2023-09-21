import firestore from '@react-native-firebase/firestore';
import react from "react"

// import 유틸
import { getNow } from './utils';


// USER DOC 
export async function getUserDoc(uid) {
	const data = await firestore().collection("users").doc(uid).get()

	const user = {
		level: data._data.my_level,
		nickname: data._data.nickname,
		levelIdx: data._data.level_idx
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


			// 모의고사 학습 시에만 해당
			// 사용자가 문제를 풀다 나갔을 경우 필드(SCORE/PRB_USER_ANSW...) 강제 생성
			settingUserField(userProblem)

		
			// 현재 날짜/시간으로 도큐먼트 ID 지정
			// 문서에 SCORE와 PRB_USER_ANSW / PRB_USER_ANSW2 가 포함
			prbDoc.collection('PRB_LIST').doc(date).set(userProblem).then(()=>{
				console.log(`${problem.PRB_ID} 문서 추가 완료`)
			})

			/*
				현재 쓰기 히스토리 개수 제한 없음

			*/

		} else {
			console.log("영역을 찾을 수 없습니다! err")
		}

	} catch (err) {
		console.log("오답노트 추가 에러!" + err)
	}

}


function settingUserField( problem ){
	// 사용자가 답안을 지정하지 않은 경우(중간에 풀다 나갔을 경우) undefined 대신 다른 값으로 지정 (firebase에서 undefiend datatype을 제공하지 않아 에러)
	
	if(problem.TAG == "001" || problem.TAG == "002"){
		problem.PRB_USER_ANSW2 = problem.PRB_USER_ANSW2 || null
	}
	
	problem.PRB_USER_ANSW = problem.PRB_USER_ANSW || null
	
	
	// 서답형 문제를 풀지 않음 -> SCORE = 0, ERROR_CONT = ""

	problem.SCORE = problem.SCORE || 0
	problem.ERROR_CONT = problem.ERROR_CONT || ""

}


// add history collection
export function setHistoryColl(problems, user_id){

	const historyColl = firestore().collection("historys")

	console.log(problems)
	for(let i=0; i<problems.length; i++){
		const DATA = {
			ELAPSED_TIME: problems[i].ELAPSED_TIME,
			PRB_CORRT_ANSW: problems[i].PRB_CORRT_ANSW,
			PRB_ID: problems[i].PRB_ID,
			PRB_USER_ANSW: problems[i].PRB_USER_ANSW,
			TAG: problems[i].TAG,
			USER_ID: user_id
		}

		historyColl.add(DATA)
	}
	
}