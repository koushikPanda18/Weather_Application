// const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
// function renderWeather(data){
//         let newPara=document.createElement('p');
//         newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`
//         document.body.appendChild(newPara);
// }

// async function getWeather(){
//     try{
//         let city="Goa";
//         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data=await response.json();
//         console.log("Weather is",data);
    
//         // let newPara=document.createElement('p');
//         // newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`
//         // document.body.appendChild(newPara);

//         //this function is responsible for updating at the UI
//         renderWeather(data);
//     }
//     catch(err){

//     }

// }

// async function getYourWeather(){
//     try{
//         let longitude=88.3952861;
//         let latitude=26.7271012;
//         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         const data=await response.json();
//         console.log("Weather is",data);

//         renderWeather(data);
//     }
//     catch(err){
//         console.log('Error Found',err);
//     }
// }


// function getLocation() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else {
//         console.log("No geoLocation Support");
//     }
// }

// function showPosition(position) {
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }




const userTab=document.querySelector("[your-Weather]");
const searchTab=document.querySelector("[search-weather]");

const userWeather=document.querySelector(".mainContainer");
const grantAccessContainer=document.querySelector(".grantLocationContainer");
const formContainer=document.querySelector(".formContainer");
const loadingContainer=document.querySelector(".loadingContainer");
const userInfoContainer=document.querySelector(".weatherinformation");


let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

// tab switching function
function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!formContainer.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            formContainer.classList.add("active");
        }
        else{
            formContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //now we have came to your weather section ,and need to display the weather.....so cheacking in local storage first for coordinates,if we have to save them there
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});


//checks if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //if local coordinates are not there then grant the location access
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant access container invissible
    grantAccessContainer.classList.remove("active");
    //make loading container vissible
    loadingContainer.classList.add("active");
    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();

        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingContainer.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //at first we have to fetch the element
    const humidity = document.querySelector(".dataHumidity");
    const cityName = document.querySelector(".cityName");
    const countryIcon = document.querySelector(".cityImage");
    const desc = document.querySelector(".cityWeatherDiscription");
    const weatherIcon = document.querySelector(".cityWeatherImage");
    const temp = document.querySelector(".cityTemp");
    const windspeed = document.querySelector(".dataWindspeed");
    const cloudiness = document.querySelector(".dataClouds");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(window.confirm("Allow Location Access...")){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else {
            console.log("No geoLocation Support");
        }
    }

}
function showPosition(position) {

    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton=document.querySelector(".grantAccess");
grantAccessButton.addEventListener('click',()=>{
    getLocation();
});





const searchInput=document.querySelector("[data-SearchInput]");

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}