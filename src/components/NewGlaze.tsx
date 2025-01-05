import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import type { Glaze } from '../models'
import { v4 as uuidv4 } from 'uuid'
import { useTheme } from '@react-navigation/native'
import { addGlaze, updateGlaze } from '../services/glaze-service'
import { useDatabase } from '../services/db-context'
import AnimatedPressable from './AnimatedPressable'
import globalStyles from '../constants/stylesheet'
import Modal from 'react-native-modal'

type NewGlazeProps = {
  callBackFunction?: () => void
  children?: React.ReactNode
  initialData?: Glaze
  allManufacturers: string[]
}

const NewGlaze = (props: NewGlazeProps) => {
  const { callBackFunction, children, initialData, allManufacturers } = props
  const DB = useDatabase()
  const { colors } = useTheme()
  const [name, setName] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [notes, setNotes] = useState('')
  const [type, setType] = useState<string>('Glaze');
  const [idCode, setIdCode] = useState<string>('');
  const buttonText = initialData ? 'Update Glaze' :  'Add New Glaze'
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const handleAddNewGlaze = () => {
    const newGlaze: Glaze = {
      glazeId: uuidv4(),
      name: name,
      manufacturer: manufacturer,
      notes: notes,
    }
    addGlaze(DB, newGlaze)
    callBackFunction?.()
  }

  const handleUpdateGlaze = () => {
    if(!initialData) return
    
    const glazeToUpdate: Glaze = {
      glazeId: initialData.glazeId,
      name: name,
      manufacturer: manufacturer,
      notes: notes,
    }
    updateGlaze(DB, glazeToUpdate)
    callBackFunction?.()
  }

  const handleFormSubmit = () => {
    initialData ? handleUpdateGlaze() : handleAddNewGlaze()
  }

  useEffect(() => {
     if(initialData){
       setName(initialData.name)
       setManufacturer(initialData.manufacturer)
       setNotes(initialData.notes)
       setType(initialData.type || 'Glaze')
       setIdCode(initialData.idCode || '')
     }
   },[initialData])

  return (
    <View style={styles.container}>
      <View
        style={[styles.content, { backgroundColor: colors.background, borderColor: colors.border }]}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: 'title' }]}>New Glaze</Text>
        <View style={[styles.group, { flex: 1 }]}>
          <Text style={[styles.label, { color: colors.text, fontFamily: 'headingBold' }]}>
            Name
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                fontSize: 22,
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                fontFamily: 'text',
                textAlign: 'center',
                textAlignVertical: 'center',
              },
            ]}
            value={name}
            onChangeText={setName}
            maxLength={20}
            blurOnSubmit={true}
            selectTextOnFocus={true}
          />
        </View>
        <View style={[styles.group, { flex: 1 }]}>
          <Text style={[styles.label, { color: colors.text, fontFamily: 'headingBold' }]}>
            Manufacturer
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                fontSize: 22,
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                fontFamily: 'text',
                textAlign: 'center',
                textAlignVertical: 'center',
              },
            ]}
            onChangeText={setManufacturer}
            maxLength={20}
            value={manufacturer}
            blurOnSubmit={true}
            selectTextOnFocus={true}
          />
          {
            allManufacturers.length > 0 && 
            <AnimatedPressable
            onPress={() => setIsDropdownVisible(true)} 
            style={[globalStyles.button, {backgroundColor: colors.primary, borderColor: colors.border, marginTop: 5, alignSelf: 'center'}]}
            >
            <Text style={[{ color: colors.text, fontFamily: 'textBold', fontSize: 14 }]}>Choose From Existing</Text>
            </AnimatedPressable>
          }
        </View>
        <View style={[styles.group, { flex: .9 }]}>
        <Text style={[styles.label, { color: colors.text, fontFamily: 'headingBold' }]}>Firing Range</Text>
        <View style={[globalStyles.radio, { borderColor: colors.border, marginHorizontal: 0}]}>
          <Pressable
            onPress={() => setType('Glaze')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              type === 'Glaze'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
            
          >
            <Text style={{ color: colors.text, fontFamily: 'text', fontSize: 14}}>Glaze</Text>
          </Pressable>
          <Pressable
            onPress={() => setType('Under Glaze')}
            style={[
              globalStyles.radioButton,
              { borderColor: colors.border },
              type === 'Under Glaze'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'text', fontSize: 14 }}>Under Glaze</Text>
          </Pressable>
        </View>
      </View>
        <View style={[styles.group, { flex: 1 }]}>
          <Text style={[styles.label, { color: colors.text, fontFamily: 'headingBold' }]}>
            ID
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                fontSize: 22,
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                fontFamily: 'text',
                textAlign: 'center',
                textAlignVertical: 'center',
              },
            ]}
            value={idCode}
            onChangeText={setIdCode}
            maxLength={20}
            blurOnSubmit={true}
            selectTextOnFocus={true}
          />
        </View>
        <View style={[styles.group, { flex: 2.2 }]}>
          <Text style={[styles.label, { color: colors.text, fontFamily: 'headingBold' }]}>
            Notes
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                height: 100,
                fontSize: 14,
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                fontFamily: 'text',
                textAlign: 'left',
                textAlignVertical: 'top',
              },
            ]}
            value={notes}
            onChangeText={setNotes}
            maxLength={250}
            multiline={true}
            blurOnSubmit={true}
          />
        </View>
        <AnimatedPressable
          style={[styles.button, { backgroundColor: colors.primary, borderColor: colors.border }]}
          onPress={handleFormSubmit}
        >
          <Text
            style={{ fontSize: 20, paddingVertical: 4, color: colors.text, fontFamily: 'textBold' }}
          >
            {buttonText}
          </Text>
        </AnimatedPressable>
        {children}
      </View>
      <Modal 
        isVisible={isDropdownVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.border}
        backdropOpacity={0.5}
        onBackdropPress={() => setIsDropdownVisible(false)}
        onBackButtonPress={() => setIsDropdownVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View  
        style={[
          styles.modalContainer,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
        >

          <ScrollView>
            {allManufacturers.map((m, i) => (
              <AnimatedPressable key={'manu:' + i}
              onPress={() => {
                setManufacturer(m)
                setIsDropdownVisible(false)
              }}
              style={[
                styles.selection,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              >
                <Text style={[{color: colors.text, fontFamily: 'textBold', textAlign: 'center'}]}>{m}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
                </View>
      </Modal>
    </View>
  )
}
export default NewGlaze


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 17,
  },
  content: {
    height: 550,
    borderWidth: 1,
    borderRadius: 10,
  },
  label: {
    paddingLeft: 4,
    fontSize: 15,
  },
  title: {
    fontSize: 26,
    alignSelf: 'center',
    position: 'relative',
    top: 5,
  },
  group: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    paddingVertical: 2
  },
  button: {
    position: 'relative',
    bottom: 10,
    padding: 4,
    elevation: 3,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 150,
    borderWidth: 1,
    borderRadius: 10,
    maxHeight: 300
  },
  selection: {
  marginHorizontal: 5,
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
  }
})
