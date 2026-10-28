const API_BASE_URL = 'https://imovies-backend-7qt1.onrender.com/api';

export async function signupUser(userData) {
const response = await fetch(`${API_BASE_URL}/auth/signup`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(userData),
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.message || 'Signup failed');
}

return data;
}

export async function loginUser(credentials) {
const response = await fetch(`${API_BASE_URL}/auth/login`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(credentials),
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.message || 'Login failed');
}

return data;
}

export async function createBooking(bookingData) {
  const token = localStorage.getItem('imoviesToken');

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Booking failed');
  }

  return data;
}

export async function getMyBookings() {
  const token = localStorage.getItem('imoviesToken');

  const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch bookings');
  }

  return data;
}
export async function getBookedSeats({
  movie,
  theatre,
  location,
  showtime,
  showDate
}) {
  const params = new URLSearchParams({
    movie,
    theatre,
    location,
    showtime,
    showDate
  });

  const response = await fetch(
    `${API_BASE_URL}/bookings/booked-seats?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch booked seats');
  }

  return data;
}
