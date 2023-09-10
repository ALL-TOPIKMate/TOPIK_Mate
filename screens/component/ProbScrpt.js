import React from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";


export default ProbScrpt = ({PRB_SCRPT}) =>{

    const {width} = useWindowDimensions() // window's width

    // html code
    const source = {
        html: `
            <p style = "
                padding: 0px;
                margin: 0px;
            ">
            ${PRB_SCRPT}
            </p>
        `
    }

    return (
        <View>
            <View style = {styles.textBox}>
                <RenderHTML
                    source={source}
                    contentWidth={width}
                />
            </View>

            <Text/>
        </View>
    );
}

const styles = StyleSheet.create({
    textBox:{
        backgroundColor: "#D9D9D9",
        padding: 16, 
        
        borderWidth: 1,
        borderColor: "black",
    }
})