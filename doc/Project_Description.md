# Project Description

## Data Sources

>  Describe what data is stored in the database.

### Dataset : Primary Data Source

Covid19-lake / rearc-COVID-19-testing-data/csv/us-total-latestCorrelating Regional COVID Statistics and Research Institution Output Trends Across the US

* State Location
* State normal birth/death rate (before 2020)
* State area
* State population
* COVID-19 number of cases
* COVID-19 number of tests
* COVID-19 number of deaths
* COVID-19 Hospital beds
* COVID-19 related number of papers
* COVID-19 papers
* User/Password data
* ...

### Meta Data Secondary Data Source

Meta data that are analyzed from Primary Data Source that contain but not limited to

* COVID-19 Future infection/death rate prediction
* Average infection rate during past d/m/y
* Number of Searched articles/keywords 
* Number of Search per d/m/y
* Number of Users
* Number of Active Users
* ...

## Project Title 

> Project Title

US COVID-19 Trends 

## Project Summary

> Project Summary
>
> What are the basic functions of your web application?

We are going to create a map of the United States that displays the current and past trends of the COVID-19 pandemic. The user will be able to analyze the behavior of the pandemic between different states depending on academic publications that the state is writing and releasing during a specific time period. Our website will extract data from these academic publications and display keywords and trends in an effort to understand the public response. In addition, the user will be able to see the contamination trends by observing how many people are testing positive and negative in each respective state. With these two sets of data/information the user can accurately understand the public understanding and response to the pandemic. 

## Project Description

> Description of an application of your choice
>
> What would be a good creative component (function) that can improve the functionality of your application?

We are going to create a map of the United States that displays the trends of COVID-19 over a specific time period based on the academic publications that are being released by the state. The user can hover their mouse over specific areas/states and view the COVID-19 trends based on the academic publications that state is releasing. We will extract and display key words from these academic publications so that the user can understand common trends of the COVID-19 pandemic in each state respectively. 
In addition, the user will be able to see the amount of people testing positive, testing negative, hospitalized and dying from the COVID-19 pandemic by hovering over specific states on the map. The user will be able to toggle between two settings, “Publications” and “Cases”, to analyze the statistics and common trends of the pandemic on a map of the United States. Our website will extract the most recent data from the COVID-19 data set provided by the TA’s and represent this data using a map. The user will be able to specify specific time periods that they want to better understand. 
Lastly, the users will be able to comment and add additional information based on the data that they extract. Users will be able to discuss trends and share information based on the current status of the COVID-19 pandemic. This will require firebase authentication and user information storage. 
Each of these pieces of information will compliment each other so that people can better understand what the COVID-19 trends were in specific areas of the country during the time periods that the user specifies. 

## Usefulness

> **Usefulness**. Explain as clearly as possible why your chosen application is useful. Make sure to answer the following questions: Are there any similar websites/applications out there? If so, what are they, and how is yours different?

COVID-19 data has been well-explored and extremely well documented over the last years, both by media outlets and scientific researchers. However, what has been investigated to a lesser extent is the ways by which COVID conditions in a single city, county or state influence the types of anti-COVID research surrounding institutions conduct. Are certain regions of the United States more likely to investigate epidemiology, for example, rather than vaccine development on a biochemical level? And if so, are research institutions prone to change their academic focus if their local regions see a rapid growth or decline in COVID cases? We seek to answer these questions by linking medical data with research output trends across the US, yielding insight into preventing or mitigating pandemics in the future.
There are websites that display covid trends in terms of the cases, hospitalizations and deaths but we plan to compliment this information with the common research trends and public response from certain areas. The information on cases is provided to compliment the data on the academic publications and the research response to the covid pandemic. 

## Realness

> **Realness**. Describe what your data is and where you will get it.

COVID-19 data set is based on a “centralized repository of up-to-date and curated datasets on or related to the spread and characteristics of the novel coronavirus (SARS-CoV-2) and its associated illness, COVID-19”. The amount of data and the up-to-date features makes the project able to reflect the real COVID-19 situation accurately. 
The possibility to integrate AI and Machine Learning into representation and updating of our dataset can enhance our understanding of the disease and make it not only accurate in real-time, but also useful for the future. The feedback provided by users can enhance the accuracy and the reliability of the dataset, and the feedback provided by users can improve the accuracy of automatic processes that are involved in the website.

## FUNCTIONALITY

> Description of the **functionality** that your website offers.

### Trending in Map

The users will be able to view the common trends of the COVID-19 pandemic in particular states over the course of a user specified date. The user will interact with a map and hover their mouse over particular areas in an effort to see the common research publications and COVID case behavior. The purpose of this application is to understand how people in certain states were responding and conducting research into the COVID-19 pandemic over the course of varying periods of time. The users will also be able to see the trends of who was being infected and hospitalized and how this influenced the research that people in specific states were conducting. The data for the section of the map that displays the number of cases, hospitalizations, etc. will be extracted from the covid19-lake/rearc-COVID-19-testing-data/csv/states_daily. This will provide us with all the information we need to demonstrate what the COVID trends are for all of the states in the US.  The data is grouped, ordered, and gathered in different ways that requires different database select-based quries & sub-queries.

### Academic Papers Trending

The data for the common trends section of the map will be found at AWS database where we will extract information from the academic publications of each respective state. It allows user to search the papers with related keywords. It synthesizes the user input and absorbes the metadata to give different feedback like the hottest topics that are searched, or the most promising aspect of COVID-19 related research. These require database insertion, deletion, update, trigger, stored procedures. 

### User Interface

The last part of our project which will include creating user accounts and a comment section that will not require any data extraction or data basis. This will be created using some user interface design and firebase authentication to store the user names and passwords of all of the users that create accounts. This also requires DRUB database actions.



## UI MOCKUP

> **A low-fidelity UI mockup**

![](https://s2.loli.net/2023/02/04/Ndomw3461UbPFGy.jpg)

## PROJECT WORK DISTRIBUTION

> **Project work distribution**

Lucas 

* Back-End Data Extraction - Covid Case Trends
* Firebase Authentication and User Storage 

Daniel 

* Back-End Data Extraction - Research Publications and Covid Case Trends

Hao 

* Frontend Implementation
* Frontend-backend Communication

Haowen

* Front-end Implementation
* Back-End Data Extraction - Research Publications
