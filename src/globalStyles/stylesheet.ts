import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        position: 'relative',
        top: 5,
    },
    label: {
        marginLeft: 8,
        fontSize: 15,
    },
    button: {
        padding: 4,
        elevation: 5,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20
    },
    radio: {
        flexDirection: 'row',
        marginHorizontal: 15,
        borderTopWidth: 1, 
        borderBottomWidth: 1,
        borderColor: 'black'
    },
    radioButton: {
        paddingVertical: 5,
        flex: 1,
        alignItems: 'center',
        borderRightWidth: 1,
        borderLeftWidth: 1
    },

})

export default globalStyles