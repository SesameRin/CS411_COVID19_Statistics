# Stage 3 : Database Design

In this stage, we will handle the following objectives: 

1. Create a release with the correct tag for your submission and submit it on canvas (-2% for incorrect release)
2. Does not have a submission located within the doc folder (-0.5%)
3. Database implementation is worth 7% and is graded (as a group) as follows:
   1. +3% for implementing the database tables locally or on GCP, you should provide a screenshot of the **connection** (i.e. showing your terminal/command-line information)
   2. +2.5% for providing the DDL commands for your tables. (-0.5% for each mistake)
   3. +1.5% for inserting at least 1000 rows in the tables. (You should do a **count** query to show this, 1% for each table)
4. Advanced Queries are worth 7% and are graded (as a group) as follows:
   1. +5% for developing **two** advanced queries (see point 4 for this stage, 2.5% each)
   2. +2% for providing screenshots with the top 15 rows of the advanced query results (1% **each**)
5. Indexing Analysis is worth 8% and is graded (as a group) as follows:
   1. +3% on trying at least **three different indexing designs** (excluding the default index) for each advanced query.
   2. +4% on the indexing analysis reports **which includes screenshots of the EXPLAIN ANALYZE commands**.
   3. +1% on the accuracy and thoroughness of the **analyses**.

## Data Base Configuration

In this whole project, we resort to GCP (Google Cloud Platform) to establish and store our data.

The data base connection should be formed in following steps.

### Step 1 : Adding Our IP address to GCP

<img src="pics\image-20230301234633040.png" alt="image-20230301234633040" style="zoom:50%;" />

### Step 2 : Form connection using remote IP address

<img src="pics\image-20230301200050464.png" alt="image-20230301200050464" style="zoom: 33%;" />

### Step 3 : Connect as root, look at tables

In workbench, the tables can be directly looked in side bars. And can be manipulated using Workbench shortcuts and SQL commands.

<img src="pics\image-20230301200223365.png" alt="image-20230301200223365" style="zoom:50%;" />

### Step 4 : Verify Connection on Remote Side

What if you're afraid your changes will always be local side, that is, not synced with GCP? 

* We can use GCP shell to verify your changes.

<img src="pics\image-20230301200815034.png" alt="image-20230301200815034" style="zoom:50%;" />

<img src="pics\image-20230301200826909.png" alt="image-20230301200826909" style="zoom:50%;" />

## Data Base Creation and DDL

### Hospital Table

```sql
CREATE TABLE hospital (
    OBJECTID INT NOT NULL PRIMARY KEY,
    HOSPITAL_NAME VARCHAR(255),
    HOSPITAL_TYPE VARCHAR(255),
    HQ_ADDRESS VARCHAR(255),
    HQ_ADDRESS1 VARCHAR(255),
    HQ_CITY VARCHAR(255),
    HQ_STATE VARCHAR(255),
    HQ_ZIP_CODE VARCHAR(255),
    COUNTY_NAME VARCHAR(255),
    STATE_NAME VARCHAR(255),
    STATE_FIPS VARCHAR(255),
    CNTY_FIPS VARCHAR(255),
    FIPS VARCHAR(255),
    NUM_LICENSED_BEDS INT,
    NUM_STAFFED_BEDS INT,
    NUM_ICU_BEDS INT,
    ADULT_ICU_BEDS INT,
    PEDI_ICU_BEDS INT,
    BED_UTILIZATION FLOAT,
    AVG_VENTILATOR_USAGE INT,
    Potential_Increase_In_Bed_Capac VARCHAR(255),
    latitude FLOAT,
    longtitude FLOAT
);
```

Which will generate following table (because of my small laptop screen, not all the rows are shown in the screen shot below, but :),you get the point). 

<img src="pics\image-20230301201959586.png" alt="image-20230301201959586" style="zoom:50%;" />

#### Rows & Counts

<img src="pics\image-20230301201439100.png" alt="image-20230301201439100" style="zoom:50%;" />

<img src="pics\image-20230301201551316.png" alt="image-20230301201551316" style="zoom:50%;" />

### Vaccination 

```sql
CREATE TABLE vacc (
    vacc_id INT NOT NULL PRIMARY KEY,
    date DATE,
    location VARCHAR(255),
    total_vaccinations BIGINT,
    total_distributed BIGINT,
    people_vaccinated BIGINT,
    people_fully_vaccinated_per_hundred FLOAT,
    total_vaccinations_per_hundred FLOAT,
    people_fully_vaccinated BIGINT,
    people_vaccinated_per_hundred FLOAT,
    distributed_per_hundred FLOAT,
    daily_vaccinations_raw BIGINT,
    daily_vaccinations BIGINT,
    daily_vaccinations_per_million BIGINT,
    share_doses_used FLOAT
);
```

which will generate the following table

<img src="pics\image-20230301202541536.png" alt="image-20230301202541536" style="zoom:50%;" />

#### Rows & Counts

<img src="pics\image-20230301202648763.png" alt="image-20230301202648763" style="zoom:50%;" />

<img src="pics\image-20230301202727739.png" alt="image-20230301202727739" style="zoom:50%;" />

### Papers

```sql
CREATE TABLE publication_data (
    paper_id INT NOT NULL PRIMARY KEY,
    cord_uid VARCHAR(255),
    sha VARCHAR(255),
    source_x VARCHAR(255),
    title VARCHAR(255),
    doi VARCHAR(255),
    pmcid VARCHAR(255),
    pubmed_id VARCHAR(255),
    license VARCHAR(255),
    abstract TEXT,
    publish_time DATE,
    authors VARCHAR(255),
    journal VARCHAR(255),
    mag_id VARCHAR(255),
    who_covidence_id VARCHAR(255),
    arxiv_id VARCHAR(255),
    pdf_json_files VARCHAR(255),
    pmc_json_files VARCHAR(255),
    url VARCHAR(255),
    s2_id VARCHAR(255)
);
```

<img src="pics\image-20230301203050229.png" alt="image-20230301203050229" style="zoom:50%;" />

#### Rows & Counts

AH HA! 160k rows! We merged 4 tables into this one.

<img src="pics\image-20230301203151286.png" alt="image-20230301203151286" style="zoom:50%;" />

<img src="pics\image-20230307103214760.png" alt="image-20230307103214760" style="zoom: 67%;" />

### states_daily
```sql
CREATE TABLE states_daily (
  date VARCHAR(255),
  state VARCHAR(255),
  positive INT,
  probableCases INT,
  negative INT,
  pending INT,
  totalTestResultsSource VARCHAR(255),
  totalTestResults INT,
  hospitalizedCurrently INT,
  hospitalizedCumulative INT,
  inIcuCurrently INT,
  inIcuCumulative INT,
  onVentilatorCurrently INT,
  onVentilatorCumulative INT,
  recovered INT,
  lastUpdateEt VARCHAR(255),
  dateModified VARCHAR(255),
  checkTimeEt VARCHAR(255),
  death INT,
  hospitalized INT,
  hospitalizedDischarged INT,
  dateChecked VARCHAR(255),
  totalTestsViral INT,
  positiveTestsViral INT,
  negativeTestsViral INT,
  positiveCasesViral INT,
  deathConfirmed INT,
  deathProbable INT,
  totalTestEncountersViral INT,
  totalTestsPeopleViral INT,
  totalTestsAntibody INT,
  positiveTestsAntibody INT,
  negativeTestsAntibody INT,
  totalTestsPeopleAntibody INT,
  positiveTestsPeopleAntibody INT,
  negativeTestsPeopleAntibody INT,
  totalTestsPeopleAntigen INT,
  positiveTestsPeopleAntigen INT,
  totalTestsAntigen INT,
  positiveTestsAntigen INT,
  fips VARCHAR(255),
  positiveIncrease INT,
  negativeIncrease INT,
  total INT,
  totalTestResultsIncrease INT,
  posNeg INT,
  deathIncrease INT,
  hospitalizedIncrease INT,
  PRIMARY KEY (date,state)
);
```

<img src="pics\image-20230307104726231.png" alt="image-20230307104726231" style="zoom:80%;" />



#### Rows & Counts

<img src="pics\image-20230307103443154.png" alt="image-20230307103443154" style="zoom:67%;" />

<img src="pics\image-20230307103530599.png" alt="image-20230307103530599" style="zoom:80%;" />

### States

```sql
CREATE TABLE States(
  FIPS INT NOT NULL PRIMARY KEY,
  State_Name VARCHAR(255),
  State_Abbr VARCHAR(255),
  Latitude FLOAT,
  Longitude FLOAT,
  pop2022 BIGINT,
  percent_of_US FLOAT,
  density_per_Mi_square FLOAT,
  GrowthRate FLOAT,
  Growth INT,
  Land_Area BIGINT,
  Rank_by_pop INT
);
```

<img src="pics\image-20230307104812792.png" alt="image-20230307104812792" style="zoom:120%;" />



#### Rows & Counts


<img src="pics\image-20230307104246706.png" alt="image-20230307104246706" style="zoom:80%;" />

<img src="pics\image-20230307104352086.png" alt="image-20230307104352086" style="zoom:80%;" />

## Advanced Queries

Advanced Queries come from tough problems. 

### Advanced Query 1

* We want to find, the state, average bed utilization in  each state, the daily vaccination per million for each state.
* Because of the columns in vaccination tables is not only for states, we need to filter out those locations that are not states.
* Order the result by ascending state names

```sql
SELECT location, bed_utl, vacc_ratio
FROM
(
SELECT location, AVG(BED_UTILIZATION) AS bed_utl, AVG(daily_vaccinations_per_million) AS vacc_ratio
FROM vacc LEFT OUTER JOIN hospital
ON (vacc.location = hospital.STATE_NAME)
GROUP BY location
) AS tab1
WHERE bed_utl IS NOT NULL and vacc_ratio IS NOT NULL
ORDER BY location
;
```

<img src="pics\image-20230301224517770.png" alt="image-20230301224517770" style="zoom:80%;" />

#### Skills used 

- Join of multiple relations
- Aggregation via GROUP BY
- Subqueries

#### Explain Analysis

```sql
EXPLAIN ANALYZE SELECT location, bed_utl, vacc_ratio
FROM
(
SELECT location, AVG(BED_UTILIZATION) AS bed_utl, AVG(daily_vaccinations_per_million) AS vacc_ratio
FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital
ON (covid_trail1.vacc.location = covid_trail1.hospital.STATE_NAME)
GROUP BY location
) AS tab1
WHERE bed_utl IS NOT NULL and vacc_ratio IS NOT NULL;
```

##### Original

<img src="pics\image-20230301231413681.png" alt="image-20230301231413681" style="zoom:67%;" />

We redirect the output to the textbox below

```plain text
'-> Table scan on tab1  (cost=2.50..2.50 rows=0) (actual time=0.001..0.006 rows=51 loops=1)\n    -> Materialize  (cost=2.50..2.50 rows=0) (actual time=5081.604..5081.617 rows=51 loops=1)\n
-> Filter: ((avg(hospital.BED_UTILIZATION) is not null) and (avg(vacc.daily_vaccinations_per_million) is not null))  (actual time=5081.456..5081.517 rows=51 loops=1)\n            
-> Table scan on <temporary>  (actual time=0.002..0.041 rows=65 loops=1)\n                
-> Aggregate using temporary table  (actual time=5081.416..5081.459 rows=65 loops=1)\n                    
-> Left hash join (<hash>(hospital.STATE_NAME)=<hash>(vacc.location)), extra conditions: (hospital.STATE_NAME = vacc.location)  (cost=31804270.54 rows=317736540) (actual time=4.167..1447.596 rows=4948812 loops=1)\n                        
-> Table scan on vacc  (cost=4934.75 rows=48465) (actual time=0.048..34.932 rows=49700 loops=1)\n                        
-> Hash\n                            
-> Table scan on hospital  (cost=0.65 rows=6556) (actual time=0.045..2.693 rows=6638 loops=1)\n'
```

##### After trying combination of 

```sql
CREATE INDEX idx_vacc_locationa ON covid_trail1.vacc (location);
CREATE INDEX idx_hospital_location ON covid_trail1.hospital (STATE_NAME);
DROP INDEX ind_loc ON covid_trail1.vacc;
DROP INDEX idx_hospital_location ON covid_trail1.hospital;
SHOW INDEX FROM covid_trail1.hospital;
SHOW INDEX FROM covid_trail1.vacc;
```

We obtained this for adding index for **vaccination location**, that is by adding

```sql
CREATE INDEX idx_vacc_locationa ON covid_trail1.vacc (location);
```



<img src="pics\image-20230301195807147.png" alt="image-20230301231753348" style="zoom:80%;" />

```
'-> Table scan on tab1  (cost=2.50..2.50 rows=0) (actual time=0.001..0.005 rows=51 loops=1)\n    
-> Materialize  (cost=2.50..2.50 rows=0) (actual time=4949.049..4949.056 rows=51 loops=1)\n        
-> Filter: ((avg(hospital.BED_UTILIZATION) is not null) and (avg(vacc.daily_vaccinations_per_million) is not null))  (actual time=4948.891..4948.950 rows=51 loops=1)\n           
-> Table scan on <temporary>  (actual time=0.002..0.039 rows=65 loops=1)\n                
-> Aggregate using temporary table  (actual time=4948.883..4948.924 rows=65 loops=1)\n                    
-> Left hash join (<hash>(hospital.STATE_NAME)=<hash>(vacc.location)), extra conditions: (hospital.STATE_NAME = vacc.location)  (cost=31804270.54 rows=317736540) (actual time=4.208..1444.631 rows=4948812 loops=1)\n                       
-> Table scan on vacc  (cost=4934.75 rows=48465) (actual time=0.055..31.385 rows=49700 loops=1)\n                        
-> Hash\n                            
-> Table scan on hospital  (cost=0.65 rows=6556) (actual time=0.039..2.752 rows=6638 loops=1)\n'

```

Then for **both adding index for vaccination locations and hospital state names** we have the following data, redirecting the data from workbench, we have : 

```sql
CREATE INDEX idx_vacc_locationa ON covid_trail1.vacc (location);
CREATE INDEX idx_hospital_location ON covid_trail1.hospital (STATE_NAME);
```



<img src="pics\image-20230301230144987.png" alt="image-20230301230144987" style="zoom:67%;" />

```
'-> Table scan on tab1  (cost=2.50..2.50 rows=0) (actual time=0.001..0.005 rows=51 loops=1)\n    
-> Materialize  (cost=2.50..2.50 rows=0) (actual time=10335.002..10335.009 rows=51 loops=1)\n        
-> Filter: ((avg(hospital.BED_UTILIZATION) is not null) and (avg(vacc.daily_vaccinations_per_million) is not null))  (actual time=10334.878..10334.935 rows=51 loops=1)\n            
-> Table scan on <temporary>  (actual time=0.002..0.036 rows=65 loops=1)\n                
-> Aggregate using temporary table  (actual time=10334.871..10334.909 rows=65 loops=1)\n                    
-> Nested loop left join  (cost=6427198.06 rows=5884010) (actual time=0.168..6670.202 rows=4948812 loops=1)\n                        
-> Table scan on vacc  (cost=4934.75 rows=48465) (actual time=0.060..27.467 rows=49700 loops=1)\n                        
-> Index lookup on hospital using idx_hospital_location (STATE_NAME=vacc.location)  (cost=120.37 rows=121) (actual time=0.011..0.126 rows=99 loops=49700)\n'
```

We further optimize this by using

```sql
CREATE INDEX idx_vacc_location ON covid_trail1.vacc (location, daily_vaccinations_per_million);
CREATE INDEX idx_hospital_location ON covid_trail1.hospital (STATE_NAME, BED_UTILIZATION);
```



<img src="pics\image-20230301232549723.png" alt="image-20230301232549723" style="zoom:80%;" />

```
'-> Table scan on tab1  (cost=0.01..73552.62 rows=5884010) (actual time=0.003..0.008 rows=51 loops=1)\n    
-> Materialize  (cost=2489702.82..2563255.44 rows=5884010) (actual time=3856.713..3856.721 rows=51 loops=1)\n        
-> Filter: ((avg(hospital.BED_UTILIZATION) is not null) and (avg(vacc.daily_vaccinations_per_million) is not null))  (cost=1901301.80 rows=5884010) (actual time=71.953..3856.056 rows=51 loops=1)\n            
-> Group aggregate: avg(hospital.BED_UTILIZATION), avg(vacc.daily_vaccinations_per_million)  (cost=1901301.80 rows=5884010) (actual time=71.944..3855.789 rows=65 loops=1)\n                
-> Nested loop left join  (cost=1312900.79 rows=5884010) (actual time=0.120..2590.959 rows=4948812 loops=1)\n                    -> Index scan on vacc using idx_vacc_location  (cost=4934.75 rows=48465) (actual time=0.081..16.789 rows=49700 loops=1)\n      
-> Index lookup on hospital using idx_hospital_location (STATE_NAME=vacc.location)  (cost=14.85 rows=121) (actual time=0.004..0.045 rows=99 loops=49700)\n'

```

#### Reasoning and Analysis

Adding an index on the `location` column in both tables `covid_trail1.vacc` and `covid_trail1.hospital` can help speed up the join operation and make the search more efficient. This is because the `location` column is used as a join condition in the query. If you look at the data we have when we do a join, it comes from `31804270` to `6427198` as for cost.

In addition, to optimize the search even further, we can add composite indexes on the `BED_UTILIZATION` and `daily_vaccinations_per_million` columns, which are used in the aggregate functions in the subquery, and it also affects join, which you can also see it from the data. `31804270` to `1312900` is a giant leap.

These indexes will allow MySQL to retrieve the necessary data for the `AVG` function more efficiently, without having to perform a full table scan. By including the `BED_UTILIZATION` and `daily_vaccinations_per_million` columns in the index, we can avoid reading data from the table and rely on the index data instead, resulting in faster search times.

It's important to note that adding too many indexes can also slow down write operations, so it's best to evaluate the tradeoff between read and write performance when designing indexes. 

In this case, since the tables are not expected to have frequent updates, adding these indexes is a reasonable optimization.

### Advanced Query 2

- This query counts the number of hospitals in each one of the states. 
- The reason why the join is necessary is because the hospital file includes hospitals from other places outside of the 50 traditional states like british colombia and the virgin islands and we just want the 50 core states.


```sql
SELECT covid_trail1.States.State_Name, count(covid_trail1.hospital.HOSPITAL_NAME) as num_hospitals
FROM covid_trail1.hospital JOIN covid_trail1.States USING (State_Name)
GROUP BY covid_trail1.States.State_Name
ORDER BY covid_trail1.States.State_Name
;
```

<img src="pics\query_result.png" style="zoom:80%;" />

#### Skills used 

- Join of multiple relations
- Aggregation via GROUP BY

#### Explain Analysis

```sql
EXPLAIN ANALYZE
SELECT covid_trail1.States.State_Name, count(covid_trail1.hospital.HOSPITAL_NAME) as num_hospitals
FROM covid_trail1.hospital JOIN covid_trail1.States USING (State_Name)
GROUP BY covid_trail1.States.State_Name
ORDER BY covid_trail1.States.State_Name
;
```

##### Original

<img src="pics\original_index.png" style="zoom:67%;" />

<img src="pics\analyze_original.png" style="zoom:67%;" />

##### Set States.State_Name as Index

```sql
CREATE INDEX idx_state_name ON covid_trail1.States (State_Name);
```

adding the States.State_Name as index

<img src="pics\state_name_index.png" style="zoom:80%;" />

##### Set Index in hospital table

**add hospital.hospital_name as index**

```sql
DROP INDEX idx_state_name ON covid_trail1.States;
CREATE INDEX idx_hospital_name ON covid_trail1.hospital (hospital_name);
```

<img src="pics\hospital_name_index.png" style="zoom:80%;" />

**then add hospital.STATE_NAME as index**

```sql
CREATE INDEX idx_hospital_state_name ON covid_trail1.hospital (STATE_NAME);
```

<img src="pics\hospital_state_name_index.png" style="zoom:80%;" />


#### Reasoning and Analysis

In the second advanced query, adding indexes for state_name column in States or hospital table would decrease the cost a lot, but the actual running time still increases. 

Adding the hospital_name index has little effect on this query. Comparing the original result and the result after adding hospital.hospital_name index, we can see that the cost of join and filtering doesn't change and the aggregate process is a bit shorter (9.989 compared to 10.321). The main reason is that count operation would still take the same amount of time with or without indexing.

Adding the State_Name as index reduces the cost greatly, but the actual running time increases. Comparing the original result and the result after adding State_Name column in either States or hospital table as index, the cost decreases greatly (33319 to 3019 or 2162), because adding state_name as index would make ordering on state_name more efficient. However, the acutal time still increases after adding the index. We guess it's because that adding indexes would produce storage space and maintenance costs. In this case, the overhead of the index can outweigh the benefits, which leads to longer actual execution times, even if the cost of the query plan is lower.
