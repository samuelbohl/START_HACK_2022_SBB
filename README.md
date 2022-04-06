# START_HACK_2022_SBB

A cycler's best friend: Helping bikers avoid uncertainty about the mandatory bicycle reservations since 2022.


![Screenshot from 2022-03-25 09-34-08](https://user-images.githubusercontent.com/50950798/160088979-f7a2abad-56ff-4ce6-8032-544ef3780843.png)


## The Problem
Bikers are often uncertain about when to reserve a spot for their bike when planning a tour. 
This leads to overbooking, especially for the return trip, since the bikers do not exactly know when they will return and a reservation is mandatory, when getting a bike aboard the train.
SBB has to deal with "empty" reservations and the bikers are paying for unused bookings.

## Our Solution
We provide a tool primarily for the cyclists, which gives them a generous estimation of the available spaces for their bikes for every trip they want.
Using state of the art unsupervised machine learning and clustering methods and different kinds of data we got from the SBB APIs (from weather data, to reservations or holidays), our tool displays the expected reservation to capacity ratio over for all booking times before the desired trip.

The method can be expanded with additional data to better serve both the customer and SBB.

In short, the tool improves efficiency for customers, by helping them book at the right time, and also SBB, because no redundant reservations are made.

## Deployment

```

# Build and startup
$ docker-compose up -d

# Rebuild
$ docker-compose up -d --no-deps --build

```
