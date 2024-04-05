const getWeekdayHTML = (value) => {
    const weekdayBlock = document.createElement('div');

    weekdayBlock.classList.add('date-weekday');

    weekdayBlock.innerHTML = value;

    return weekdayBlock;
}

const getFullDateHTML = (day, month, year) => {
    const dateBlock = document.createElement('div');
    dateBlock.classList.add('date-full');

    const dayAndMonthEl = document.createElement('span');
    dayAndMonthEl.classList.add('date-full__day-and-month');
    dayAndMonthEl.innerHTML = month;

    const yearEl = document.createElement('span');
    yearEl.classList.add('date-full__year');
    yearEl.innerHTML = year;

    dateBlock.append(dayAndMonthEl);
    dateBlock.append(yearEl);

    return dateBlock;
}

const displayDate = () => {
    const nowDate = new Date();
    const weekdayString = nowDate.toLocaleString('ru-RU', { weekday: 'long' });
    const day = nowDate.getDate();
    const monthString = nowDate.toLocaleString('ru-RU', { month: 'long', day: 'numeric' });
    const year = nowDate.getFullYear();

    const dateWrapper = document.createElement('div');

    dateWrapper.append(getWeekdayHTML(weekdayString));
    dateWrapper.append(getFullDateHTML('', monthString, year));

    const dateEl = document.querySelector('#dateInfo');
    dateEl?.append(dateWrapper)
}

const getTimeHTML = () => {
    const nowDate = new Date();

    const timeBlock = document.createElement('div');
    timeBlock.classList.add('time');

    const hour = nowDate.getHours();
    const hourEl = document.createElement('span');
    hourEl.classList.add('time__hour');
    hourEl.innerText = hour < 10 ? `0${hour}` : hour;

    timeBlock.append(hourEl);

    const delimiterEl = document.createElement('span');
    delimiterEl.classList.add('time__delimiter');
    delimiterEl.innerText = ':';

    timeBlock.append(delimiterEl);

    const minutes = nowDate.getMinutes();
    const minutesEl = document.createElement('span');
    minutesEl.classList.add('time__hour');
    minutesEl.innerText = minutes < 10 ? `0${minutes}` : minutes;

    timeBlock.append(minutesEl);

    return timeBlock;

}
const displayTime = () => {
    const timeEl = document.querySelector('#timeInfo');

    const fillTimeEl = () => {
        if (!timeEl) {
            return;
        }

        timeEl.innerHTML = '';
        timeEl.append(getTimeHTML());
    }

    fillTimeEl();

    setInterval(fillTimeEl, 60000)
}

const getLocationKey = async () => {
    try {
        const response = await fetch('https://dataservice.accuweather.com/locations/v1/cities/search?' + new URLSearchParams({
            apikey: 'yXonieY7c61tHdWj8YWpXhEezUnSA0SW',
            // TODO: доработать получение города из геолокации пользователя
            q: 'Volgograd',
        }));

        const responseToJSON = await response.json();
        const locationKey = responseToJSON?.[0].Key;

        return locationKey;

    } catch (e) {
        throw new Error(e);
    }
}

const requestWeatherInfo = async () => {
    try {
        // volgograd 296363
        const locationKey = await getLocationKey();
        const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?` + new URLSearchParams({
            apikey: 'yXonieY7c61tHdWj8YWpXhEezUnSA0SW',
            language: 'ru'
        }));

        const responseToJSON = await response.json();

        return responseToJSON[0]

    } catch(e) {
        console.error(e);
    }
}

const getWeatherInfoHTML = async () => {
    const weatherInfoEl = document.createElement('div');
    weatherInfoEl.classList.add('weather');

    const {
        Temperature,
        IconPhrase
    } = await requestWeatherInfo();

    const celsiusTemperature = Math.floor((Temperature.Value - 32) / 1.79999999);

    const temperatureEl = document.createElement('div');
    temperatureEl.classList.add('weather__temperature');
    temperatureEl.innerText = `${celsiusTemperature}°`;

    weatherInfoEl.append(temperatureEl);

    const weatherDescription = document.createElement('div');
    weatherDescription.classList.add('weather__description');

    weatherDescription.innerText = IconPhrase;

    weatherInfoEl.append(weatherDescription);

    return weatherInfoEl;
}

const displayWeatherInfo = async () => {
    const weatherBlock = document.querySelector('#weatherInfo');


    weatherBlock?.append(await getWeatherInfoHTML());
}

document.addEventListener('DOMContentLoaded', () => {
    displayTime();
    displayDate();
    displayWeatherInfo();
});