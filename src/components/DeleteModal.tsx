import { StyleSheet, Text, View } from 'react-native'
import React, { SetStateAction } from 'react'
import { useTheme } from '@react-navigation/native'
import Modal from 'react-native-modal'
import AnimatedPressable from './AnimatedPressable'

type DeleteModalProps = {
    isDeleteModalVisible: boolean,
    setDeleteModalVisible: React.Dispatch<SetStateAction<boolean>>,
    deleteCallback: (id: string) => void,
    deleteId: string,
    name: string
}

const DeleteModal = ({name, deleteId, isDeleteModalVisible, setDeleteModalVisible, deleteCallback}: DeleteModalProps) => {
    const {colors} = useTheme()
  return (
    <Modal 
    isVisible={isDeleteModalVisible}
    animationIn={'zoomIn'}
    animationInTiming={750}
    animationOut={'zoomOut'}
    animationOutTiming={750}
    backdropColor={colors.border}
    backdropOpacity={0.8}
    onBackdropPress={() => setDeleteModalVisible(false)}
    onBackButtonPress={() => setDeleteModalVisible(false)}
    backdropTransitionOutTiming={0}
  >
    <View style={[styles.deleteModal, {backgroundColor: colors.background, borderColor: colors.border}]}>
      <Text style={{fontSize: 18, color: colors.text, fontFamily: 'heading', textAlign: 'center'}}>Are you sure you want to delete</Text>
      <Text style={{fontSize: 18, color: colors.text, fontFamily: 'heading', textAlign: 'center'}}>{name}?</Text>
      <View style={{flexDirection: 'row', flex: 1,justifyContent: 'space-evenly', alignItems:'center'}}>
        <AnimatedPressable style={[styles.deleteModalButtons, {backgroundColor: colors.primary, borderColor: colors.border}]} onPress={() => setDeleteModalVisible(false)}>
          <Text style={[styles.deleteModalButtonText, {color: colors.text}]}>Cancel</Text>
        </AnimatedPressable>
        <AnimatedPressable style={[styles.deleteModalButtons, {backgroundColor: colors.notification, borderColor: colors.border}]} onPress={() => deleteCallback(deleteId)}>
          <Text style={[styles.deleteModalButtonText, {color: colors.text}]}>Delete</Text>
        </AnimatedPressable>
      </View>
    </View>
  </Modal>
  )
}

export default DeleteModal

const styles = StyleSheet.create({
    deleteModal: {
        borderWidth: 1,
        borderRadius: 8,
        height: 150,
        padding: 10
      },
      deleteModalButtons: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1
      },
      deleteModalButtonText: {
        fontSize: 16
      }
})