import React from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import { splitProblemToNewline } from "../../lib/utils";

export default ProbTxt = ({PRB_TXT}) =>{

    const {width} = useWindowDimensions() // window's width

    // html code
    const source = {
        html: `
            <p style = "
                padding: 0px;
                margin: 0px;
                font-size: 15px;
                // color: #000000;
            ">
            ${splitProblemToNewline(PRB_TXT)} 
            </p>
        `
    }// 가 나 다 라 개행처리

    return (
        <View>
            <View style = {styles.textBox}>
                <RenderHTML
                    source={source}
                    contentWidth={width}
                />
            </View>

            <Text />
            <Text />
        </View>
    );
}

const styles = StyleSheet.create({
    textBox: {
        backgroundColor: "#D9D9D9",
        padding: 16,
        
        borderWidth: 1,
        borderColor: "black",

        flexShrink: 1
    }
})