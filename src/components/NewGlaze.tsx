import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import React, {useState} from 'react'
import type { Glaze } from '../models'
import { v4 as uuidv4 } from 'uuid'

import { addGlaze } from '../services/glaze-service'
import { useDatabase } from '../services/db-context'

type NewGlazeProps = {
    callBackFunction?: () => void;
}

const NewGlaze = (props: NewGlazeProps) => {
    const {callBackFunction} = props
    const DB = useDatabase()

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
        <View style={styles.content}>
            <Text style={styles.title}>New Glaze</Text>
            <View  style={[styles.textInputGroup, {flex: 1}]}>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                    style={[styles.textInput, {fontSize: 24,}]} 
                    onChangeText={setName}
                    maxLength={25}  
                    blurOnSubmit={true} 
                />
            </View>
            <View style={[styles.textInputGroup, {flex: 1}]}>
                <Text style={styles.label}>Manufacturer</Text>
                <TextInput 
                    style={[styles.textInput, {fontSize: 24,}]} 
                    onChangeText={setManufacturer}
                    maxLength={25}
                    blurOnSubmit={true}
                />
            </View>
            <View style={[styles.textInputGroup, {flex: 2}]}>
                <Text style={styles.label}>Notes</Text>
                <TextInput 
                    style={[styles.textInput, {height: 100, fontSize: 12}]} 
                    onChangeText={setNotes}
                    maxLength={500}   
                    multiline={true} 
                    blurOnSubmit={true} 
                />
            </View>
            <Pressable style={styles.button} onPress={handleAddNewGlaze}>
                <Text style={{fontSize: 20, paddingVertical: 4}}>Add New Glaze</Text>
            </Pressable>
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
        flex:1,
        backgroundColor: "blue",
        maxHeight: 400,
        minHeight: 400,
        borderColor: 'black',
        borderWidth: 1
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