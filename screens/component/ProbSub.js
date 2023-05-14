import React from "react";
import { Text, View, StyleSheet } from "react-native";


export default ProbSub = (props) =>{
    return (
        <View>
            <View style = {styles.ContentBox}>
                <Text style = {{color: "#000000"}}>
                    {props.PRB_SUB_CONT}
                </Text>
            </View>
            
            <Text/>
            <Text/>
        </View>
    );
}

const styles = StyleSheet.create({
    ContentBox: {
        padding: 5,
    }
})