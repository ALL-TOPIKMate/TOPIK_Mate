import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';


const InfoApp = () => {

    const [isExpanded1, setIsExpanded1] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);



    const toggleContent = () => {
        setIsExpanded1(!isExpanded1);
    };

    const toggleContent2 = () => {
        setIsExpanded2(!isExpanded2);
    };

    return (
      <View>
        <Text style={styles.title}> 앱 정보 </Text>
        <Text style={styles.version}> 버전 정보</Text>
        <Text style={styles.versionContent}> version 0.0.1</Text>
        <Text style={styles.toggleTitle} onPress={toggleContent}> -서비스 이용 안내-  </Text>
        { isExpanded1 && (
            <View style={styles.contentContainer}>
            <Text>펼쳐진 내용 1</Text>
            <Text>펼쳐진 내용 2</Text>
            </View>
        )}
        <Text style={styles.toggleTitle} onPress={toggleContent2}> -앱 관련 라이선스-  </Text>
        { isExpanded2 && (
            <View style={styles.contentContainer}>
            <Text>펼쳐진 내용 11</Text>
            <Text>펼쳐진 내용 22</Text>
            </View>
        )}
      </View>
    ); 
};


const styles = StyleSheet.create({
    title:{
        fontSize: 30,
        fontWeight: 'bold'
    },
    version:{
        fontSize: 20,
    },
    versionContent:{
        fontSize: 15,
    },
    toggleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    contentContainer: {
        marginTop: 10,
    },
})
export default InfoApp;