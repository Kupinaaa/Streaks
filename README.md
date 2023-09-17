# Streaks
##### Edit date: the 15th of May, 2023

### The current look of things:
![Screenshot_20230515_213147](https://github.com/yukinoyuu/Streaks/assets/56956339/0dab43fa-a849-40b2-9663-bcfda5a475cc)
![Screenshot_20230515_213321](https://github.com/yukinoyuu/Streaks/assets/56956339/e228f994-0bea-4ebd-8b05-8ed3d24cdfcb)

#### The webApp was built with MongoDB (mongoose), ExpressJS, ReactJS (vite) and TypeScript; or basically the MERN stack with Typescript

#### The Streak app
The streak app's purpose is to keep track of habits and every day tasks. Or in other words to keep trak of the **streak** of days for which you have been consecutively doing a task, hence the name.

#### Why?
I'm making this project for personal use and to improve my coding skills.

#### If for some reason you have decided to try and run this thing, here's how you could do so:
0. Install nodejs and mongodb
1. Start mongodb server (for linux: ```sudo systemctl start mongodb```, for other operating systems, please read mongodb docs on how to start a local server)
2. Go into both the back and front end folders and in each run ```npm install```
3. Start both the back and front end servers with ```npm run dev```

Small P.S for the startup tutorial:
I currently do not have a build for this, but it might be a later addition.

#### The basic functionality of the Streaks webapp:
- [x] Display all streaks in a neat way
- [x] Update the streak count
- [x] Add Streaks (with no assigned user)
- [x] Remove Streaks
- [x] Github like log of streak
