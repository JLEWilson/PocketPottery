import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
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
import globalStyles from '../constants/stylesheet'
import { resetMetaTable } from '../services/meta'

type SettingsModalProps = {
  isDarkMode: boolean,
  setDarkMode: (b: boolean) => void,
  isModalVisible: boolean,
  setModalVisible: (b: boolean) => void
}

const SettingsModal = ({ isDarkMode, setDarkMode, isModalVisible, setModalVisible}: SettingsModalProps) => {
  const { colors } = useTheme()
  const DB = useDatabase()

  const resetAllData = async () => {
    //Will probably have to have a loading screen during this function because all other views will change
    try {
      // Reset all tables
      await resetPotteryItemTable(DB)
      await resetClayTable(DB)
      await resetPotteryItemClaysTable(DB)
      await resetGlazeTable(DB)
      await resetPotteryItemGlazesTable(DB)
      await resetFiringsTable(DB)
      await resetMeasurementsTable(DB)
      await resetMetaTable(DB)
    } catch (error) {
      console.error(
        'Error resetting tables:',
        error instanceof Error ? error.message : 'Unknown error',
      )
    }
  }

  return (
      <Modal
        isVisible={isModalVisible}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationInTiming={750}
        animationOutTiming={750}
        backdropColor={colors.border}
        backdropOpacity={0.8}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View style={{position: 'absolute', top: 15, alignSelf: 'center'}}>
            <Text style={{ fontFamily: 'title', textAlign: 'center', fontSize: 26, color: colors.text}}>
              Settings
            </Text>
          </View>
          <View style={[globalStyles.radio, { borderColor: colors.border }]}>
          <Pressable
            onPress={() => setDarkMode(true)}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border, padding: 10},
              isDarkMode
                ? { backgroundColor: colors.primary  }
                : { backgroundColor: '#B8CABF' },
            ]}
          >
            <Text style={{fontFamily: 'text', color: '#3C413C'}}>Dark Mode</Text>
          </Pressable>
          <Pressable
            onPress={() => setDarkMode(false)}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              !isDarkMode
                ? { backgroundColor: colors.primary }
                : { backgroundColor: '#B8CABF' },
            ]}
          >
            <Text style={{fontFamily: 'text', color: '#3C413C'}}>Light Mode</Text>
          </Pressable>
        </View>
          <AnimatedPressable
            style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.border }]}
            onPress={resetAllData}
          >
            <Text style={{fontFamily: 'textBold', color: colors.text}}>Reset All Data</Text>
          </AnimatedPressable>
        </View>
      </Modal>
  )
}

export default SettingsModal

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    height: 500,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    padding: 25,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
