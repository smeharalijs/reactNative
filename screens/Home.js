import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function Home({ navigation }) {



    const camera = () => {
        navigation.navigate("camera");
    }

    return (
        <View style={styles.container}>
            <Text>Camera App</Text>
            <TouchableOpacity style={styles.button} onPress={camera}>
                <Text style={styles.text}>Open Camera</Text>

            </TouchableOpacity>

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})