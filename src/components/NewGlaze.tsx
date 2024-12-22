import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import React, {useState} from 'react'
import type { Glaze } from '../models'
import { v4 as uuidv4 } from 'uuid'
import {useTheme} from '@react-navigation/native'
import { addGlaze } from '../services/glaze-service'
import { useDatabase } from '../services/db-context'
import AnimatedPressable from './AnimatedPressable'

type NewGlazeProps = {
    callBackFunction?: () => void;
    children?: React.ReactNode
}

const NewGlaze = (props: NewGlazeProps) => {
    const {callBackFunction, children} = props
    const DB = useDatabase()
    const {colors} = useTheme()
    const [name, setName] = useState('')
    const [manufacturer, setManufacturer] = useState('')
    const [notes, setNotes] = useState('')
   
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

  return (
    <View style={styles.container}>
        <View style={[styles.content, {backgroundColor: colors.background, borderColor: colors.border}]}>
            <Text style={[styles.title, {color: colors.text}]}>New Glaze</Text>
            <View style={[styles.textInputGroup, {flex: 1}]}>
                <Text style={[styles.label, {color: colors.text}]}>Name</Text>
                <TextInput 
                     style={[styles.textInput, {fontSize: 22, 
                        backgroundColor: colors.card, color: colors.text, borderColor: colors.border
                    }]}
                    onChangeText={setName}
                    maxLength={20}  
                    blurOnSubmit={true}
                    selectTextOnFocus={true} 
                />
            </View>
            <View style={[styles.textInputGroup, {flex: 1}]}>
                <Text style={[styles.label, {color: colors.text}]}>Manufacturer</Text>
                <TextInput 
                    style={[styles.textInput, {fontSize: 22, 
                        backgroundColor: colors.card, color: colors.text, borderColor: colors.border
                    }]}
                    onChangeText={setManufacturer}
                    maxLength={20}
                    blurOnSubmit={true}
                    selectTextOnFocus={true}
                />
            </View>
            <View style={[styles.textInputGroup, {flex: 2}]}>
                <Text style={[styles.label, {color: colors.text}]}>Notes</Text>
                <TextInput 
                    style={[styles.textInput, {
                        height: 100, fontSize: 14, 
                        backgroundColor: colors.card, color: colors.text, borderColor: colors.border
                    }]}                   
                    onChangeText={setNotes}
                    maxLength={250}   
                    multiline={true} 
                    blurOnSubmit={true} 
                />
            </View>
            <AnimatedPressable style={[styles.button, {backgroundColor: colors.primary, borderColor: colors.border}]}  onPress={handleAddNewGlaze}>
                <Text style={{fontSize: 20, paddingVertical: 4, color: colors.text, fontWeight: 'bold'}}>Add New Glaze</Text>
            </AnimatedPressable>
        {children}
        </View>
    </View>
  )
}

export default NewGlaze

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    content: {
        height: 400,
        borderWidth: 1,
        borderRadius: 10
    },
    label: {
        paddingLeft: 4,
        fontSize: 15,
        fontWeight: 'bold'
      },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        position: 'relative',
        top: 5,
    },
    textInputGroup: {
        marginHorizontal: 15,
        justifyContent: 'center',
        alignContent: 'center'
    },
    textInput: {
        textAlign: 'center',
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1,
    },
    button: {
        position: 'relative',
        bottom: 4,
        padding: 4,
        elevation: 3,
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        backgroundColor: 'green',
    }
})