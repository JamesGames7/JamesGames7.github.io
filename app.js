const newTripFormEl = document.getElementsByTagName("form")[0];
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");
const pastTripContainer = document.getElementById("past-trips");

// Add the storage key as an app-wide constant
const STORAGE_KEY = "trip-tracker";

// Listen to form submissions.
newTripFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const startDate = startDateInputEl.value;
  const endDate = endDateInputEl.value;
  if (checkDatesInvalid(startDate, endDate)) {
    return;
  }
  storeNewTrip(startDate, endDate);
  renderPastTrips();
  newTripFormEl.reset();
});

function checkDatesInvalid(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) {
    newTripFormEl.reset();
    return true;
  }
  return false;
}

function storeNewTrip(startDate, endDate) {
  const trips = getAllStoredTrips();
  trips.push({ startDate, endDate });
  trips.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function getAllStoredTrips() {
  const data = window.localStorage.getItem(STORAGE_KEY);
  const trips = data ? JSON.parse(data) : [];
  console.dir(trips);
  console.log(trips);
  return trips;
}

function renderPastTrips() {
  const pastTripHeader = document.createElement("h2");
  const pastTripList = document.createElement("ul");
  const trips = getAllStoredTrips();
  if (trips.length === 0) {
    return;
  }
  pastTripContainer.textContent = "";
  pastTripHeader.textContent = "Past trips";
  trips.forEach((trip) => {
    const tripEl = document.createElement("li");
    tripEl.textContent = `From ${formatDate(
      trip.startDate,
    )} to ${formatDate(trip.endDate)}`;
    pastTripList.appendChild(tripEl);
  });

  pastTripContainer.appendChild(pastTripHeader);
  pastTripContainer.appendChild(pastTripList);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

renderPastTrips();
