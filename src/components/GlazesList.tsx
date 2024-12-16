import React, { useEffect, useState, useCallback } from 'react'
import type { Glaze } from '../models'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal'
import NewGlaze from './NewGlaze';
import { useDatabase } from '../services/db-context';
import { createGlazeTable, getGlazes } from '../services/glaze-service';
import globalStyles from '../globalStyles/stylesheet';

export type GlazesListProps = {
    onGlazeSelect?: (c: Glaze) => void;
    children?: React.ReactNode;
}

/*needs way to remove Glazes
    might need to change button methods, since they are outside of the modal if you 
    missclick the modal will close
*/


function GlazesList({children, onGlazeSelect}:GlazesListProps) {
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
        onGlazeSelect?.(g)
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
            <View style={{position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center'}}>
                <Pressable 
                    onPress={() => setNewGlazeFormVisible(true)}
                    style={[globalStyles.button, styles.newGlazeButton]}
                >
                    <Text style={styles.buttonText}>New Clay</Text>
                </Pressable>
                {children}
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
        marginBottom: 100
    },
    newGlazeButton: {
        borderColor: 'black',
        backgroundColor: 'green',
        width: 100,
        marginBottom: 5
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