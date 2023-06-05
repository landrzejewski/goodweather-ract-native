import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useCallback, useState} from "react";
import {MagnifyingGlassIcon, XMarkIcon} from "react-native-heroicons/outline";
import {debounce} from "lodash/function";
import {fetchLocations, fetchWeather, iconMappings} from "../provider/fetchWeatherProvider";

export default function Home() {

    const onCityChanges = async (city) => {
        try {
            const cities = await fetchLocations(city);
            setShowCities(true)
            setCities(cities);
        } catch (error) {
            console.log("Error:" + error);
        }
    };

    const onCitySelected = async (city) => {
        setShowCities(false)
        const weather = await fetchWeather({city});
        setShowSearch(false);
        setShowCities(false);
        setCities([]);
        setWeather(weather);
    };

    const [showSearch, setShowSearch] = useState(true)
    const [showCities, setShowCities] = useState(false)
    const [cities, setCities] = useState([]);
    const [weather, setWeather] = useState(null);
    const cityHandler = useCallback(debounce(onCityChanges, 1000), []);

    return (
        <View className="flex-1 relative">
            <StatusBar style="light"/>
            <Image
                source={require('../assets/images/bg.png')}
                blurRadius={60}
                className="absolute w-full h-full"/>
            <SafeAreaView className="flex flex-1" style={styles.androidSafeArea}>
                {/* search */}
                <View style={{height: "10%"}} className="mx-4 relative z-50">
                    <View className="flex-row justify-end items-center rounded-full"
                          style={{backgroundColor: showSearch ? "rgba(255,255,255,0.2)" : "transparent"}}>
                        {showSearch &&
                            <TextInput
                                onChangeText={cityHandler}
                                placeholder="Enter city"
                                placeholderTextColor="lightgray"
                                className="pl-6 h-10 pb-1 flex-1 text-white"/>
                        }
                        <TouchableOpacity
                            onPress={() => setShowSearch(!showSearch)}
                            className="rounded-full p-3 m-1"
                            style={{backgroundColor: "rgba(255,255,255,0.4)"}}>
                            {
                                showSearch ? <XMarkIcon size="25" color="white"/> :
                                    <MagnifyingGlassIcon size="25" color="white"/>
                            }
                        </TouchableOpacity>
                    </View>
                    {
                        cities.length > 0 && showSearch &&
                        <View className="absolute w-full top-16 rounded-3xl bg-gray-400">
                            {
                                cities.map((city, index) => {
                                    let showBorder = index + 1 !== cities.length;
                                    let borderClass = showBorder ? 'border-b-2 border-b-gray-500' : '';
                                    return (
                                        <TouchableOpacity
                                            onPress={() => onCitySelected(city.name)}
                                            key={index}
                                            className={"flex-row items-center p-3 mb-1 " + borderClass}>
                                            <Text className="text-black m-1 text-lg">{city.name}, {city.country}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    }
                </View>

                {weather && <>

                    {/* forecast */}
                    <View className="mx-4 flex justify-around flex-1 mb-2">
                        <Text className="text-white text-center text-2xl font-bold">
                            {weather.location.name}
                        </Text>
                    </View>
                    <View className="flex-row justify-center mb-8">
                        <Image source={iconMappings[weather.current.condition.text || 'other']}
                               className="w-60 h-60"/>
                    </View>
                    <View>
                        <Text className="text-white text-center text-2xl font-bold">
                            {weather.current.condition.text}
                        </Text>
                        <Text className="text-white text-center text-2xl font-bold">
                            {weather.current.temp_c}°
                        </Text>
                    </View>
                    <View className="flex-row justify-around mx-10 mt-8">
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require('../assets/icons/wind.png')} className="w-8 h-8"/>
                            <Text className="text-white">{weather.current.wind_kph} km</Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require('../assets/icons/drop.png')} className="w-8 h-8"/>
                            <Text className="text-white">{weather.current.humidity}%</Text>
                        </View>
                    </View>

                    {/* next days forecast */}
                    <ScrollView horizontal
                                contentContainerStyle={{paddingHorizontal: 12}}
                                showsHorizontalScrollIndicator={false}>
                        {
                            weather.forecast.forecastday.map((entry, index) => {
                                const date = new Date(entry.date);
                                const dayName = date.toLocaleDateString('en', {weekday: "long"})
                                    .split(',')[0];
                                return (
                                    <View key={index}
                                          className="flex justify-center items-center w-24 py-3 mr-4">
                                        <Image source={iconMappings[entry.day.condition.text || 'other']} className="w-12 h-12 mb-2"/>
                                        <Text className="text-white">{entry.day.avgtemp_c}°</Text>
                                        <Text className="text-white">{dayName}</Text>
                                    </View>

                                )
                            })
                        }
                    </ScrollView>
                </>}
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    androidSafeArea: {
        paddingTop: Platform.OS === 'android' ? 70 : 0
    }
});
