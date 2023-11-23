import React, { useCallback, useEffect, useState } from 'react'
import {
	Button,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from 'react-native'
import { PotteryItemComponent } from './src/components/PotteryItem'
import { PotteryItem } from './src/models'
import { getDBConnection} from './src/services/db-service'
import { createPotteryItemTable, getPotteryItems, getPotteryItemById, addPotteryItem, updatePotteryItem , deletePotteryItemById} from './src/services/potteryItem-service'
import CreatePotteryItemForm from './src/components/createPotteryItemForm'
const App = () => {
	const isDarkMode = useColorScheme() === 'dark'
	const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([])
	const [newPotteryItem, setNewPotteryItem] = useState('')
	

	const loadDataCallback = useCallback(async () => {
		try {
			const db = await getDBConnection()
			await createPotteryItemTable(db)
			const storedPotteryItems = await getPotteryItems(db)
			if (storedPotteryItems.length) {
				setPotteryItems(storedPotteryItems)
			} 
		} catch (error) {
			console.error(error)
		}
	}, [])
	useEffect(() => {
		loadDataCallback()
	}, [loadDataCallback])

	return (
		<>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<ScrollView contentContainerStyle={styles.scrollView}>
				<View style={styles.appTitleView}>
					<Text style={styles.appTitleText}> Pocket Pottery </Text>
				</View>
				<View style={styles.potteryItemsContainer}>
					{potteryItems.map((p) => (
						<PotteryItemComponent key={p.potteryItemId} potteryItem={p} />
					))}
				</View>
			</ScrollView>
			<CreatePotteryItemForm />
		</>
	)
}
const styles = StyleSheet.create({
	appTitleView: {
		marginTop: 20,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	appTitleText: {
		fontSize: 24,
		fontWeight: '800'
	},
	scrollView: {
		flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
	},
	potteryItemsContainer: {
		flexGrow: 1
	},
	
	
})
export default App