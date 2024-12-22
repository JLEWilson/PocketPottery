import React, { useEffect, useState, useCallback } from 'react'
import type { Clay } from '../models'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal'
import NewClay from './NewClay';
import { useDatabase } from '../services/db-context';
import { createClayTable, getClays } from '../services/clay-service';
import globalStyles from '../globalStyles/stylesheet';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export type ClaysListProps = {
    onClaySelect?: (c: Clay) => void;
    children?: React.ReactNode;
}

function ClaysList({onClaySelect, children}:ClaysListProps) {
    const DB = useDatabase()
    const {colors} = useTheme()
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
        <View style={[styles.container]}>
            <ScrollView style={styles.scrollContainer} indicatorStyle='white'>
                {allClays.map((c) => (
                    <Pressable key={"Button: " + c.clayId}
                        onPress={() => handleClaySelect(c)}
                        style={[styles.button, {borderColor: colors.border}, selectedClay === c ? {backgroundColor: colors.primary} : {backgroundColor: colors.card}]}
                    >
                        <Text 
                            key={"Name: " + c.clayId}
                            style={[styles.buttonText, {color: colors.text}]}
                            >{c.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            <View style={{position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center'}}>
                <Pressable 
                    onPress={() => setNewClayFormVisible(true)}
                    style={[globalStyles.button, styles.newClayButton, {backgroundColor: colors.primary, borderColor: colors.border}]}
                >
                    <Text style={[styles.buttonText, {color: colors.text}]}>New Clay</Text>
                </Pressable>
                {children}
            </View>
            <Modal
                isVisible={newClayFormVisible}
                animationIn={'zoomIn'} 
                animationInTiming={750}
                animationOut={'zoomOut'}
                animationOutTiming={750}
                backdropColor={colors.text}
                backdropOpacity={0.5}
                onBackdropPress={() => setNewClayFormVisible(false)}
                onBackButtonPress={() => setNewClayFormVisible(false)}
                backdropTransitionOutTiming={0}
            >
                <View style={{flex: 1}}>
                    <NewClay callBackFunction={handleModalSubmission}>
                    <Pressable
                            onPress={() => setNewClayFormVisible(false)}
                            style={{position: 'absolute', top: 10, right: 20, zIndex:2}}
                        >
                            <Ionicons name='close-circle-outline' size={30} color={colors.text}/>
                        </Pressable>
                    </NewClay>
                </View>
            </Modal>
        </View>
    )
}

export default ClaysList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    scrollContainer: {
        marginBottom: 100,
        marginTop: 50
    },
    newClayButton: {
        width: 100,
        marginBottom: 5
      },
    button: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: 'center',
        elevation: 3,
        marginBottom: 30,
        borderRadius: 30,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1
    }
})