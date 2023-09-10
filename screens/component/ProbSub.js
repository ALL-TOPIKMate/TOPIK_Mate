import React from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

export default ProbSub = ({PRB_SUB_CONT}) =>{

    const {width} = useWindowDimensions() // window's width

    // html code
    const source = {
        html: `
            <p style = "
                padding: 0px;
                margin: 0px;
                color: #000000;
            ">
            ${PRB_SUB_CONT}
            </p>
        `
    }

    return (
        <View>
            <View style = {styles.contentBox}>
                <RenderHTML
                    source={source}
                    contentWidth={width}
                />
            </View>
            
            <Text/>
            <Text/>
        </View>
    );
}

const styles = StyleSheet.create({
    contentBox: {
        padding: 5,
        marginVertical: 10
    }
})