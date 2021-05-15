// Client Side JS
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

const current = document.querySelector('.current');
const week = document.querySelector('.week');

const currentTemp = document.querySelector('.current-temp');
const currentFeel = document.querySelector('.current-feel');
const currentDesc = document.querySelector('.current-desc');
const currentIcon = document.querySelector('.current-icon');


const weekDate = document.querySelector('.week-date');
const weekMin = document.querySelector('.week-min');
const weekMax = document.querySelector('.week-max');
const weekDesc = document.querySelector('.week-desc');
const weekIcon = document.querySelector('.week-icon');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const currentHeading = document.querySelector('.current-heading');
const weekHeading = document.querySelector('.week-heading');

const message = document.querySelector('.message');

const displayCurrent = (data,location) => {

    current.classList.remove("hide");
    message.textContent = "";

    currentHeading.textContent = `Current Weather in ${location}`;
    currentTemp.textContent = `${Math.ceil(data.temp)}\u00B0C`;
    currentFeel.textContent = `Feels like ${data.feels_like}\u00B0C`;
    currentDesc.textContent = `${data.weather.desc}`;
    currentIcon.src = `http://openweathermap.org/img/w/${data.weather.icon}.png`;
};

const getWeek = (data,i) => {
    weekDate.textContent = `${data[i].date}`;
    weekIcon.src = `http://openweathermap.org/img/w/${data[i].weather.icon}.png`;
    weekMin.textContent =  `${Math.ceil(data[i].temp.min)}\u00B0C`;
    weekMax.textContent =  `${Math.ceil(data[i].temp.max)}\u00B0C`;
    weekDesc.textContent = `${data[i].weather.desc}`;
}

const displayWeek = (data,location) => {

    week.classList.remove("hide");

    
    weekHeading.textContent = `Weekly Weather Forecast of ${location} : `;

    let i = 1;

    getWeek(data,i);

    prev.addEventListener('click',() => {
        if(i!=1) i--;
        getWeek(data,i);
    });

    next.addEventListener('click',() => {
        if(i!=7) i++;
        getWeek(data,i);
    });

}

const getForecast = (location) =>{
    fetch(`http://localhost:3000/weather?location=${location}`).then((response) => {
        response.json().then((data)=>{
            if(data.error){
                message.textContent = `${data.error}`
                week.classList.add('hide');
                current.classList.add('hide');
            }else{
                displayCurrent(data.current,data.location);
                displayWeek(data.dailyData,data.location);
            }
        });
    });
};


weatherForm.addEventListener('submit',(e) => {
    e.preventDefault();

    message.textContent = 'Loading...';

    const location = search.value;
    search.value = '';

    getForecast(location);
});