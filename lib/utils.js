
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
