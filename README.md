
# TimeToWorkout 🏃‍♂️🚴‍♀️

TimeToWorkout is a workout tracking app that allows users to plan and record their running or cycling sessions. It utilizes the Leaflet API to display maps, track workouts, and store relevant information.

## URL: https:https://timetoworkout.netlify.app/ 

## Features 🚀🚀

1. **Map Rendering**: The app uses the Leaflet api to display an interactive map. Users can see their current location and plan their workout routes.

2. **Workout Tracking**: Users can start running or cycling sessions. For each workout by clicking on the map location , they need to provide the following details:
    - **Distance**: The distance covered during the workout (in kilometers or miles).
    - **Duration**: The time taken for the workout (in minutes or hours).
    - **Cadence**: The steps per minute (for running) or pedal rotations per minute (for cycling).
    - **Elevation**: The change in elevation during the workout (e.g., uphill or downhill).

3. **Local Storage**: The app stores workout data using the `localStorage` API. Each workout is saved as an object with the relevant details. When the user reloads the app, their previous workouts are retrieved from local storage.

4. **Markup on Map**: After completing a workout, the app marks the route on the map. Each workout is represented by a clickable marker. Clicking on a marker displays workout details .

## Future Enhancements ⌛⌛

1. **Edit Workouts**: Allow users to edit existing workouts (e.g., update distance, duration, or other details).

2. **Improved UX/UI**: Create an "Add Workout" button for a better user experience.

3. **Sorting Workouts**: Implement the ability to sort workouts by a specific field (e.g., distance or date).

4. **Enhanced Error Messages**: Provide more realistic error messages (e.g., when input validation fails).

5. **Advanced Features (Challenging)**:
    - **Position Map**: Automatically position the map to show all workouts.
    - **Draw Lines and Shapes**: Instead of just markers, allow users to draw lines or shapes on the map.
    - **Geocode Locations**: Convert coordinates to human-readable location names (e.g., "Run in Faro, Portugal").
    - **Weather Data**: Display weather data for the workout time and location (requires asynchronous JavaScript).

## Installation 🖥️
Clone this repository to your local machine.
Install any necessary dependencies (if applicable).
Run the project locally.


## Acknowledgments 🎓
This project is as part of my web development journey. Feel free to explore, modify, and enhance it!
