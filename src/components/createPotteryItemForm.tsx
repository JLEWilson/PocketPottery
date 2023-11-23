import React, { useState } from 'react';
import { View, Button, Text, StyleSheet} from 'react-native';
import Modal from "react-native-modal"

const CreatePotteryItemForm: React.FC = () => {
    const [formVisible, setFormVisible] = useState(false)

    return (
        <View>
            <View style={styles.modalOpenButton}>
                <Button
                    onPress={() => setFormVisible(true)}
                    title="Add New Piece"
                    color="#841584"
                    accessibilityLabel="open pottery project form"
                />
            </View>
            <Modal 
                isVisible={formVisible} 
                animationIn={"bounceIn"}
                animationOut={"bounceOut"}
            >
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>New Piece</Text>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalOpenButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    innerContainer: {
        backgroundColor: 'blue',
        flex: 1,
    },
    title: {
        alignSelf: 'center',
        fontSize: 24,
        marginVertical: 8
    },
})

export default CreatePotteryItemForm