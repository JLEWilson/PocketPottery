import React, { useEffect, useState, useCallback } from 'react'
import type { Clay, PotteryItemClays } from '../models'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal, { ReactNativeModal } from 'react-native-modal'
import NewClay from './NewClay';
import { useDatabase } from '../services/db-context';
import { createClayTable, getClays } from '../services/clay-service';
import globalStyles from '../globalStyles/stylesheet';

type claysListProps = {
    onSubmit?: (c: Clay) => void;
    potteryItemId?: string
}

/*needs way to remove clays
    might need to change button methods, since they are outside of the modal if you 
    missclick the modal will close
*/

const clays = [
    {
        clayId: 'clay1',
        name: 'clay1',
        manufacturer: 'clay1Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay2',
        name: 'clay2',
        manufacturer: 'clay2Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay3',
        name: 'clay3',
        manufacturer: 'clay3Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay4',
        name: 'clay4',
        manufacturer: 'clay4Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay5',
        name: 'clay5',
        manufacturer: 'clay5Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay6',
        name: 'clay6',
        manufacturer: 'clay6Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay7',
        name: 'clay7',
        manufacturer: 'clay7Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay8',
        name: 'clay8',
        manufacturer: 'clay8Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay9',
        name: 'clay9',
        manufacturer: 'clay9Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay10',
        name: 'clay10',
        manufacturer: 'clay10Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay11',
        name: 'clay11',
        manufacturer: 'clay11Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay12',
        name: 'clay12',
        manufacturer: 'clay12Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay13',
        name: 'clay13',
        manufacturer: 'clay13Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay14',
        name: 'clay14',
        manufacturer: 'clay14Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay15',
        name: 'clay15',
        manufacturer: 'clay15Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay16',
        name: 'clay16',
        manufacturer: 'clay16Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay17',
        name: 'clay17',
        manufacturer: 'clay17Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay18',
        name: 'clay18',
        manufacturer: 'clay18Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay19',
        name: 'clay19',
        manufacturer: 'clay19Maker',
        notes: 'a nice clay',
    },
    {
        clayId: 'clay20',
        name: 'clay20',
        manufacturer: 'clay20Maker',
        notes: 'a nice clay',
    },
];


function ClaysList({potteryItemId, onSubmit}:claysListProps) {
    const DB = useDatabase()
    
    const [selectedClay, setSelectedClay] = useState<Clay>()
    const [allClays, setAllClays] = useState<Clay[]>([])
    const [newClayFormVisible, setNewClayFormVisible] = useState(false)
    const [reload, setReload] = useState(false)

    const loadDataCallback = useCallback(async () => {
        try {
            await createClayTable(DB);
            const storedClays = await getClays(DB);
            console.log(storedClays)
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
        onSubmit?.(c)
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
            <View style={{position: 'absolute', right: 0, left: 0, alignItems: 'center', bottom: 2}}>
                <Pressable 
                    onPress={() => setNewClayFormVisible(true)}
                    style={styles.newClayButton}
                >
                    <Text style={styles.buttonText}>New Clay</Text>
                </Pressable>
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
        paddingBottom: 40,
        backgroundColor: 'green'
    },
    scrollContainer: {

    },
    newClayButton: {
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