import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import {fetchLocations, fetchWeather} from "./provider/fetchWeatherProvider";
import {debounce} from "lodash/function";
import {useCallback, useState} from "react";

const CityRow = (props) => {
    return (
        <Text onPress={() => props.onCitySelected(props.name)}>{props.name}</Text>
    );
}

export default function Temp() {

    const [cities, setCities] = useState([]);
    const [showCities, setShowCities] = useState(false)
    const [weather, setWeather] = useState(null);

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
        setWeather(weather);
    };

    const cityHandler = useCallback(debounce(onCityChanges, 1000), []);

    return (
        <View style={styles.container}>
            <TextInput placeholder="Enter city name" onChangeText={cityHandler}/>
            {showCities &&
                <FlatList style={styles.cities} data={cities} renderItem={({item}) =>
                    <CityRow name={item.name} onCitySelected={onCitySelected}/>}
                          keyExtractor={(item) => item.id}/>
            }
            {weather &&
                <Text>Temperature {weather.current.temp_c}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50
    },
    cities: {
        backgroundColor: 'red'
    }
});
