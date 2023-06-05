const apiKey= '3858f425a30c420b8ab60721230506';

const fetchWeather = ({city, days = 7}) => {
    return fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}`)
        .then(response => response.json())
};

const fetchLocations = (city) => {
    return fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`)
        .then(response => response.json())
};

const iconMappings = {
    'Partly cloudy': require('../assets/images/partlycloudy.png'),
    'Moderate rain': require('../assets/images/moderaterain.png'),
    'Patchy rain possible': require('../assets/images/moderaterain.png'),
    'Sunny': require('../assets/images/sun.png'),
    'Clear': require('../assets/images/sun.png'),
    'Overcast': require('../assets/images/cloud.png'),
    'Cloudy': require('../assets/images/cloud.png'),
    'Light rain': require('../assets/images/moderaterain.png'),
    'Moderate rain at times': require('../assets/images/moderaterain.png'),
    'Heavy rain': require('../assets/images/heavyrain.png'),
    'Heavy rain at times': require('../assets/images/heavyrain.png'),
    'Moderate or heavy freezing rain': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain shower': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain with thunder': require('../assets/images/heavyrain.png'),
    'Mist': require('../assets/images/mist.png'),
    'other': require('../assets/images/moderaterain.png')
}

export {
    fetchWeather,
    fetchLocations,
    iconMappings
};
