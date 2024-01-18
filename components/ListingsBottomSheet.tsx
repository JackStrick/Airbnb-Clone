import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { Listing } from "@/interfaces/listing";
import BottomSheet from "@gorhom/bottom-sheet";
import Listings from "@/components/Listings";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface Props {
	listings: Listing[];
	category: string;
}

const ListingsBottomSheet = ({ listings, category }: Props) => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["10%", "100%"], []);
	const [refresh, setRefresh] = useState(0);

	const showMap = () => {
		bottomSheetRef.current?.collapse();
		setRefresh(refresh + 1);
	};

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={1}
			snapPoints={snapPoints}
			enablePanDownToClose={false}
			handleIndicatorStyle={{ backgroundColor: "#d3d3d3" }}
			style={styles.sheetContainer}
		>
			<View style={{ flex: 1 }}>
				<Listings
					listings={listings}
					category={category}
					refresh={refresh}
				/>
				<View style={styles.absoluteBtn}>
					<TouchableOpacity onPress={showMap} style={styles.btn}>
						<Text style={{ fontFamily: "mon-sb", color: "#fff" }}>
							Map
						</Text>
						<Ionicons name="map" size={20} color="#fff" />
					</TouchableOpacity>
				</View>
			</View>
		</BottomSheet>
	);
};

const styles = StyleSheet.create({
	absoluteBtn: {
		position: "absolute",
		bottom: 30,
		width: "100%",
		alignItems: "center",
	},
	btn: {
		backgroundColor: Colors.dark,
		padding: 16,
		height: 50,
		borderRadius: 30,
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
	},
	sheetContainer: {
		backgroundColor: "#fff",
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowRadius: 4,
		shadowOffset: {
			width: 1,
			height: 1,
		},
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});

export default ListingsBottomSheet;