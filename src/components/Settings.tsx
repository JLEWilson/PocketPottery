import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import Modal from 'react-native-modal'
import AnimatedPressable from './AnimatedPressable'
import { useDatabase } from '../services/db-context'
import { resetPotteryItemTable } from '../services/potteryItem-service'
import { resetClayTable } from '../services/clay-service'
import { resetPotteryItemClaysTable } from '../services/potteryItem-clays-service'
import { resetGlazeTable } from '../services/glaze-service'
import { resetPotteryItemGlazesTable } from '../services/potteryItem-glaze-service'
import { resetFiringsTable } from '../services/potteryItem-firing-service'
import { resetMeasurementsTable } from '../services/potteryItem-measurements-service'

type SettingsModalProps = {
  isDarkMode: boolean
  setDarkMode: (b: boolean) => void
}

const SettingsModal = ({ isDarkMode, setDarkMode }: SettingsModalProps) => {
  const { colors } = useTheme()
  const DB = useDatabase()
  const [isModalVisible, setModalVisible] = useState(false)

  const resetAllData = async () => {
    try {
      // Reset all tables
      await resetPotteryItemTable(DB)
      await resetClayTable(DB)
      await resetPotteryItemClaysTable(DB)
      await resetGlazeTable(DB)
      await resetPotteryItemGlazesTable(DB)
      await resetFiringsTable(DB)
      await resetMeasurementsTable(DB)
    } catch (error) {
      console.error(
        'Error resetting tables:',
        error instanceof Error ? error.message : 'Unknown error',
      )
    }
  }

  return (
    <View>
      <View style={{ marginRight: 10 }}>
        <AnimatedPressable style={{ padding: 5 }} onPress={() => setModalVisible(true)}>
          <Ionicons name="settings" size={20} color={colors.text} />
        </AnimatedPressable>
      </View>
      <Modal
        isVisible={isModalVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.8}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View
          style={[styles.modal, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <AnimatedPressable
            style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.border }]}
            onPress={() => setDarkMode(!isDarkMode)}
          >
            <Text>Settings</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.border }]}
            onPress={resetAllData}
          >
            <Text>Reset All Data</Text>
          </AnimatedPressable>
        </View>
      </Modal>
    </View>
  )
}

export default SettingsModal

const styles = StyleSheet.create({
  modal: {
    borderWidth: 1,
    borderRadius: 10,
    height: 500,
  },
  button: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
})
