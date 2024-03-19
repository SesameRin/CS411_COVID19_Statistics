# Google Map Integration

https://developers.google.com/maps/documentation/javascript/marker-clustering

API : AIzaSyDY9rEsLBB4aQLiEwZsIbjzjU9BJvpwA54


```
npm install @googlemaps/markerclusterer
```

In router 

```
import { MarkerClusterer } from "@googlemaps/markerclusterer";
```

## Step 1 : Preprocessing data

Pull data from database, then get corresponding 

* $(lat, log)$ tuple
* binded data
    * state name
    * Number of hospital
    * Number of ICU beds
    * Potential Inc in Bed Cap
    * total_vaccinations_per_hundred
    * people_fully_vaccinated_per_hundred

## Step 2 : complete front end layout

* Fill stuff into infoWindow


## Bug detected : searching in data base takes too long

* Add a spinner 

* Cache data (server side)


To cache the results of the database query and serve them from memory for a certain amount of time, you can use an in-memory cache like `Node-cache`. Here's an example of how you can modify your code to cache the results:

1. Install the `Node-cache` package by running the following command in your terminal:

```
npm install node-cache
```

1. Require the `Node-cache` package in your server-side code:

```
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
```

1. Modify your route handler to first check if the data is cached and serve it from memory if it is, otherwise query the database and cache the result:

```
router.get('/map', function (req, res, next) {
    const cachedData = cache.get('map_data');
    if (cachedData) {
        return res.send(cachedData);
    }
    
    const map_query = `
        SELECT location, Latitude, Longitude, HOSP_NUM, NUM_ICU_BEDS,  NUM_LICENSED_BEDS
            , BED_UTILIZATION, Potential_Increase_In_Bed_Capac,
            total_vaccinations_per_hundred, people_fully_vaccinated_per_hundred
        FROM(
            SELECT location, States.Latitude, States.Longitude, COUNT(hospital.OBJECTID) AS HOSP_NUM, SUM(NUM_ICU_BEDS) AS NUM_ICU_BEDS,
            SUM(NUM_LICENSED_BEDS) AS NUM_LICENSED_BEDS, AVG(BED_UTILIZATION) as BED_UTILIZATION, 
            SUM(Potential_Increase_In_Bed_Capac) AS Potential_Increase_In_Bed_Capac, AVG(total_vaccinations_per_hundred) AS total_vaccinations_per_hundred,
            AVG(people_fully_vaccinated_per_hundred) AS people_fully_vaccinated_per_hundred
            FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital ON (vacc.location = hospital.STATE_NAME) 
            LEFT OUTER JOIN covid_trail1.States ON (hospital.STATE_NAME = States.STATE_NAME)
            GROUP BY location,States.Latitude, States.Longitude
        ) AS tab
        WHERE Latitude IS NOT NULL and Longitude IS NOT NULL`;

    con.query(map_query, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while fetching the data.');
        }

        cache.set('map_data', result);
        res.send(result);
    });
});
```

In the above code, the `Node-cache` instance is created with a `stdTTL` (standard time-to-live) of 1 hour, which means that cached items will automatically expire after 1 hour. The `checkperiod` option sets how frequently the cache is checked for expired items.

The route handler first checks if the data is cached using `cache.get()`, and if it is, it serves the cached data and returns from the function. If the data is not cached, the database is queried and the result is cached using `cache.set()`. The result is then sent back to the client.

This way, the first request will query the database and cache the result, and subsequent requests within the next hour will be served from the cache, reducing the number of database queries.

## Error Handling : No `throw error`

When you use `throw err` in a synchronous function like a route handler, it will terminate the server and return an error to the client. To log the error and send a response to the client instead of terminating the server, you can use `console.error` to log the error and then send an error response to the client using `res.status()` and `res.send()`. 