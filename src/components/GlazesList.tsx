import React, { useEffect, useState, useCallback } from 'react'
import type { Glaze } from '../models'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal'
import NewGlaze from './NewGlaze';
import { useDatabase } from '../services/db-context';
import { createGlazeTable, getGlazes } from '../services/glaze-service';

type GlazesListProps = {
    onSubmit?: (c: Glaze) => void;
    potteryItemId?: string
}

/*needs way to remove Glazes
    might need to change button methods, since they are outside of the modal if you 
    missclick the modal will close
*/

const Glazes = [
    {
        GlazeId: 'Glaze1',
        name: 'Glaze1',
        manufacturer: 'Glaze1Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze2',
        name: 'Glaze2',
        manufacturer: 'Glaze2Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze3',
        name: 'Glaze3',
        manufacturer: 'Glaze3Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze4',
        name: 'Glaze4',
        manufacturer: 'Glaze4Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze5',
        name: 'Glaze5',
        manufacturer: 'Glaze5Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze6',
        name: 'Glaze6',
        manufacturer: 'Glaze6Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze7',
        name: 'Glaze7',
        manufacturer: 'Glaze7Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze8',
        name: 'Glaze8',
        manufacturer: 'Glaze8Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze9',
        name: 'Glaze9',
        manufacturer: 'Glaze9Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze10',
        name: 'Glaze10',
        manufacturer: 'Glaze10Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze11',
        name: 'Glaze11',
        manufacturer: 'Glaze11Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze12',
        name: 'Glaze12',
        manufacturer: 'Glaze12Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze13',
        name: 'Glaze13',
        manufacturer: 'Glaze13Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze14',
        name: 'Glaze14',
        manufacturer: 'Glaze14Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze15',
        name: 'Glaze15',
        manufacturer: 'Glaze15Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze16',
        name: 'Glaze16',
        manufacturer: 'Glaze16Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze17',
        name: 'Glaze17',
        manufacturer: 'Glaze17Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze18',
        name: 'Glaze18',
        manufacturer: 'Glaze18Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze19',
        name: 'Glaze19',
        manufacturer: 'Glaze19Maker',
        notes: 'a nice Glaze',
    },
    {
        GlazeId: 'Glaze20',
        name: 'Glaze20',
        manufacturer: 'Glaze20Maker',
        notes: 'a nice Glaze',
    },
];


function GlazesList({potteryItemId, onSubmit}:GlazesListProps) {
    const DB = useDatabase()
    
    const [selectedGlaze, setSelectedGlaze] = useState<Glaze>()
    const [allGlazes, setAllGlazes] = useState<Glaze[]>([])
    const [newGlazeFormVisible, setNewGlazeFormVisible] = useState(false)
    const [reload, setReload] = useState(false)

    const loadDataCallback = useCallback(async () => {
        try {
            await createGlazeTable(DB);
            const storedGlazes = await getGlazes(DB);
            console.log(storedGlazes)
            setAllGlazes(storedGlazes);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error Glazes items: ${error.message}`);
            } else {
                console.error('Unknown error occurred while loading Glazes.');
            }
        }
    }, [DB]);


    useEffect(() => {
        loadDataCallback();
    }, [loadDataCallback, reload]);


    const handleGlazeSelect = (g: Glaze) => {
        setSelectedGlaze(g)
        onSubmit?.(g)
    }

    const handleModalSubmission = () => {
        setNewGlazeFormVisible(false)
        setReload((prev) => !prev);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} indicatorStyle='white'>
                {allGlazes.map((g) => (
                    <Pressable key={"Button: " + g.glazeId}
                        onPress={() => handleGlazeSelect(g)}
                        style={[styles.button, selectedGlaze === g ? {backgroundColor: 'green'} : {backgroundColor: 'blue'}]}
                    >
                        <Text 
                            key={"Name: " + g.glazeId}
                            style={styles.buttonText}
                            >{g.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            <View style={{position: 'absolute', right: 0, left: 0, alignItems: 'center', bottom: 2}}>
                <Pressable 
                    onPress={() => setNewGlazeFormVisible(true)}
                    style={styles.newGlazeButton}
                >
                    <Text style={styles.buttonText}>New Glaze</Text>
                </Pressable>
            </View>
            <Modal
                isVisible={newGlazeFormVisible}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackdropPress={() => setNewGlazeFormVisible(false)}
                onBackButtonPress={() => setNewGlazeFormVisible(false)}
            >
                <View style={{flex: 1}}>
                    <NewGlaze callBackFunction={handleModalSubmission}/>
                </View>
            </Modal>
        </View>
    )
}

export default GlazesList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingBottom: 40,
        backgroundColor: 'green'
    },
    scrollContainer: {

    },
    newGlazeButton: {
        padding: 4,
        elevation: 3,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        backgroundColor: 'green',
      },
    button: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: 'center',
        elevation: 15,
        marginBottom: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black'
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1
    }
})