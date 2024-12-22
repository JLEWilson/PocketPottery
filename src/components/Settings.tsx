import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { SetStateAction, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import PotteryItemList from './PotteryItemsList'
import { useTheme } from '@react-navigation/native'
import Modal from 'react-native-modal'
import AnimatedPressable from './AnimatedPressable'

type SettingsModalProps = {
    isDarkMode: boolean,
    setDarkMode: (b: boolean) => void,
}

const SettingsModal = ({isDarkMode, setDarkMode}: SettingsModalProps) => {
    const {colors} = useTheme()
    const [isModalVisible, setModalVisible] = useState(false)

    return (
        <View>
            <View style={{marginRight: 10}}>
                <AnimatedPressable style={{padding: 5}} onPress={() => setModalVisible(true)}>
                    <Ionicons name='settings' size={20} color={colors.text}/>
                </AnimatedPressable>
            </View>
            <Modal
                isVisible={isModalVisible}
                animationIn={'zoomIn'} 
                animationInTiming={750}
                animationOut={'zoomOut'}
                animationOutTiming={750}
                backdropColor={colors.text}
                backdropOpacity={.8}
                onBackdropPress={() => setModalVisible(false)}
                onBackButtonPress={() => setModalVisible(false)}
                backdropTransitionOutTiming={0}
            >
                <View style={[styles.modal,{backgroundColor: colors.background, borderColor: colors.border}]}>
                    <AnimatedPressable style={{backgroundColor: colors.primary, padding: 5}} onPress={() => setDarkMode(!isDarkMode)}>
                        <Text>Settings</Text>
                    </AnimatedPressable>
                </View>
            </Modal>
        </View>
  )
}

export default SettingsModal

const styles = StyleSheet.create({
    modal: {
        borderWidth: 1
    }
})