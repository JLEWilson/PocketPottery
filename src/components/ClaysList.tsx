import React, { useEffect, useState, useCallback } from 'react'
import type { Clay } from '../models'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal'
import NewClay from './NewClay';
import { useDatabase } from '../services/db-context';
import { createClayTable, getClays } from '../services/clay-service';
import globalStyles from '../globalStyles/stylesheet';

export type claysListProps = {
    onClaySelect?: (c: Clay) => void;
    children?: React.ReactNode;
}

/*needs way to remove clays
    might need to change button methods, since they are outside of the modal if you 
    missclick the modal will close
*/




function ClaysList({onClaySelect, children}:claysListProps) {
    const DB = useDatabase()
    
    const [selectedClay, setSelectedClay] = useState<Clay>()
    const [allClays, setAllClays] = useState<Clay[]>([])
    const [newClayFormVisible, setNewClayFormVisible] = useState(false)
    const [reload, setReload] = useState(false)

    const loadDataCallback = useCallback(async () => {
        try {
            await createClayTable(DB);
            const storedClays = await getClays(DB);
            setAllClays(storedClays);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error clays items: ${error.message}`);
            } else {
                console.error('Unknown error occurred while loading clays.');
            }
        }
    }, [DB]);


    useEffect(() => {
        loadDataCallback();
    }, [loadDataCallback, reload]);


    const handleClaySelect = (c: Clay) => {
        setSelectedClay(c)
        onClaySelect?.(c)
    }

    const handleModalSubmission = () => {
        setNewClayFormVisible(false)
        setReload((prev) => !prev);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} indicatorStyle='white'>
                {allClays.map((c) => (
                    <Pressable key={"Button: " + c.clayId}
                        onPress={() => handleClaySelect(c)}
                        style={[styles.button, selectedClay === c ? {backgroundColor: 'green'} : {backgroundColor: 'blue'}]}
                    >
                        <Text 
                            key={"Name: " + c.clayId}
                            style={styles.buttonText}
                            >{c.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            <View style={{position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center'}}>
                <Pressable 
                    onPress={() => setNewClayFormVisible(true)}
                    style={[globalStyles.button, styles.newClayButton]}
                >
                    <Text style={styles.buttonText}>New Clay</Text>
                </Pressable>
                {children}
            </View>
            <Modal
                isVisible={newClayFormVisible}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackdropPress={() => setNewClayFormVisible(false)}
                onBackButtonPress={() => setNewClayFormVisible(false)}
            >
                <View style={{flex: 1}}>
                    <NewClay callBackFunction={handleModalSubmission}/>
                </View>
            </Modal>
        </View>
    )
}

export default ClaysList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: 'green'
    },
    scrollContainer: {
        marginBottom: 100
    },
    newClayButton: {
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
        elevation: 8,
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