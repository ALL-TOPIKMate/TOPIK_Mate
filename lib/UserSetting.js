import firestore from '@react-native-firebase/firestore';
import react from "react"



// USER DOC 
export async function getUserDoc(uid) {
	const data = await firestore().collection("users").doc(uid).get()

	const user = {
		level: data._data.my_level,
		nickname: data._data.nickname
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


			// 답을 맞췄을 경우
			if (problem.PRB_CORRT_ANSW == userProblems[index].PRB_USER_ANSW) {

				deleteToWrongColl(problem, wrongColl)

			} else { // 답을 틀렸을 경우

				addToWrongColl(problem, wrongColl)

			}
		})

	} catch (err) {
		console.log(err)
	}

}



// 복습하기 콜렉션에서 유저가 맞춘 문제를 제거
// LSTAG -> PRB_TAG -> 001 문서의 field인 PRB_LIST_COUNT를 1만큼 감소시킴
async function deleteToWrongColl( problem, wrongColl ){
	console.log("정답! 문서 삭제")
	try{
		const sectTagDoc = wrongColl.doc(`${problem.PRB_SECT}_TAG`); sectTagDoc.set({})

		const tagDoc = sectTagDoc.collection("PRB_TAG").doc(problem.TAG);



		await tagDoc.collection("PRB_LIST").doc(problem.PRB_ID).get().then((doc) => {
			// 존재하지 않는 문서를 맞췄을 경우, 삭제할 필요 없음 
			if (!doc.exists) {
				return 
			}

			// delete document
			tagDoc.collection("PRB_LIST").doc(problem.PRB_ID).delete().then(()=>{
				console.log(`${problem.PRB_ID} 문서 삭제 완료`)
			})
		})



		// field 수정
		const tagDocs = await tagDoc.get()

		const listcount = tagDocs.data().PRB_LIST_COUNT

		if (listcount) {

			await tagDoc.update({
				PRB_LIST_COUNT: listcount - 1
			})

		} else { // 필드가 존재하지 않거나 더이상 문제가 존재하지 않을경우

			tagDoc.set({
				PRB_LIST_COUNT: 0
			})

		}

	}catch(err){
		console.log("오답노트 삭제 에러!" + err)
	}

}


// 복습하기 콜렉션에서 유저가 틀린문제를 추가
// LS_TAG -> PRB_TAG -> 001 문서의 field인 PRB_LIST_COUNT를 1만큼 증가시킴
async function addToWrongColl( problem, wrongColl ) {
	console.log("오답! 문서 추가")
	try {
		// 듣기, 읽기 영역일 경우
		if (problem.PRB_SECT == "LS" || problem.PRB_SECT == "RD") {

			const sectTagDoc = wrongColl.doc(`${problem.PRB_SECT}_TAG`); sectTagDoc.set({})

			const tagDoc = sectTagDoc.collection("PRB_TAG").doc(problem.TAG);


			await tagDoc.collection("PRB_LIST").doc(problem.PRB_ID).get().then((doc) => {
				// 이미 존재하는 문서를 틀렸을 경우, 문서를 추가할 필요가 없음
				if (doc.exists) {
					return 
				}

				tagDoc.collection("PRB_LIST").doc(problem.PRB_ID).set(problem).then(()=>{
					console.log(`${Problem.PRB_ID} 문서 추가 완료`)
				})
			})


			// 유형 field 수정
			const tagDocs = await tagDoc.get()

			const listcount = tagDocs.data().PRB_LIST_COUNT


			if (listcount) {
				await tagDoc.update({
					PRB_LIST_COUNT: listcount + 1
				})
			} else { // 필드가 존재하지 않거나 문제가 없는 경우

				tagDoc.set({
					PRB_LIST_COUNT: 1
				})

			}

		} else if (problem.PRB_SECT == "WR") { // 쓰기 영역일 경우

			// const tagDoc = wrongColl
			//                         .doc('WR_TAG')
			//                         .collection('PRB_TAG')
			//                         .doc(problem.TAG);
			//         tagDoc.set({});
			//         const prbRscList = tagDoc.collection('PRB_RSC_LIST');

			//         const prbDoc = prbRscList.doc(problem.PRB_ID);
			//         prbDoc.set({});

			//         // 현재 날짜/시간으로 도큐먼트 ID 지정
			//         prbDoc.collection('PRB_LIST').doc(getNow()).set(problem);

		} else {
			console.log("영역을 찾을 수 없습니다! err")
		}

	} catch (err) {
		console.log("오답노트 추가 에러!" + err)
	}

}

