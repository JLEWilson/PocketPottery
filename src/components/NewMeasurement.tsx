import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import React, {useState} from 'react'
import type { PotteryItemMeasurements } from '../models'
import globalStyles from '../globalStyles/stylesheet'

type NewMeasurementProps = {
    callbackFunction: (measurement: Pick<PotteryItemMeasurements, 'name' | 'scale' | 'system'>) => void;
}
type Measurement = Pick<PotteryItemMeasurements, 'name' | 'scale' | 'system'>

export default function NewMeasurement({callbackFunction}: NewMeasurementProps) {
    const [name, setName] = useState('')
    const [scale, setScale] = useState(0)
    const [system, setSystem] = useState('Imperial')

    const handleSubmitMeasurement = () => {
        const m: Measurement = {
            name: name,
            scale: scale,
            system: system,
        }
        callbackFunction(m)
    }

    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, {marginBottom: 20}]}>
                New Measurement
            </Text>
            <View style={styles.group}>
                <Text style={globalStyles.label}>Measurement Name</Text>
                <TextInput
                style={styles.input}
                onChangeText={setName}
                />
            </View>
            <View style={styles.group}>
                <Text style={globalStyles.label}>System</Text>
                <View style={globalStyles.radio}>
                    <Pressable 
                        onPress={() => setSystem('Imperial')}
                        style={[globalStyles.radioButton, system === 'Imperial' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                    >
                        <Text>Imperial</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => setSystem('Metric')}
                        style={[globalStyles.radioButton, system === 'Metric' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                        >
                        <Text>Metric</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.group}>
                <Text style={globalStyles.label}>Value</Text>
                <TextInput
                keyboardType="number-pad"
                style={styles.input}
                onChangeText={(x) => setScale(parseInt(x))}
                />
            </View>
            <View style={{position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center'}}>         
                <Pressable style={[globalStyles.button, styles.button]} onPress={handleSubmitMeasurement}>
                    <Text style={styles.buttonText}>Add Measurement</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 350,
        marginHorizontal: 15,
        paddingBottom: 50,
        backgroundColor: 'green',
    },
    group: {
        flex: 1
    },
    button: {
        alignSelf: "center",
        borderColor: 'black',
        backgroundColor: 'green',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: { 
        backgroundColor: 'white', 
        marginHorizontal: 15, 
        padding: 5 
    },
})