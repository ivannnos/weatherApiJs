const link = "http://api.weatherstack.com/current?access_key=80af45e7ed4e8885e71f6f3a774b1cac"

const root = document.getElementById('root');
const text = document.getElementById('text-input');
const formSubmitBy = document.getElementById('form');
const popup = document.getElementById('popup')
let store = {
    city: "Minsk",
    humidity:0,
    observationTime : '00:00 AM',
    visibility: 0,
    isDay: "yes",
    description: "",
    properties: {
      cloudcover: {},
      humidity: {},
      windSpeed: {},
      pressure: {},
      uvIndex: {},
      visibility: {},
    }
}

const fetchData = async() => {
    const query = store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json()
    const {
        current : {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions :description,
        wind_speed: windSpeed
        },
        location : {
          name
        }
    } = data

    store = {
        ...store,
        temperature,
        observationTime,
        isDay,
        city: name,
        description : description[0],
        properties: {
          cloudcover: {
            title: "cloudcover",
            value: `${cloudcover}%`,
            icon: "cloud.png",
          },
          humidity: {
            title: "humidity",
            value: `${humidity}%`,
            icon: "humidity.png",
          },
          windSpeed: {
            title: "wind speed",
            value: `${windSpeed} km/h`,
            icon: "wind.png",
          },
          pressure: {
            title: "pressure",
            value: `${pressure} %`,
            icon: "gauge.png",
          },
          uvIndex: {
            title: "uv Index",
            value: `${uvIndex} / 100`,
            icon: "uv-index.png",
          },
          visibility: {
            title: "visibility",
            value: `${visibility}%`,
            icon: "visibility.png",
          },
        }
    }

    renderComponent()
    
};

const getImage = (description) => {
  const desc = description.toLowerCase();
  return (desc === 'partly cloudy') ? 'partly.png' : (desc === 'cloud') ? 'cloud.png' : (desc === 'fog') ? 'fog.png' : (desc === 'sunny') ? 'sunny.png' : 'the.png';
}

const renderProperty = (properties) => {
  return Object.values(properties).map(({title, value, icon}) => {
    return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
        </div>`;
  }).join("")
}

const markup = () =>{
    const { city, description, observationTime, temperature, isDay, properties} = store

    const containerClass = isDay === 'yes' ? 'is-day' : '';
    
    

    return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city" id="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(description)}" alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;
}

const toggleClass = () => {
  popup.classList.toggle('active')
}

const renderComponent = () => {
    root.innerHTML = markup();
    const city = document.getElementById("city")
    city.addEventListener('click', toggleClass);
}

const handleInput = (e) => {
  store.city  = e.target.value;
}

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;
  fetchData()
  toggleClass()
}

form.addEventListener('submit', handleSubmit);
text.addEventListener('input', handleInput)
document.querySelector('.popup-close').addEventListener('click', ()=>{
  popup.classList.toggle('active');
})


fetchData()