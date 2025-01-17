import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import type { PotteryItemMeasurements } from '../models'
import globalStyles from '../constants/stylesheet'
import { useTheme } from '@react-navigation/native'
import AnimatedPressable from './AnimatedPressable'

type NewMeasurementProps = {
  callbackFunction: (
    measurement: Pick<PotteryItemMeasurements, 'name' | 'scale' | 'system'>,
  ) => void
}
type Measurement = Pick<PotteryItemMeasurements, 'name' | 'scale' | 'system'>

export default function NewMeasurement({ callbackFunction }: NewMeasurementProps) {
  const [name, setName] = useState('')
  const [scale, setScale] = useState(0)
  const [system, setSystem] = useState('Imperial')
  const [showWarning, setShowWarning] = useState(false)
  const { colors } = useTheme()

  const handleSubmitMeasurement = () => {
    if(name.length === 0 || scale === 0) {
      setShowWarning(true)
    } else { 
      const m: Measurement = {
        name: name,
        scale: scale,
        system: system,
      }
      setShowWarning(false)
      callbackFunction(m)
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}
    >
      <Text style={[globalStyles.title, { marginBottom: 20, color: colors.text, fontFamily: 'title' }]}>
        New Measurement
      </Text>
      <View style={styles.group}>
        <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'headingBold' }]}>Measurement Name</Text>
        { showWarning && name.length === 0 &&
          <View style={{position: 'absolute', left: 0, right: 20}}>
            <Text style={{color: colors.notification, fontFamily: 'text', fontSize: 12, textAlign: 'right'}}>*Required</Text>
          </View>
        }
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
          onChangeText={setName}
          textAlign='center'
          cursorColor={colors.border}
        />
      </View>
      <View style={styles.group}>
        <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'headingBold' }]}>System</Text>
        <View style={[globalStyles.radio, { borderColor: colors.border }]}>
          <Pressable
            onPress={() => setSystem('Imperial')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              system === 'Imperial'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{color: colors.text, fontFamily: 'text'}}>Imperial</Text>
          </Pressable>
          <Pressable
            onPress={() => setSystem('Metric')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              system === 'Metric'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{color: colors.text, fontFamily: 'text'}}>Metric</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>Value</Text>
        { showWarning && scale === 0 &&
          <View style={{position: 'absolute', left: 0, right: 20}}>
            <Text style={{color: colors.notification, fontFamily: 'text', fontSize: 12, textAlign: 'right'}}>*Required</Text>
          </View>
        }
        <TextInput
          keyboardType="number-pad"
          style={[
            styles.input,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
          onChangeText={(x) => setScale(parseInt(x))}
          textAlign='center'
          cursorColor={colors.border}
        />
      </View>
      <View style={{ position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center' }}>
          { showWarning && <Text style={{color: colors.notification, fontFamily: 'text', marginBottom: 10}}>Please Include Required Fields</Text>}
        <AnimatedPressable
          style={[
            globalStyles.button,
            styles.button,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
          onPress={handleSubmitMeasurement}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Add Measurement</Text>
        </AnimatedPressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    marginHorizontal: 15,
    paddingBottom: 50,
    borderWidth: 1,
    borderRadius: 10,
  },
  group: {
    flex: 1,
  },
  button: {
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    marginHorizontal: 15,
    padding: 5,
    borderWidth: 1,
  },
})
