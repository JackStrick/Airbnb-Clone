import {
	View,
	Text,
	FlatList,
	ListRenderItem,
	TouchableOpacity,
	StyleSheet,
	Image,
	Touchable,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Listing } from "@/interfaces/listing";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

interface Props {
	listings: any[];
	category: string;
}

const Listings = ({ listings: items, category }: Props) => {
	const [loading, setLoading] = React.useState(false);

	// For scrolling list from code
	const listRef = useRef<FlatList>(null);

	useEffect(() => {
		// There is no current backend calls for data from a backend,
		// so we will just set a timeout to simulate the delay and reset loading status
		setLoading(true);
		console.log("Category: ", category);
		setTimeout(() => {
			setLoading(false);
		}, 200);
	}, [category]);

	const renderRow: ListRenderItem<Listing> = ({ item }) => (
		<Link href={`/listing/${item.id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listing}
					entering={FadeInRight}
					exiting={FadeOutLeft}
				>
					<Image
						source={{ uri: item.xl_picture_url }}
						style={styles.image}
					/>
					<TouchableOpacity
						style={{ position: "absolute", top: 30, right: 30 }}
					>
						<Ionicons name="heart-outline" size={24} color="#fff" />
					</TouchableOpacity>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={{ fontFamily: "mon-sb", fontSize: 16 }}>
							{item.name}
						</Text>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Ionicons name="star" size={16} color={"#000"} />
							<Text style={{ fontFamily: "mon-sb" }}>
								{item.review_scores_rating / 20}
							</Text>
						</View>
					</View>
					<Text style={{ fontFamily: "mon" }}>{item.room_type}</Text>

					<View style={{ flexDirection: "row", gap: 4 }}>
						<Text style={{ fontFamily: "mon-sb" }}>
							$ {item.price}
						</Text>
						<Text style={{ fontFamily: "mon" }}>night</Text>
					</View>
				</Animated.View>
			</TouchableOpacity>
		</Link>
	);

	return (
		<View style={defaultStyles.container}>
			<FlatList
				renderItem={renderRow}
				ref={listRef}
				data={loading ? [] : items}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	listing: {
		padding: 16,
		gap: 10,
		marginVertical: 8,
	},
	image: {
		width: "100%",
		height: 350,
		borderRadius: 10,
	},
});

export default Listings;
