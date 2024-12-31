import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import type { Clay } from '../models'
import { v4 as uuidv4 } from 'uuid'
import { addClay, updateClay } from '../services/clay-service'
import { useDatabase } from '../services/db-context'
import { useTheme } from '@react-navigation/native'
import AnimatedPressable from './AnimatedPressable'

type NewClayProps = {
  callBackFunction?: () => void
  children?: React.ReactNode
  initialData?: Clay
}

const NewClay = (props: NewClayProps) => {
  const { callBackFunction, children, initialData } = props
  const DB = useDatabase()
  const { colors } = useTheme()
  const [name, setName] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [notes, setNotes] = useState('')
  const buttonText = initialData ? 'Update Clay' :  'Add New Clay'

  const handleAddNewClay = () => {
    const newClay: Clay = {
      clayId: uuidv4(),
      name: name,
      manufacturer: manufacturer,
      notes: notes,
    }
    addClay(DB, newClay)
    callBackFunction?.()
  }
  const handleUpdateClay = () => {
    if(!initialData) return

    const clayToUpdate: Clay = {
      clayId: initialData.clayId,
      name: name,
      manufacturer: manufacturer,
      notes: notes,
    }
    updateClay(DB, clayToUpdate)
    callBackFunction?.()
  }
  const handleFormSubmit = () => {
    initialData ? handleAddNewClay() : handleUpdateClay()
  }
  useEffect(() => {
    if(initialData){
      setName(initialData.name)
      setManufacturer(initialData.manufacturer)
      setNotes(initialData.notes)
    }
  },[initialData])
  
  return (
    <View style={styles.container}>
      <View
        style={[styles.content, { backgroundColor: colors.background, borderColor: colors.border }]}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: 'title' }]}>New Clay</Text>
        <View style={[styles.textInputGroup, { flex: 1 }]}>
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
                textAlignVertical: 'center'
              },
            ]}
            value={name}
            onChangeText={setName}
            maxLength={20}
            blurOnSubmit={true}
            selectTextOnFocus={true}
          />
        </View>
        <View style={[styles.textInputGroup, { flex: 1 }]}>
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
                textAlignVertical: 'center'
              },
            ]}
            value={manufacturer}
            onChangeText={setManufacturer}
            maxLength={20}
            blurOnSubmit={true}
            selectTextOnFocus={true}
          />
        </View>
        <View style={[styles.textInputGroup, { flex: 2 }]}>
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
                textAlignVertical: 'top'
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
          onPress={handleAddNewClay}
        >
          <Text
            style={{ fontSize: 20, paddingVertical: 4, color: colors.text, fontFamily: 'textBold' }}
          >
            {buttonText}
          </Text>
        </AnimatedPressable>
        {children}
      </View>
    </View>
  )
}

export default NewClay

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  content: {
    height: 400,
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
  textInputGroup: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    paddingVertical: 2,
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
})
