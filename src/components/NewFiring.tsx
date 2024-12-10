import React, {useState} from 'react'
import { StyleSheet, Text, View, Pressable, ScrollView, } from 'react-native'
import { CONE_TEMPERATURES } from '../constants/coneTemperatures'
import type { PotteryItemFirings } from '../models'
import globalStyles from '../globalStyles/stylesheet'
import Modal from 'react-native-modal'

type NewFiringProps = {
    callbackFunction?: ( firing: Pick<PotteryItemFirings, | 'fireType' | 'fireStyle' | 'cone'>) => void;
}

const NewFiring = ({callbackFunction}: NewFiringProps) => {
    const [fireType, setFireType] = useState('Bisque')
    const [fireStyle, setFireStyle] = useState('Oxidation')
    const [cone, setCone] = useState<keyof typeof CONE_TEMPERATURES>(17);
    const [isConeSelectVisible, setConeSelectVisible] = useState(false)

    const handleDropdownSelection = (key: string) => {
        setConeSelectVisible(false)
        setCone(parseInt(key) as keyof typeof CONE_TEMPERATURES)
    }

    const handleSubmitFiring = () => {
        const f: Pick<PotteryItemFirings, | 'fireType' | 'fireStyle' | 'cone'> = {
            fireStyle: fireStyle,
            fireType: fireType,
            cone: CONE_TEMPERATURES[cone].cone,
        }
        callbackFunction?.(f)
    }

  return (
    <View style={styles.container}>
        <Text style={[globalStyles.title, {marginBottom: 20}]}>
            New Firing
        </Text>
        <View style={styles.group}>
            <Text style={globalStyles.label}>Fire Type:</Text>
            <View style={globalStyles.radio}>
                <Pressable 
                    onPress={() => setFireType('Bisque')}
                    style={[globalStyles.radioButton, fireType === 'Bisque' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                    >
                    <Text>Bisque</Text>
                </Pressable>
                <Pressable 
                    onPress={() => setFireType('Glaze')}
                    style={[globalStyles.radioButton, fireType === 'Glaze' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                    >
                    <Text>Glaze</Text>
                </Pressable>
            </View>
        </View>
        <View style={styles.group}>
            <Text style={globalStyles.label}>Fire Style:</Text>
            <View style={globalStyles.radio}>
                <Pressable 
                    onPress={() => setFireStyle('Oxidation')}
                    style={[globalStyles.radioButton, fireStyle === 'Oxidation' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                    >
                    <Text>Oxidation</Text>
                </Pressable>
                <Pressable 
                    onPress={() => setFireStyle('Reduction')}
                    style={[globalStyles.radioButton, fireStyle === 'Reduction' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                    >
                    <Text>Reduction</Text>
                </Pressable>
                <Pressable 
                    onPress={() => setFireStyle('Environmental')}
                    style={[globalStyles.radioButton, fireStyle === 'Environmental' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}
                    >
                    <Text>Environmental</Text>
                </Pressable>
            </View>
        </View>
        <View style={styles.group}>
            <Text style={globalStyles.label}>Temperature</Text>
            <Pressable style={styles.dropdown} onPress={()=> setConeSelectVisible(true)}>
                <Text>{'Cone: ' + CONE_TEMPERATURES[cone].cone + ' (' + CONE_TEMPERATURES[cone].fahrenheit + 'F / ' + CONE_TEMPERATURES[cone].celsius + 'C)'}</Text>
                <Text style={{position: 'absolute', right: 15}}>▼</Text>
            </Pressable>
        </View>
        <View style={{position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center'}}>         
                <Pressable style={[globalStyles.button, styles.button]} onPress={handleSubmitFiring}>
                    <Text style={styles.buttonText}>Add Measurement</Text>
                </Pressable>
            </View>
        <Modal 
            isVisible={isConeSelectVisible}
            onBackdropPress={() => setConeSelectVisible(false)}
            onBackButtonPress={() => setConeSelectVisible(false)}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
        >
            <View style={styles.modalContainer}>
                <ScrollView style={styles.modalScrollContainer} >
                    {
                        fireStyle != 'Environmental' && (
                            Object.entries(CONE_TEMPERATURES).map(([key, value]) => (
                            <Pressable style={styles.selection} onPress={() => handleDropdownSelection(key)} key={key}>
                                <Text>{'Cone: ' + value.cone + ' (' + value.fahrenheit + 'F / ' + value.celsius + 'C)'}</Text>
                            </Pressable>
                    )))}
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
        marginHorizontal: 15,
        paddingBottom: 50,
        backgroundColor: 'green',
    },
    group: {
        flex: 1
    },
    dropdown: {
        borderWidth: 1,
        padding: 8,
        borderColor: 'black',
        justifyContent: 'center',
        backgroundColor: 'teal',
        marginHorizontal: 10,
    },
    selection: {
        backgroundColor: 'teal',
        margin: 5,
        justifyContent: 'center',
        padding: 8
    },
    modalContainer: {
        backgroundColor: 'blue',
        padding: 10,
        marginHorizontal: 40,
        marginVertical: 200
    },
    modalScrollContainer: {
        paddingBottom: 25
    },
    button: {
        borderColor: 'black',
        backgroundColor: 'green',
    },
    buttonText: {
        
    }
})