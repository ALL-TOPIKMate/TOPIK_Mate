import axios from "axios" 
import { Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { checkUserSession, createUserSession } from "./auth";

// 현재 날짜 알아내기
export function getNow(){
    const date = new Date()

    /*
        Date Format
        2023-08-24 18:08:0003

        fixed length 21
    */

    const YEAR = date.getFullYear() 
    const MONTH = (date.getMonth()+1).toString().padStart(2, "0")
    const DATE = date.getDate().toString().padStart(2, "0")
    
    const HOUR = date.getHours().toString().padStart(2, "0")
    const MINUTE = date.getMinutes().toString().padStart(2, "0")
    const MILLISEC = date.getMilliseconds().toString().padStart(4, "0")

    return `${YEAR}-${MONTH}-${DATE} ${HOUR}:${MINUTE}:${MILLISEC}`
}


// 현재 날짜 알아내기
export function getNow2(){
    const date = new Date()

    /*
        Date Format
        2023-08-24

        fixed length 10
    */

    const YEAR = date.getFullYear() 
    const MONTH = (date.getMonth()+1).toString().padStart(2, "0")
    const DATE = date.getDate().toString().padStart(2, "0")
    
    return `${YEAR}-${MONTH}-${DATE}`
}

// 유저의 학습시간 setting
// 학습 스크린에서 나올때 호출 (학습 시간 기록 - asyncstorage)
export async function settingUserStudyTime(time){
    try{
        const user = await checkUserSession()
        
        /* 현재 날짜 값으로 학습 시간 초기화*/
        let dateKey = getNow2()


        // 시간 배열이 비어있다면 생성
        user["studyTime"] = user["studyTime"] || {}

        // 이미 오늘 날짜가 존재하면 (학습을 이전에 한 유저)
        if(user["studyTime"][dateKey]){
            
            user["studyTime"][dateKey] += time
        
        }else{ // 자정이 지난 이후 처음으로 학습한 유저라먄

            user["studyTime"] = {}
            user["studyTime"][dateKey] = time

        }


        // 세션에 저장 (asyncStorage)
        await createUserSession(user)

    }catch(err){
        console.log(err)
    }

}

// 점수 반올림 함수 - 소수점 둘째자리에서 반올림
export function getRoundedScore(score){
    return Math.round(score * 10)/10
}

// 특수문자 ㄱ, ㄴ 답안 분리
export function splitProblemAnswer(text){
    // 특수문자 기준으로 분리 한 뒤 앞뒤 공백 제거
    let [text1, text2] = text.split("㉡")

    text1 = text1.split("㉠")[1] 

    return {
        text1: text1.trim(),
        text2: text2.trim()
    }
}

// 실제답안 여러개(/) 분리  
export function splitProblemAnswer2(text){
    // 슬래시 기준으로 분할하여 공백제거한 문자열 배열 형태로 반환
    return text.split("/").map(data => data.trim())
}


// 특수문자 ㈎, ㈏, ㈐, ㈑ 개행처리
// 특수문자가 없는 지문이라면 원본 텍스트 반환됨
export function splitProblemToNewline(text){
    
    let newLine = ""
    
    newLine = text.replace("㈏", "<br/>㈏")
    newLine = newLine.replace("㈐", "<br/>㈐")
    newLine = newLine.replace("㈑", "<br/>㈑")

    newLine = text.replace("(나)", "<br/>(나)")
    newLine = newLine.replace("(다)", "<br/>(다)")
    newLine = newLine.replace("(라)", "<br/>(라)")
    
    return newLine
}



// 유형 태그 매칭 - (토픽레벨, 영역, 유형)
export function typeName(userLevel, section, type){
    if(userLevel == 1){
        if(section === "LS"){
            if(type === "001"){
                return "이어지는 내용 유추"
            }else if(type === "002"){
                return "대화의 장소/화제 파악"
            }else if(type === "003"){
                return "일치하는 그림 고르기"
            }else if(type === "004"){
                return "일치하는 내용 고르기"
            }else if(type === "005"){
                return "중심 생각 고르기"
            }else if(type === "006"){
                return "대화의 목적 파악"
            }else if(type ==="007"){
                return "대화 상황에서 이유 파악"
            }
        }else if(section ==="RD"){
            if(type === "001"){
                return "중심 소재 고르기"
            }else if(type ==="002"){
                return "빈칸 채우기"
            }else if(type ==="003"){
                return "일치하는 내용 고르기"
            }else if(type === "004"){
                return "중심 내용 파악"
            }else if(type ==="005"){
                return "글의 흐름 파악"
            }else if(type ==="006"){
                return "문장의 위치 파악"
            }else if(type ==="007"){
                return "글을 쓴 이유 파악"
            }
        }
    }else if(userLevel == 2){
        if(section==="LS"){
            if(type ==="001"){
                return "일치하는 그림 고르기"
            }else if(type ==="002"){
                return "이어지는 말 고르기"
            }else if(type ==="003"){
                return "알맞은 행동 고르기"
            }else if(type ==="004"){
                return "담화 참여자 고르기"
            }else if(type ==="005"){
                return "담화 전/후 내용 고르기"
            }else if(type ==="006"){
                return "중심 생각 고르기"
            }else if(type ==="007"){
                return "중심 내용/화제 고르기"
            }else if(type ==="008"){
                return "화자 의도/목적 고르기"
            }else if(type ==="009"){
                return "일치하는 내용 고르기"
            }else if(type ==="010"){
                return "담화 상황 고르기"
            }else if(type ==="011"){
                return "화자 태도/말하는 방식 고르기"
            }
        }else if(section ==="RD"){
            if(type ==="001"){
                return "빈칸에 알맞은 말 고르기"
            }else if(type ==="002"){
                return "의미가 비슷한 말 고르기"
            }else if(type ==="003"){
                return "주제 고르기"
            }else if(type ==="004"){
                return "순서 배열하기"
            }else if(type ==="005"){
                return "일치하는 내용 고르기"
            }else if(type ==="006"){
                return "필자의 의도/목적 고르기"
            }else if(type ==="007"){
                return "인물의 심정/말투/태도 고르기"
            }else if(type ==="008"){
                return "문장이 들어갈 위치 고르기"
            }else if(type ==="009"){
                return "중심 생각 고르기"
            }else if(type ==="010"){
                return "빈칸에 들어갈 문장부사 고르기"
            }
        }else if(section ==="WR"){
            if(type ==="001"){
                return "실용문 빈칸에 알맞은 말 쓰기"
            }else if(type ==="002"){
                return "설명문 빈칸에 알맞은 말 쓰기"
            }else if(type ==="003"){
                return "자료를 설명하는 글 쓰기"
            }else if(type ==="004"){
                return "주제에 대해 글 쓰기"
            }
        }
    }
}


// 51, 52, 53번 post시 body에 넣을 data 형식
export function dataParsing(problem, user_answer){
    const PRB_CORRT_ANSW = splitProblemAnswer2(problem.text)
    console.log(PRB_CORRT_ANSW)

    const data = {
        number: parseInt(problem.PRB_NUM),
        question: [problem.PRB_MAIN_CONT],
        answer: PRB_CORRT_ANSW,
        contents: [user_answer]
    }

    return data
}


// 54번 post시 body에 넣을 data 형식
export function dataParsing2(problem, user_answer){
    const data = {
        number: parseInt(problem.PRB_NUM),
        question: [problem.PRB_MAIN_CONT],
        quest_con: [problem.PRB_TXT],
        answer: [problem.PRB_CORRT_ANSW],
        contents: [user_answer],
    }

    return data
}


// 서술형 채점 
const sendEssayScoring = async(data) => {
   
    /* 채점 서버 호출 */
    /* SCORE와 ERROR_CONT 생성*/

    const DATA = {}
    await axios.post("https://port-0-docker-essay-score-jvvy2blm7ipnj3.sel5.cloudtype.app/main", data).then(res => {
        const data = res.data
        
        // console.log(data)
        DATA.SCORE = data.result_score || data.score || 0 // 문제 채점 결과
        DATA.ERROR_CONT = ""


        // 유사도 검사
        if(data.s_message){
            DATA.ERROR_CONT += `${data.s_message}<br/>`
        }

        // 글자수 검사
        if(data.len_message){
            DATA.ERROR_CONT += `${data.len_message}<br/>`
        }
        // 글자수 검사 - 54번
        if(data["Length_Check"]){
            DATA.ERROR_CONT += `글자 수: ${data["Length_Check"]}<br/>`
        }

        // 채점결과 - 54번
        if(data["Good Points"]){
            DATA.ERROR_CONT += `잘한 점<br/> ${data["Good Points"].join("<br/>")}<br/>`
            DATA.ERROR_CONT += `부족한 점<br/> ${data["Weak Points"].join("<br/>")}<br/>`
            return 
        }
        
        // 맞춤법 검사
        DATA.ERROR_CONT += "맞춤법 검사<br/>"
        
        if(typeof data.sp_message == "string"){ // 맞춤법에 에러가 없을 경우
            DATA.ERROR_CONT += data.sp_message
            return 
        }

        // 맞춤법 에러 발생
        for(let i in data.sp_message){
            // i는 맞춤법 틀린 개수를 의미
            for(let key in data.sp_message[i]){
                DATA.ERROR_CONT+=`${key} ${data.sp_message[i][key]}<br/>`
            }
        }

    }).catch(err => {
        console.log(err)
        console.log(err.code)
    })


    return DATA
}


// 문항별 서술형 채점 
export async function getScoring(problem){
    /*
        problem: 유저 답안과 문제 정보를 포함

        51 ~ 54번 채점
        _______________
        51 52   ㄱ, ㄴ 
        53      요약 
        54      주제 글쓰기
        _______________

        return -> 채점 후 채점 결과(ERROR_CONT, SCORE ...)와 문제 정보를 포함한 데이터 반환 
    */

    // console.log(problem.PRB_NUM)
    switch(problem.PRB_NUM.toString()){
        case "51":
        case "52":
            let data = splitProblemAnswer(problem.PRB_CORRT_ANSW)

            const data1 = await sendEssayScoring(dataParsing({...problem, text: data.text1}, problem.PRB_USER_ANSW || ""))
            const data2 = await sendEssayScoring(dataParsing({...problem, text: data.text2}, problem.PRB_USER_ANSW2 || ""))

            problem = {
                ...problem,
                ...data1,
                SCORE2: data2.SCORE,
                ERROR_CONT2: data2.ERROR_CONT
            }

            break
        case "53":
            data = await sendEssayScoring(dataParsing({...problem, text: problem.PRB_CORRT_ANSW}, problem.PRB_USER_ANSW || ""))
    
            problem = {
                ...problem, 
                ...data
            }
            
            break

        case "54":
            data = await sendEssayScoring(dataParsing2(problem, problem.PRB_USER_ANSW || ""))

            problem ={ 
                ...problem,
                ...data
            }

            break

        default:
            console.log("error!!!!!")
            break
    }



    return problem
}

// 레벨테스트 문서 생성 함수
export const settingLevelprb = async () => {
    // PRB_ID dataset setting
    const lv101 = ["LV1PQ0083027", "LV1PQ0037017", "LV1PQ0064021", "LV1PQ0041025", "LV1PQ0052022", 
                    "LV1PQ0083039", "LV1PQ0047031", "LV1PQ0064039", "LV1PQ0036067", "LV1PQ0052063"]
    const lv102 = ["LV1PQ0052010", "LV1PQ0060008", "LV1PQ0064004", "LV1PQ0035029", "LV1PQ0041007",
                    "LV1PQ0036043", "LV1PQ0047035" ,"LV1PQ0035041", "LV1PQ0083042", "LV1PQ0052055"]
    const lv103 = ["LV1PQ0052002", "LV1PQ0036011", "LV1PQ0083025", "LV1PQ0064017", "LV1PQ0035013",
                    "LV1PQ0083044", "LV1PQ0064032", "LV1PQ0047032", "LV1PQ0041051", "LV1PQ0036046"]
    const lv104 = ["LV1PQ0060020", "LV1PQ0064026", "LV1PQ0036002", "LV1PQ0083004", "LV1PQ0052001",
                    "LV1PQ0041040", "LV1PQ0036035", "LV1PQ0083038", "LV1PQ0037052", "LV1PQ0052041"]
    const lv105 = ["LV1PQ0047013", "LV1PQ0064020", "LV1PQ0041013", "LV1PQ0060022", "LV1PQ0052010",
                    "LV1PQ0035061", "LV1PQ0064044", "LV1PQ0036051", "LV1PQ0060067", "LV1PQ0052066"]

    const lv201 = ["LV2PQ0052033", "LV2PQ0036045", "LV2PQ0041012", "LV2PQ0064047", "LV2PQ0060011",
                    "LV2PQ0047087", "LV2PQ0060088", "LV2PQ0035101", "LV2PQ0036103", "LV2PQ0041073"]
    const lv202 = ["LV2PQ0064041", "LV2PQ0060049", "LV2PQ0052007", "LV2PQ0035002", "LV2PQ0036007",
                    "LV2PQ0037096", "LV2PQ0052071", "LV2PQ0035062", "LV2PQ0036086", "LV2PQ0060096"]
    const lv203 = ["LV2PQ0052023", "LV2PQ0083008", "LV2PQ0035041", "LV2PQ0041002", "LV2PQ0036012",
                    "LV2PQ0035065", "LV2PQ0060062", "LV2PQ0036081", "LV2PQ0083103", "LV2PQ0052069"]  
    const lv204 = ["LV2PQ0036015", "LV2PQ0083041", "LV2PQ0041016", "LV2PQ0037033", "LV2PQ0060022",
                    "LV2PQ0035059", "LV2PQ0041089", "LV2PQ0036087", "LV2PQ0060087", "LV2PQ0037103"]
    const lv205 = ["LV2PQ0052039", "LV2PQ0064029", "LV2PQ0083026", "LV2PQ0036026", "LV2PQ0035038",
                    "LV2PQ0037096", "LV2PQ0035080", "LV2PQ0083069", "LV2PQ0047071", "LV2PQ0064063"]              

    const dataset = {
        "01": lv101,
        "02": lv102,
        "03": lv103, 
        "04": lv104,
        "05": lv105
    }

    const dataset2 = {
        "01": lv201,
        "02": lv202,
        "03": lv203, 
        "04": lv204,
        "05": lv205
    }

    try{

        // create
        // leveltest coll
        const lvprbColl = firestore().collection("lvtproblems")
        const lv1Doc = lvprbColl.doc("LV1")
        
        
        // read
        // mockproblem coll
        const prbLv1Coll = firestore().collection("problems").doc("LV1").collection("PQ")

        console.log("LV1 문서 생성중...")
        for(let key in dataset){
            // key = "01", dataset[key] => [PRB_ID, ...]  

            for(let DOC of dataset[key]){

                // 모의고사 회차 알아내기 ex) 0052
                const PRB_RSC = DOC.slice(5, 9)
    
                // PRB_ID DOC READ
                const data = await prbLv1Coll.doc(PRB_RSC).collection("PRB_LIST").doc(DOC).get()
    
                if(data.data() == undefined){
                    console.log("잘못된 문서!!!", key, DOC)
                    continue
                }
    
    
                // console.log(data.data())
                lv1Doc.collection(key).doc(DOC).set(data.data()).then(() => {
                    // console.log("문서 생성 완료", DOC)
                })
            }
        }
        
        const lv2Doc = lvprbColl.doc("LV2")
        
        const prbLv2Coll = firestore().collection("problems").doc("LV2").collection("PQ")

        console.log("LV2 문서 생성중...")
        for(let key in dataset2){
            // key = "01", dataset2[key] => [PRB_ID, ...]  

            for(let DOC of dataset2[key]){

                // 모의고사 회차 알아내기 ex) 0052
                const PRB_RSC = DOC.slice(5, 9)
    
                // PRB_ID DOC READ
                const data = await prbLv2Coll.doc(PRB_RSC).collection("PRB_LIST").doc(DOC).get()
    
                if(data.data() == undefined){
                    console.log("잘못된 문서!!!", key, DOC)
                    continue
                }
    
    
                // console.log(data.data())
                lv2Doc.collection(key).doc(DOC).set(data.data()).then(() => {
                    // console.log("문서 생성 완료", DOC)
                })
            }
            
        }
        
        
    }catch(err){
        console.log(err)
    }
    
}


// 레벨테스트 후 추천문제 생산(유저별 한번씩만 호출)
export const sendProblemRecommend = async(uid) => {
    try{   
        // console.log(uid)
        await axios.post(`https://port-0-problem-recommand-jvpb2aln7bulpg.sel5.cloudtype.app/recs-list/${uid}`).then(res => {
            const data = res.data

            console.log("추천문제 생산 완료!!")
            console.log(data)
        })

        /*
        추천문제 생산 알림창 동작확인
        const timeToDelay = 10000 // 10s
        const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
        

        await wait(timeToDelay)
        */


        /* Leveltest 문서 삭제 (history coll 과부화 방지) */
        const userlvColl = firestore().collection("users").doc(uid).collection("leveltest")
        
        userlvColl.get().then(querySnapshot => {
            
            const dataList = querySnapshot.docs.map(doc => doc.id)
            
            for(let data of dataList){
                if(data == "Leveltest"){
                    continue
                }

                userlvColl.doc(data).delete().then(()=> {
                    console.log(`${data} 삭제 완료!!`)
                })
            }   

        })
        


        return Alert.alert("추천문제 생산 완료")

    }catch(err){
        console.log(err)
    }
}