"use strict";

const form = document.querySelector("form");
const inputdistance = document.querySelector(".form_input_distance");
const inputduration = document.querySelector(".form_input_duration");
const inputcadence = document.querySelector(".form_input_cadence");
const inputelevation = document.querySelector(".form_input_elevation");
const inputtype = document.querySelector(".form_input_type");
const containerworkout = document.querySelector(".workouts");

class workout {
  date = new Date();
  // below will create an id of date last 10 digit
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  // this will set the description of workout according to the type and provide date
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

// workout will be the parent class for running
class running extends workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcpace();
    this._setDescription();
  }

  // this will calculate the pace
  calcpace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

// workout will be the parent class for cycling

class cycling extends workout {
  type = "cycling";
  constructor(coords, distance, duration, elevgain) {
    super(coords, distance, duration);
    this.elevgain = elevgain;
    this.calcspeed();
    this._setDescription();
  }

  // this will calculate the speed

  calcspeed() {
    this.speed = this.duration / (this.duration / 60);
    return this.speed;
  }
}

const run = new running([39, -13], 7, 5, 56, 479);
const cycli = new cycling([39, -13], 7, 5, 56, 479);

class App {
  // private variables decalared as below
  #map;
  #mapevent;
  #workouts = [];

  constructor() {
    // below get position of the current location
    this._getposition();

    this._getlocalstroage();

    // on submit event render the newworkout with details
    form.addEventListener("submit", this._newworkout.bind(this));

    // change the type toggleevent
    inputtype.addEventListener("change", this._toggleevent);
    containerworkout.addEventListener("click", this._movepopup.bind(this));
  }

  // thorugh the navigator geolocation will get currentposition object will return to load the map accordingly
  _getposition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // this will bind object to loadmap method  so that we can load the map
        //in function this refers as global object
        // for bind this refers object
        this._loadmap.bind(this),
        function () {
          alert("could not get your position");
        }
      );
    }
  }

  _loadmap(position) {
    // get latitude and longitude destructed to render map according to coordinates
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(position);

    const coords = [latitude, longitude];

    // used leaflet api to render the API

    this.#map = L.map("map").setView(coords, 13);

    // display the map using map variable object
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // show the marker according to coords
    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxwidth: 250,
          minwidth: 100,
          autoclose: false,
          closeOnclick: false,
          // set the css property
          className: `location-popup`,
        })
      )
      // set the content for the marker
      .setPopupContent("Current Location")
      .openPopup();

    // onclicking on map showform will get triggred
    this.#map.on("click", this._showform.bind(this));

    // for each workout renderworkoutmarkup
    this.#workouts.forEach((work) => {
      this._renderworkoutmarker(work);
    });
  }

  _showform(mapE) {
    this.#mapevent = mapE;
    // remove hidden class as to show the form by highlighting the inputdistance in focus
    form.classList.remove("hidden");
    inputdistance.focus();
  }

  _hideform() {
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  // this will toggle the between according to type
  _toggleevent() {
    inputelevation.closest(".form_row").classList.toggle("form_row_hidden");
    inputcadence.closest(".form_row").classList.toggle("form_row_hidden");
  }

  _newworkout(e) {
    e.preventDefault();

    const validinputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    const allpositive = (...inputs) => inputs.every((inp) => inp > 0);

    // get the inputs value and coverted to numver as per requirement
    const type = inputtype.value;
    const distance = Number(inputdistance.value);
    const duration = Number(inputduration.value);

    // in the showform on click we get mapevent object which is Destructed here
    const { lat, lng } = this.#mapevent.latlng;

    let work;

    if (type === "running") {
      // if the type is running then we consider cadence
      const cadence = Number(inputcadence.value);

      if (
        // !Number.isFinite(distance) ||
        // Number.isFinite(duration) ||
        // Number.isFinite(cadence)

        // this will validate the input data enter for finite as well as positive
        !validinputs(distance, duration, cadence) ||
        !allpositive(distance, duration, cadence)
      ) {
        console.log("first");
        return alert("please enter valid details ");
      }

      // create an opject of running
      work = new running([lat, lng], distance, duration, cadence);
    }

    if (type === "cycling") {
      // if the type is cycling then we consider elevation

      const elevation = Number(inputelevation.value);
      console.log(elevation);

      if (
        !validinputs(distance, duration, elevation) ||
        !allpositive(distance, duration)
      ) {
        console.log("second");

        return alert("please enter valid details ");
      }
      // create an opject of cycling

      work = new cycling([lat, lng], distance, duration, elevation);
      console.log(work);
    }

    // this will push to the array of workouts to renderthe workout as well as for markup
    this.#workouts.push(work);

    // first will render the marker on the map
    this._renderworkoutmarker(work);

    this._renderworkout(work);

    this._hideform();

    this._setlocalstorage();

    inputdistance.value = inputduration.value = inputcadence.value = "";
  }

  // set the markup according to the workouts array
  _renderworkoutmarker(work) {
    L.marker(work.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxwidth: 250,
          minwidth: 100,
          autoclose: false,
          closeOnclick: false,
          className: `${work.type}-popup`,
        })
      )
      .setPopupContent(
        `${work.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${work.description}`
      )
      .openPopup();
  }

  // this will render the workout on the sidebar
  _renderworkout(work) {
    let html = `<li class="workout workout_${work.type}" data-id="${work.id}">
    <h2 class="workout_title">${work.description}</h2>
    <div class="workout_details">
      <span class="workout_icon">${work.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
      <span class="workout_value">${work.distance}</span>
      <span class="workout_unit">km</span>
    </div>
    <div class="workout_details">
      <span class="workout_icon">⏱</span>
      <span class="workout_value">${work.duration}</span>
      <span class="workout_unit">Min</span>
    </div>
   `;

    if (work.type === "running") {
      html += ` <div class="workout_details">
      <span class="workout_icon">⚡️</span>
      <span class="workout_value">${work.pace.toFixed(1)}</span>
      <span class="workout_unit">Min/KM</span>
    </div>
    <div class="workout_details">
            <span class="workout_icon">🦶🏼</span>
            <span class="workout_value">${work.cadence}</span>
            <span class="workout_unit">SPM</span>
    </div>
    </li>`;
    }
    if (work.type === "cycling") {
      html += `<div class="workout_details">
      <span class="workout_icon">⚡️</span>
      <span class="workout_value">${work.speed.toFixed(1)}</span>
      <span class="workout_unit">km/h</span>
    </div>
    <div class="workout_details">
      <span class="workout_icon">⛰</span>
      <span class="workout_value">${work.elevgain}</span>
      <span class="workout_unit">m</span>
    </div>
    </li>`;
    }

    form.insertAdjacentHTML("afterend", html);
  }

  // this will redirect to selected workout
  _movepopup(e) {
    console.log("hello");
    const workoutEl = e.target.closest(".workout");
    console.log(workoutEl);

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );
    console.log(workout);

    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // below for storage in local storage
  _setlocalstorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getlocalstroage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    console.log(data);

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach((work) => {
      this._renderworkout(work);
    });
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

// creates object of App class as app

const app = new App();
