# Predictive Courier Maintenance

<p align="center">
    <img src="https://res.cloudinary.com/shaun-storage/image/upload/v1731973368/Image_19-11-2024_at_7.37_AM_cxc0xl.jpg">
    <img src="https://res.cloudinary.com/shaun-storage/image/upload/v1731973367/Image_19-11-2024_at_7.37_AM_1_kdl4fz.jpg">
</p>

## Quick Start

#### Clone the repo

`git clone https://github.com/Shaunmak1214/rsq-test-app.git`

#### Install necessary dependencies

`yarn install`

#### Check environment variables

- Make sure the API_URL is set correctly either to your local `localhost:port/v1/` or some tunnelled urls.

`vim .env`

#### Start nextjs server

`yarn run dev`

#### Setup backend service

View guide [here](https://github.com/Shaunmak1214/rsq-test-api#readme)

## Feature Highlights

1. Shipments Listings (Filters and Sorting)
2. Maintenance Listings (Filters and Sorting)
3. Maintenance Schedule Form
4. Cancellation of shipments and maintenance

## Demo Video

1. Basic Flow
   https://res.cloudinary.com/shaun-storage/video/upload/v1731973369/Screen_Recording_2024-11-19_at_7.20.49_AM_kuxsmc.mp4

<br></br>

<div style="height: 2px; width: 100%; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));></div>

<br></br>

#### Thoughts

##### Justifying decisions made <b> (Vehicle Listings -> Shipment Listings)</b>

- More convenient to track health status deterioration real-time of vehicles
- Requirements mentioned predictive maintenance
- With a direct view of shipments, future applications can be built for eg - automatically scheduling maintenance on the road, reminders for drivers to check the status of vehicles, etc.

##### Enhancements in the future

1. Implement Authentication
2. More efficient api calls (pagination, caching, etc)
3. Offline first
4. Faster page loads with caching
