import React, { useState } from 'react'
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import { CONE_TEMPERATURES } from '../constants/coneTemperatures'
import type { PotteryItemFirings } from '../models'
import globalStyles from '../constants/stylesheet'
import Modal from 'react-native-modal'
import { useTheme } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import AnimatedPressable from './AnimatedPressable'

type NewFiringProps = {
  callbackFunction?: (firing: Pick<PotteryItemFirings, 'fireType' | 'fireStyle' | 'cone'>) => void
}

const NewFiring = ({ callbackFunction }: NewFiringProps) => {
  const [fireType, setFireType] = useState('Bisque')
  const [fireStyle, setFireStyle] = useState('Oxidation')
  const [cone, setCone] = useState<keyof typeof CONE_TEMPERATURES>(17)
  const [isConeSelectVisible, setConeSelectVisible] = useState(false)
  const { colors } = useTheme()


  const handleDropdownSelection = (key: string) => {
    setConeSelectVisible(false)
    setCone(parseInt(key) as keyof typeof CONE_TEMPERATURES)
  }

  const handleSubmitFiring = () => {


    const f: Pick<PotteryItemFirings, 'fireType' | 'fireStyle' | 'cone'> = {
      fireStyle: fireStyle,
      fireType: fireType,
      cone: CONE_TEMPERATURES[cone].cone,
    }
    callbackFunction?.(f)
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}
    >
      <Text style={[globalStyles.title, { marginBottom: 20, color: colors.text, fontFamily: 'title' }]}>New Firing</Text>
      <View style={styles.group}>
        <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>Fire Type:</Text>
        <View style={[globalStyles.radio, { borderColor: colors.border }]}>
          <Pressable
            onPress={() => setFireType('Bisque')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              fireType === 'Bisque'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'text' }}>Bisque</Text>
          </Pressable>
          <Pressable
            onPress={() => setFireType('Glaze')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              fireType === 'Glaze'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'text' }}>Glaze</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>Fire Style:</Text>
        <View style={[globalStyles.radio, { borderColor: colors.border }]}>
          <Pressable
            onPress={() => setFireStyle('Oxidation')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              fireStyle === 'Oxidation'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'text', fontSize:12 }}>Oxidation</Text>
          </Pressable>
          <Pressable
            onPress={() => setFireStyle('Reduction')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              fireStyle === 'Reduction'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'text', fontSize:12 }}>Reduction</Text>
          </Pressable>
          <Pressable
            onPress={() => setFireStyle('Environmental')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border, flex: 1.5 },
              fireStyle === 'Environmental'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'text', fontSize:12, minWidth:0 }}>Environmental</Text>
          </Pressable>
        </View>
      </View>
      {fireStyle != 'Environmental' && (
        <View style={styles.group}>
          <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>Temperature</Text>
          <Pressable
            style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => setConeSelectVisible(true)}
          >
            <Text style={{ color: colors.text, fontFamily: 'text' }}>
              {'Cone: ' +
                CONE_TEMPERATURES[cone].cone +
                ' (' +
                CONE_TEMPERATURES[cone].fahrenheit +
                'F / ' +
                CONE_TEMPERATURES[cone].celsius +
                'C)'}
            </Text>
            <Text style={{ position: 'absolute', right: 15, color: colors.text}}>
              <Ionicons color={colors.text} size={20} name="caret-down" />
            </Text>
          </Pressable>
        </View>
      )}
      <View style={{ position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center' }}>
        <AnimatedPressable
          style={[
            globalStyles.button,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
          onPress={handleSubmitFiring}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Add Measurement</Text>
        </AnimatedPressable>
      </View>
      <Modal
        isVisible={isConeSelectVisible}
        onBackdropPress={() => setConeSelectVisible(false)}
        onBackButtonPress={() => setConeSelectVisible(false)}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.border}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            {Object.entries(CONE_TEMPERATURES).map(([key, value]) => (
              <AnimatedPressable
                style={[
                  styles.selection,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleDropdownSelection(key)}
                key={key}
              >
                <Text style={{color: colors.text, fontFamily: 'text'}}>
                  {'Cone: ' + value.cone + ' (' + value.fahrenheit + 'F / ' + value.celsius + 'C)'}
                </Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

export default NewFiring

const styles = StyleSheet.create({
  container: {
    height: 350,
    marginHorizontal: 5,
    paddingBottom: 50,
    borderWidth: 1,
    borderRadius: 10,
  },
  group: {
    flex: 1,
  },
  dropdown: {
    borderWidth: 1,
    padding: 8,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  selection: {
    marginHorizontal: 5,
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
  },
  modalContainer: {
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 150,
    borderWidth: 1,
    borderRadius: 10,
  },
  modalScrollContainer: {
    rowGap: 5
  },
  buttonText: {
    fontSize: 16,
  },
})
