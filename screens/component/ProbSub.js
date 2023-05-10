import React from "react";
import { Text, View, StyleSheet } from "react-native";


export default ProbSub = (props) =>{
    return (
        <View style = {{flex: 1}}>
            <View style = {styles.ContentBox}>
                <Text>
                    {props.PRB_SUB_CONT}
                </Text>
                <Text/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ContentBox: {
        backgroundColor: "#D9D9D9",
        padding: 5,
        alignItems: "center"
    }
})