
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