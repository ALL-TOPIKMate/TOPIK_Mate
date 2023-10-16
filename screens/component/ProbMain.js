import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import RenderHTML from 'react-native-render-html';


const ProbMain = ({ PRB_NUM, PRB_MAIN_CONT }) => {

    const {width} = useWindowDimensions() // window's width

    // html code
    const source = {
        html: `
            <p style = "
                font-size: 15px;
                color: #000000;

                width: ${width - 90}px; // text overflow (PRB_NUM이 차지하는만큼의 너비를 빼줌)

                padding: 0px;
                margin: 5px 10px; 
            ">
            ${PRB_MAIN_CONT}
            </p>
        `
    }
    

    return (
        <View>
            <View style={styles.titleBox}>
                <Text style={styles.number}>Q{PRB_NUM}</Text>
                <RenderHTML
                    source={source}
                    contentWidth={width}
                />
            </View>
            <Text />
        </View>
    );
}


const styles = StyleSheet.create({
    titleBox: {
        flexDirection: "row",
        // alignItems: "center",

        marginVertical: 32,
    },
    number: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#000000",
    },
    // title: {
    //     fontSize: 15,
    //     paddingHorizontal: 10,
    //     color: "#000000",

    //     flexShrink: 1
    // },
})


export default ProbMain