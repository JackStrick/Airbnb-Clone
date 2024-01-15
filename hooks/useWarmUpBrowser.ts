import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

/**
 * Warm up the browser to avoid the first time loading delay
 * Runs once in the beginning to warm up the browser
 * And once at the end to cool down the browser
 *
 * Helps a lot for Android
 */
export const useWarmUpBrowser = () => {
	useEffect(() => {
		void WebBrowser.warmUpAsync();
		return () => {
			void WebBrowser.coolDownAsync();
		};
	}, []);
};
