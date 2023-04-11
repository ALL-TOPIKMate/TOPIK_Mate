import React from 'react';

import {View, Text} from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const StudyScreen = ({route}) =>{
    return (
        <View>
            <AppNameHeader/>
            <View>
                <Text>
                    문제 풀이 화면
                    
                    모의고사 형태의 문제를 제외한
                    추천문제, 유형별 문제, 오답노트의 문제를 
                    보여주는 화면 
                    (문제 구성이 다를 필요가 없는 애들은 해당 컴포넌트를 사용)



                    어느 페이지에서 왔는지 확인할 수 있도록 별도로 id 파라미터를 보냄

                    백엔드에 해당하는 문제를 요청하여 보여줌
                </Text>

                <Text>
                    아이디 값은 {route.params.id}

                </Text>
            </View>
        </View>
    );
}

export default StudyScreen;