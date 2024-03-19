---
marp : true
theme : gaia
class : invert
---

# Code structure

* index.js : contains main page's content. It concludes 2 search boxes for ADQ1 and ADQ2, and a map.
    * `public/javascripts/index.js` : contains client side code to
        * make a query to database to preprocess the state information.
        * define the map based on the pre-processed information.
    * `routes/index.js` : server side code to 
        * respond to  ADQ1 and ADQ2
        * respond to pre-processing request

---
## SQL Implemenation 
Pre-process information about the states : select related information about each state.

@todo : add transaction and condition on it.

```sql
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
        WHERE Latitude IS NOT NULL and Longitude IS NOT NULL
```

---

### Idea of such preprocessing

* Each query is expensive, so we should NOT query the database when user click on something.

* Instead, we make a query when page is loaded.

What if the query takes too long

```html
    <span id = "spinner" class="loader">
```

we added a spinner in `.ejs` (html)

---


## Draw the map


Look at `/proj/docs/googleMap.md` (just look at googleMap.md) in the same folder as this doc.

It will tell you the information needed to draw something onto screen.

---


## Don't want server to be killed when db returns an error?

When you use `throw err` in a synchronous function like a route handler, it will terminate the server and return an error to the client. To log the error and send a response to the client instead of terminating the server, you can use `console.error` to log the error and then send an error response to the client using `res.status()` and `res.send()`. 

---

Check `routes/index.js` :

```js
    con.query(map_query, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while fetching the data.');
        }

        cache.set('map_data', result);
        res.send(result);
    });
```

---


### Enable transaction

Observations : 

* vacc, hos, state, paper db are read-only

* wrap ADQ with transaction with least protection

* Then add a transaction  in pre-processing SQL with a if statement
    * Create a new table `state_tag` and add corresponding stuff using conditions.







