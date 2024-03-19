let COMMUNICATION = 'http://34.16.138.110:8443/';

let ADQ1API = '/adquery1';
const form = document.getElementById('state-form');
const stateInput = document.getElementById('state-input');
const stateData = document.getElementById('state-data');

let ADQ2API = '/adquery2';
const form2 = document.getElementById('hospital-form');
const hospitalInput = document.getElementById('hospital-input');
const hospitalData = document.getElementById('hospital-data');

let ADQ2APITrig = '/adquery2Trigger';
const form2Trig = document.getElementById('hospital-form-trigger');
const hospitalInputTrig = document.getElementById('hospital-input-trigger');
const hospitalDataTrig= document.getElementById('hospital-data-trigger');

let MAPAPI = '/map';

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const state = stateInput.value;

    // Create a new instance of axios
    const instance = axios.create({ baseURL: COMMUNICATION });

    // Make a POST request to the server to get the data for the selected state
    // my very lousy implementation of token handling
    return new Promise((resolve, reject) => {
        var token = localStorage.getItem('token');
        var username = localStorage.getItem('username');
        // console.log(token, username);
        var myheader = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        // console.log(token, username);
        if (token && username) {
            myheader = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'username': username
                }
            };
        }
        console.log(myheader);
        instance.post(ADQ1API, { stateName: state }, myheader).then(response => {
            var data = response.data;

            // Display the data for the selected state
            stateData.innerHTML = `
            <p>Bed utilization: ${data.bed_utl}</p>
            <p>Vaccination ratio: ${data.vacc_ratio}</p>
            `;

            resolve(data);
        })
            .catch(error => {
                console.error('Error fetching state data:', error);
                reject(error);
            });
    });
});

form2.addEventListener('submit', (event) => {
    event.preventDefault();

    const hospital = hospitalInput.value;

    // Create a new instance of axios
    const instance = axios.create({ baseURL: COMMUNICATION });

    // Make a POST request to the server to get the data for the selected state
    // my very lousy implementation of token handling
    return new Promise((resolve, reject) => {
        var token = localStorage.getItem('token');
        var username = localStorage.getItem('username');
        // console.log(token, username);
        var myheader = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        // console.log(token, username);
        if (token && username) {
            myheader = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'username': username
                }
            };
        }
        console.log(myheader);

        instance.post(ADQ2API, { stateName: hospital }, myheader).then(response => {
            var data = response.data;
            console.log(data);

            // Display the data for the hospitals
            hospitalData.innerHTML = `
            <p>State/Location: ${data.State_Name}</p>
            <p>Number of Hospitals: ${data.num_hospitals}</p>            `;

            resolve(data);
        })
            .catch(error => {
                console.error('Error fetching hospital data:', error);
                reject(error);
            });

    });
});

form2Trig.addEventListener('submit', (event) => {
    event.preventDefault();

    const hospital = hospitalInputTrig.value;

    // Create a new instance of axios
    const instance = axios.create({ baseURL: COMMUNICATION });

    // Make a POST request to the server to get the data for the selected state
    // my very lousy implementation of token handling
    return new Promise((resolve, reject) => {
        var token = localStorage.getItem('token');
        var username = localStorage.getItem('username');
        // console.log(token, username);
        var myheader = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        // console.log(token, username);
        if (token && username) {
            myheader = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'username': username
                }
            };
        }
        console.log(myheader);

        instance.post(ADQ2APITrig, { stateName: hospital }, myheader).then(response => {
            var data = (response.data)[0];
            console.log(data);

            // Display the data for the hospitals
            hospitalDataTrig.innerHTML = `
            <p>Number of Satisfying States: ${data.numStates}</p>
            <p>Vaccination Rate: ${data.VaccinationRate}</p>  
            <p>Average Number Hospitals: ${data.AvNumHospitals}</p>           `;

            resolve(data);
        })
            .catch(error => {
                console.error('Error fetching hospital data:', error);
                reject(error);
            });

    });
});

// each element in data is like
// {
//     "location": "Wisconsin",
//     "Latitude": 43.7844,
//     "Longitude": -88.7879,
//     "HOSP_NUM": 118116,
//     "NUM_ICU_BEDS": "1224392",
//     "NUM_LICENSED_BEDS": "13946952",
//     "BED_UTILIZATION": 0.3941969096271041,
//     "Potential_Increase_In_Bed_Capac": 3472456,
//     "total_vaccinations_per_hundred": 120.4996939949962,
//     "people_fully_vaccinated_per_hundred": 49.25078401368389
// },
// we need to extract the lat, long, stateName, HOSP_NUM, NUM_ICU_BEDS, NUM_LICENSED_BEDS
// , BED_UTILIZATION, Potential_Increase_In_Bed_Capac, total_vaccinations_per_hundred, people_fully_vaccinated_per_hundred
// and store them in a variable
let locations = []; // locations = [{lat : , lng :}, ...]

// windowInfos = [{location : , HOSP_NUM : , NUM_ICU_BEDS : , NUM_LICENSED_BEDS : , 
// BED_UTILIZATION : , Potential_Increase_In_Bed_Capac : , total_vaccinations_per_hundred : , people_fully_vaccinated_per_hundred : }, ...]
let windowInfos = [];


function initMap() {
    const spinner = document.getElementById('spinner');
    console.log(spinner);
    spinner.style.display = 'inline-block';
    axios.get(MAPAPI).then((response) => {
        // return response.data in form of (lat, long, stateName, 
        // HOSP_NUM, NUM_ICU_BEDS, NUM_LICENSED_BEDS
        // , BED_UTILIZATION, Potential_Increase_In_Bed_Capac,
        // total_vaccinations_per_hundred, people_fully_vaccinated_per_hundred)
        // and we need to store them in a variable
        spinner.style.display = 'none';
        var data = response.data;

        
        for (var i = 0; i < data.length; i++) {
            locations.push({ lat: data[i].Latitude, lng: data[i].Longitude });
        }
        console.log(locations);
        
        for (var i = 0; i < data.length; i++) {
            windowInfos.push({
                location: data[i].location,
                HOSP_NUM: data[i].HOSP_NUM,
                NUM_ICU_BEDS: data[i].NUM_ICU_BEDS,
                NUM_LICENSED_BEDS: data[i].NUM_LICENSED_BEDS,
                BED_UTILIZATION: data[i].BED_UTILIZATION,
                Potential_Increase_In_Bed_Capac: data[i].Potential_Increase_In_Bed_Capac,
                total_vaccinations_per_hundred: data[i].total_vaccinations_per_hundred,
                people_fully_vaccinated_per_hundred: data[i].people_fully_vaccinated_per_hundred
            });
        }
        console.log(windowInfos); 

        const centerUS = { lat: 37.09024, lng: -95.712891 };
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 3,
            center: centerUS,
        });
        const infoWindow = new google.maps.InfoWindow({
            content: "",
            disableAutoPan: true,
        });
        // labels are locations in windowInfos
        const labels = windowInfos.map((location) => location.location);
        console.log(labels);

        // Add some markers to the map.
        const markers = locations.map((position, i) => {
            const info = windowInfos[i % windowInfos.length];
            const text = `
              <div>
                <div>${info.location}</div>
                <div>Hospitals: ${info.HOSP_NUM}</div>
                <div>ICU Beds: ${info.NUM_ICU_BEDS}</div>
                <div>Licensed Beds: ${info.NUM_LICENSED_BEDS}</div>
                <div>Bed Utilization: ${info.BED_UTILIZATION}</div>
                <div>Potential Increase in Bed Capacity: ${info.Potential_Increase_In_Bed_Capac}</div>
                <div>Total Vaccinations per Hundred: ${info.total_vaccinations_per_hundred}</div>
                <div>Fully Vaccinated per Hundred: ${info.people_fully_vaccinated_per_hundred}</div>
              </div>
            `;
            const label = labels[i % labels.length];
            const marker = new google.maps.Marker({
              position,
              label: label,
            });
          
            // Add a click listener to the marker to display the info window
            marker.addListener('click', () => {
              infoWindow.setContent(text);
              infoWindow.open(map, marker);
            });
          
            return marker;
        });
        console.log(markers);
        // Add a marker clusterer to manage the markers.
        new markerClusterer.MarkerClusterer({ map, markers });

    }).catch((error) => {
        console.error(error);
        spinner.style.display = 'none';
    });

    
}

window.initMap = initMap;

document.addEventListener("DOMContentLoaded", () => {
    
});

