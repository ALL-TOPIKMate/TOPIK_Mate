import React, {useState, useEffect, useRef} from 'react'
import {View, Text} from "react-native";

import firestore from '@react-native-firebase/firestore';

// route.params.key = {"select", "random", "write"}
const WrongStudyScreen = ({route, navigation}) =>{
    const [data, setData] = useState([]);

    // 현재 유형의 인덱스를 가르킴
    const typeRef = useRef(0);

    // 현재 문제 페이지
    const [nextBtn, setNextBtn] = useState(0);
    
    // 복습하기 콜렉션 
    const problemCollection = firestore().collection('problems');
    

    // 문제를 다 읽었을 경우 다음 유형의 도큐먼트에서 문제를 불러옴
    const loadProblem = () =>{
        async function dataLoading(){
            try{
                const data = await problemCollection.where("tag", "==", route.params.userTag[typeRef.current]).get();
                setData(data.docs.map((doc)=> {return {...doc.data()}}))
            }catch(error){
                console.log(error.message);
            }    

            typeRef.current++;
        }

        dataLoading();
    }

    
    // route.params.userTag에 해당하는 도큐먼트의 문제들을 불러옴
    useEffect(()=>{
        setData({
            PRB_SECT: "듣기",
            PRB_NUM: 1,
            PRB_CORRT_ANSW: 3,
            PRB_POINT: 4,
            PRB_MAIN_CONT: "다음을 듣고 <보기>와 같이 물음에 맞는 대답을 고르십시오.",
            AUD_REF: "",
            PRB_CHOICE1: "네, 책이에요.",
            PRB_CHOICE2: "아니요, 책이 있어요. ",
            PRB_CHOICE3: "네, 책이 많아요. ",
            PRB_CHOICE4: "아니요, 책이 좋아요."
         }, 
         {
            PRB_SECT: "듣기",
            PRB_NUM: 21,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음을 듣고 물음에 답하십시오.",
            PRB_SUB_CONT: "남자의 중심 생각으로 맞는 것을 고르십시오.",
            AUD_REF: "",
            PRB_CHOICE1: "네, 책이에요.",
            PRB_CHOICE2: "아니요, 책이 있어요. ",
            PRB_CHOICE3: "네, 책이 많아요. ",
            PRB_CHOICE4: "아니요, 책이 좋아요."
         },
         {
            PRB_SECT: "읽기",
            PRB_NUM: 11,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음 글 또는 도표의 내용과 같은 것을 고르십시오.",
            PRB_TXT: "최근 70~80년대를 경험해 볼 수 있는 문화 공간이 생겼다. 서울시에서 새로 문을 연 '추억극장'이 바로 그곳이다. 입장료 2000원만 내면 남녀노소 누구나 그때 유행했던 영화를 관람할 수 있으며 커피와 차, 과자 등 간단한 간식도 먹을 수 있다. 극장 내부에는 추억의 영화 포스터, 영화표 등이 전시되어 있다.",
            PRB_CHOICE1: "이곳에서 옛날 영화 포스터를 살 수 있다.",
            PRB_CHOICE2: "얼마 전 추억의 문화 공간이 새로 만들어졌다.",
            PRB_CHOICE3: "추억극장은 입장료가 없기 때문에 인기가 많다.",
            PRB_CHOICE4: "추억극장에서는 최근에 나온 영화도 볼 수 있다."
         },
         {
            PRB_SECT: "읽기",
            PRB_NUM: 19,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음을 읽고 물음에 답하십시오.",
            PRB_SUB_CONT: "( )에 들어갈 알맞은 것을 고르십시오.",
            PRB_TXT: "과일을 빨리 익히기 위해 화학 물질이 사용되기도 한다. 그러나 화학 물질로 익힌 과일은 겉은 익었지만 속이 잘 익지 않은 경우가 많다. 그래서 화학 물질로 익힌 과일은 대게 자연적으로 숙성된 과일에 비해 맛과 향이 떨어진다. ( ) 화학 물질이 과일 껍질에 남게 될 수도 있다. 이런 과일을 지속적으로 먹으면 건강에 문제가 생기게 된다.",
            PRB_CHOICE1: "또는",
            PRB_CHOICE2: "또한",
            PRB_CHOICE3: "그래도",
            PRB_CHOICE4: "그러면"
         },
         {
            PRB_SECT: "읽기",
            PRB_NUM: 39,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음 글에서 <보기>의 문장이 들어가기에 가장 알맞은 곳을 고르십시오.",
            PRB_TXT: "운전 시 안전과 직결되는 것 중의 하나가 바로 차선이다. ( ㉠ ) 야간운전 중에 차선이 잘 보이지 않으면 크고 작은 사고들이 발생하게 될 것이다. ( ㉡ ) 반사 성능을 더욱 강화하고자 할 때에는 유리알이 혼합된 페인트를 사용할 수 있다. ( ㉢ ) 이렇게 하면 유리알이 불빛에 반사되어 차선이 더욱 잘 보이게 된다. ( ㉣ )",
            PRB_SCRPT: "이를 방지하기 위해 야간에 차선이 잘 보이도록 반사 기능이 있는 특수한 페인트를 사용한다.",
            PRB_CHOICE1: "㉠",
            PRB_CHOICE2: "㉡",
            PRB_CHOICE3: "㉢",
            PRB_CHOICE4: "㉣"
         },
        {
            PRB_SECT: "읽기",
            PRB_NUM: 44,
            PRB_CORRT_ANSW: 2,
            PRB_POINT: 2,
            PRB_MAIN_CONT: "다음을 읽고 물음에 답하십시오.",
            PRB_SUB_CONT: "위 글의 내용과 같은 것을 고르십시오.",
            PRB_TXT: "우주는 지구와 환경이 상이해 지구에서 쓰는 방법으로는 쓰레기를 수거하기가 어렵다. 처음에는 작살과 같이 물리적인 힘을 이용해서 쓰레기를 찍을 수 있는 도구가 거론되었다. (㉠) 이 때문에 테이프나 빨판같이 접착력이 있는 도구를 사용하자는 제안도 나왔다. (㉡) 점성이 강한 테이프의 경우는 우주에서의 극심한 온도 변화를 견디지 못했으며 빨판은 진공 상태에서는 소용이 없었다. (㉢) 그런데 최근 한 연구진이 도마뱀이 벽에 쉽게 달라붙어 떨어지지 않는 것에서 영감을 받아 접착력이 있는 도구를 개발하는 데 성공했다. (㉣) 도마뱀의 발바닥에 있는 수백만 개의 미세한 털들이 표면에 접촉할 때 생기는 힘을 응용한 것이다.",
            PRB_CHOICE1: "테이프는 우주의 온도 변화 때문에 점성을 잃었다.",
            PRB_CHOICE2: "작살은 접착력을 이용한 도구의 좋은 대안이 되었다.",
            PRB_CHOICE3: "우주에서 쓰레기를 처리하는 방법은 지구와 유사하다.",
            PRB_CHOICE4: "진공상태에서는 소용이 없었다."
        })

        // loadProblem();
    }, [])

    return (
        <View>
            <Text>
            {route.params.userTag}
            {route.params.userSelect}
            </Text>
        </View>
    );
}

export default WrongStudyScreen;