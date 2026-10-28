import { useState, useEffect } from 'react';
import './App.css';
import {
  loginUser,
  signupUser,
  createBooking,
  getMyBookings,
  getBookedSeats
} from './api';

const movies = [
{ id: 1, title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', emoji: '🌌', color: '#302b63', description: 'A skilled thief enters people’s dreams to steal secrets.' },
{ id: 2, title: 'Interstellar', year: 2014, rating: 8.7, genre: 'Adventure', emoji: '🚀', color: '#16222a', description: 'Explorers travel beyond this galaxy to save humanity.' },
{ id: 3, title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', emoji: '🦇', color: '#232526', description: 'Batman faces a dangerous criminal threatening Gotham.' },
{ id: 4, title: 'Avengers: Endgame', year: 2019, rating: 8.4, genre: 'Action', emoji: '🦸', color: '#642b73', description: 'The Avengers unite for one final battle.' },
{ id: 5, title: 'Joker', year: 2019, rating: 8.4, genre: 'Drama', emoji: '🃏', color: '#42275a', description: 'A troubled comedian transforms into Gotham’s Joker.' },
{ id: 6, title: 'Titanic', year: 1997, rating: 7.9, genre: 'Romance', emoji: '🚢', color: '#141e30', description: 'A timeless romance unfolds aboard a legendary ship.' },
{ id: 7, title: 'Spider-Man', year: 2021, rating: 8.2, genre: 'Action', emoji: '🕷️', color: '#8e0e00', description: 'A young superhero faces an extraordinary challenge.' },
{ id: 8, title: 'Dune', year: 2021, rating: 8.0, genre: 'Sci-Fi', emoji: '🏜️', color: '#614385', description: 'A young hero discovers his destiny on a desert planet.' }
];

function App() {
const [selectedMovie, setSelectedMovie] = useState(null);
const [selectedSeats, setSelectedSeats] = useState([]);
const [search, setSearch] = useState('');
const [showLogin, setShowLogin] = useState(false);
const [isSignup, setIsSignup] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [userEmail, setUserEmail] = useState('');
const [password, setPassword] = useState('');
const [fullName, setFullName] = useState('');
const [bookingDetails, setBookingDetails] = useState(null);
const [myBookings, setMyBookings] = useState([]);
const [showConfirmation, setShowConfirmation] = useState(false);
const [showMyBookings, setShowMyBookings] = useState(false);
const [showPayment, setShowPayment] = useState(false);
const [paymentMethod, setPaymentMethod] = useState('');
const [bookedSeats, setBookedSeats] = useState({});
const [showBooking, setShowBooking] = useState(false);
const [selectedShow, setSelectedShow] = useState('6:00 PM');
const [showDate, setShowDate] = useState('');
const [selectedTheatre, setSelectedTheatre] = useState('');
const [selectedLocation, setSelectedLocation] = useState('');


const filteredMovies = movies.filter(movie =>
movie.title.toLowerCase().includes(search.toLowerCase()) ||
movie.genre.toLowerCase().includes(search.toLowerCase())
);

const openMovie = movie => {
setSelectedMovie(movie);



setSelectedSeats([]);
setShowBooking(false);
setSelectedShow('6:00 PM');
};

const closeMovie = () => {
setSelectedMovie(null);
setShowBooking(false);
setSelectedSeats([]);
};

const toggleSeat = seat => {
setSelectedSeats(previous =>
previous.includes(seat)
? previous.filter(item => item !== seat)
: [...previous, seat]
);
};
useEffect(() => {
  if (
    !selectedMovie ||
    !selectedLocation ||
    !selectedTheatre ||
    !selectedShow ||
    !showDate
  ) {
    return;
  }

  const loadBookedSeats = async () => {
    try {
      const result = await getBookedSeats({
        movie: selectedMovie.title,
        theatre: selectedTheatre,
        location: selectedLocation,
        showtime: selectedShow,
        showDate: showDate,
      });

      const key = [
        selectedMovie.title,
        selectedLocation,
        selectedTheatre,
        showDate,
        selectedShow,
      ].join('|');

      setBookedSeats(prev => ({
        ...prev,
        [key]: result.bookedSeats,
      }));

      setSelectedSeats(prev =>
        prev.filter(seat => !result.bookedSeats.includes(seat))
      );
    } catch (error) {
      console.error('Unable to load booked seats:', error);
    }
  };

  loadBookedSeats();
}, [
  selectedMovie,
  selectedLocation,
  selectedTheatre,
  selectedShow,
  showDate,
]);
const currentSeatKey = selectedMovie
  ? `${selectedMovie.title}|${selectedLocation}|${selectedTheatre}|${showDate}|${selectedShow}`
  : '';

return ( <div className="app"> 
{successMessage && (
  <div className="success-popup">
    <span>✓</span>
    <p>{successMessage}</p>
    <button onClick={() => setSuccessMessage('')}>×</button>
  </div>
)}
<header className="navbar"> <a className="logo" href="#home">i<span>Movies</span></a> <nav> <a href="#home">Home</a> <a href="#movies">Movies</a> <a href="#about">About</a> </nav> <a className="nav-button" href="#movies">Book Tickets</a>
<button
className="nav-button"
onClick={() => setShowLogin(true)}

>

{isLoggedIn ? userEmail : 'Login / Sign Up'} </button>
{isLoggedIn && (
  <button
    className="nav-button"
    onClick={() => {
      setIsLoggedIn(false);
      setUserEmail('');
      setPassword('');
      setSuccessMessage('Logged out successfully!');
    }}
  >
    Logout
  </button>
)}
<button
className="nav-button"
onClick={async () => {
setShowMyBookings(true);


try {
  const result = await getMyBookings();
  setMyBookings(
    result.bookings.map((booking) => ({
      ...booking,
      total: booking.seats.length * 200
    }))
  );
} catch (error) {
  alert(error.message || 'Unable to load your bookings.');
}


}}

>

My Bookings </button>

 </header>


  <main>
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">YOUR CINEMA EXPERIENCE STARTS HERE</p>
        <h1>Movies that move <span>you.</span></h1>
        <p className="hero-description">
          Discover amazing stories, explore your favourite films and book
          your perfect seat for the ultimate movie experience.
        </p>
        <a href="#movies" className="primary-button">Explore Movies →</a>
        <div className="hero-stats">
          <div><strong>8+</strong><span>Featured Movies</span></div>
          <div><strong>4.8/5</strong><span>Movie Lovers</span></div>
          <div><strong>100%</strong><span>Entertainment</span></div>
        </div>
      </div>
      <div className="hero-art">
        <div className="hero-orbit">🎬</div>
        <div className="floating-card card-one">🍿 Movie Night</div>
        <div className="floating-card card-two">⭐ Top Rated</div>
      </div>
    </section>

    <section className="movies-section" id="movies">
      <div className="section-heading">
        <div>
          <p className="eyebrow">HANDPICKED FOR YOU</p>
          <h2>Explore <span>Movies</span></h2>
        </div>
        <span className="movie-count">{filteredMovies.length} movies</span>
      </div>

      <div className="search-box">
        <span>🔎</span>
        <input
          type="text"
          placeholder="Search movies or genres..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        {search && <button onClick={() => setSearch('')}>Clear</button>}
      </div>

      <div className="movie-grid">
        {filteredMovies.map(movie => (
          <article className="movie-card" key={movie.id}>
            <div className="movie-poster" style={{ background: `linear-gradient(145deg, ${movie.color}, #101016)` }}>
              <span className="poster-emoji">{movie.emoji}</span>
              <span className="rating">⭐ {movie.rating}</span>
              <span className="poster-year">{movie.year}</span>
            </div>
            <div className="movie-info">
              <span className="genre">{movie.genre}</span>
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <button className="book-button" onClick={() => openMovie(movie)}>
                View & Book <span>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="empty-state">
          <span>🎞️</span>
          <h3>No movies found</h3>
          <p>Try searching for another movie or genre.</p>
        </div>
      )}
    </section>

    <section className="about-section" id="about">
      <p className="eyebrow">MADE FOR MOVIE LOVERS</p>
      <h2>Your next favourite movie is <span>waiting.</span></h2>
      <p>Browse movies, select your seats and enjoy the magic of cinema with iMovies.</p>
      <a href="#movies" className="primary-button">Find Your Movie →</a>
    </section>
  </main>

  <footer>
    <a className="logo" href="#home">i<span>Movies</span></a>
    <p>© 2026 iMovies. Your stories. Your screen.</p>
  </footer>
  {showPayment && bookingDetails && (
  <div className="modal-backdrop payment-backdrop">
    <div className="movie-modal">
      <button
        className="close-button"
        onClick={() => setShowPayment(false)}
      >
        ✕
      </button>

      <div className="modal-content">
        <h2>💳 Payment</h2>

        <p style={{ color: '#b5b5c5' }}>
          Choose your preferred payment method.
        </p>

        <div
          style={{
            marginTop: '20px',
            padding: '18px',
            background: '#22222e',
            borderRadius: '12px'
          }}
        >
          <h3>Booking Summary</h3>
          <p>Movie: {bookingDetails.movie}</p>
<p>Location: {bookingDetails.location}</p>
<p>Theatre: {bookingDetails.theatre}</p>
<p>Showtime: {bookingDetails.showtime}</p>
<p>Seats: {bookingDetails.seats.join(', ')}</p>
<p>Ticket Price: ₹200 × {bookingDetails.seats.length} seat(s)</p>

<h2 style={{ color: '#ff3155' }}>
  Total: ₹{bookingDetails.total}
</h2>

        </div>

        <h3 style={{ marginTop: '25px' }}>
          Select Payment Method
        </h3>

        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '15px' }}>
           <input
  type="radio"
  name="paymentMethod"
  value="UPI"
  checked={paymentMethod === 'UPI'}
  onChange={() => setPaymentMethod('UPI')}
/>
            {' '}📱 UPI
          </label>

          <label style={{ display: 'block', marginBottom: '15px' }}>
            <input
  type="radio"
  name="paymentMethod"
  value="Card"
  checked={paymentMethod === 'Card'}
  onChange={() => setPaymentMethod('Card')}
/>
            {' '}💳 Credit / Debit Card
          </label>

          <label style={{ display: 'block', marginBottom: '15px' }}>
            <input
  type="radio"
  name="paymentMethod"
  value="Net Banking"
  checked={paymentMethod === 'Net Banking'}
  onChange={() => setPaymentMethod('Net Banking')}
/>
            {' '}🏦 Net Banking
          </label>
        </div>

       
    <button
      className="primary-button full-button"
      style={{ marginTop: '20px' }}
      onClick={async () => {
        if (!paymentMethod) {
          alert('Please select a payment method.');
          return;
        }

        if (!bookingDetails?.showDate) {
          alert('Please select a show date before booking.');
          return;
        }

        try {
          const result = await createBooking({
            movie: bookingDetails.movie,
            location: bookingDetails.location,
            theatre: bookingDetails.theatre,
            showtime: bookingDetails.showtime,
            showDate: bookingDetails.showDate,
            seats: bookingDetails.seats
          });

          const savedBooking = {
            ...bookingDetails,
            _id: result.booking._id
          };

          setMyBookings(prevBookings => [
            ...prevBookings,
            savedBooking
          ]);

          const bookingKey = [
  bookingDetails.movie,
  bookingDetails.location,
  bookingDetails.theatre,
  bookingDetails.showDate,
  bookingDetails.showtime
].join('|');

          setBookedSeats(prevSeats => ({
            ...prevSeats,
            [bookingKey]: [
              ...(prevSeats[bookingKey] || []),
              ...bookingDetails.seats
            ]
          }));

          setShowPayment(false);
          setShowConfirmation(true);

          alert('Booking saved successfully!');
        } catch (error) {
          alert(error.message || 'Booking failed. Please try again.');
        }
      }}
    >
      Proceed to Pay →
    </button>


      </div>
    </div>
  </div>
)}
  {showMyBookings && (
  <div className="modal-backdrop">
    <div className="movie-modal">
      <button
        className="close-button"
        onClick={() => setShowMyBookings(false)}
      >
        ✕
      </button>

      <div className="modal-content">
        <h2>🎟️ My Bookings</h2>

        <p style={{ color: '#b5b5c5', marginTop: '15px' }}>
          Your movie reservations will appear here.
        </p>

        <div
  style={{
    marginTop: '25px',
    padding: '20px',
    background: '#22222e',
    borderRadius: '12px'
  }}
>
  {myBookings.length === 0 ? (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '45px' }}>🎬</div>
      <h3>No Bookings Yet</h3>
      <p style={{ color: '#b5b5c5', fontSize: '14px' }}>
        You haven't booked any movie tickets yet.
        Explore movies and book your first ticket!
      </p>
    </div>
  ) : (
    myBookings.map((booking, index) => (
      <div
        key={index}
        style={{
          padding: '15px',
          marginBottom: '15px',
          background: '#15151e',
          borderRadius: '10px',
          border: '1px solid #34313f'
        }}
      >
        <h3>🎬 {booking.movie}</h3>
        <p>📍 Location: {booking.location}</p>
        <p>🏢 Theatre: {booking.theatre}</p>
        <p>🕒 Showtime: {booking.showtime}</p>
        <p>💺 Seats: {booking.seats.join(', ')}</p>
        <h3 style={{ color: '#ff3155' }}>
          Total: ₹{booking.total}
        </h3>
        <p style={{ color: '#4ade80' }}>✓ Booking Confirmed</p>
      </div>
    ))
  )}

<button
className="primary-button"
onClick={() => setShowMyBookings(false)}
style={{ marginTop: '15px' }}

>


Explore Movies →


  </button>
</div>

      </div>
    </div>
  </div>
)}
  {showLogin && (
  <div
    className="modal-backdrop"
    onClick={() => setShowLogin(false)}
  >
    <div
      className="movie-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="close-button"
        onClick={() => setShowLogin(false)}
      >
        ✕
      </button>

      <div className="modal-content">
        <h2>Welcome to iMovies 🎬</h2>
       <p>
  {isSignup
    ? 'Create your account to start booking movie tickets.'
    : 'Login to continue your movie experience.'}
</p>
<form
  onSubmit={async (event) => {
    event.preventDefault();


if (!userEmail.trim() || !password) {
  alert('Please enter your email and password.');
  return;
}

try {
  if (isSignup) {
    if (!fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    const data = await signupUser({
      name: fullName.trim(),
      email: userEmail.trim(),
      password: password,
    });

    setSuccessMessage('Account created successfully! Please log in.');
    setIsSignup(false);
    setPassword('');
    setFullName('');

    alert(data.message || 'Account created successfully! Please log in.');
  } else {
    const data = await loginUser({
      email: userEmail.trim(),
      password: password,
    });

    localStorage.setItem('imoviesToken', data.token);
    localStorage.setItem('imoviesUser', JSON.stringify(data.user));

    setIsLoggedIn(true);
    setShowLogin(false);
    setPassword('');
    setSuccessMessage('Login successful!');

    alert('Login successful!');
  }
} catch (error) {
  alert(error.message || 'Something went wrong. Please try again.');
}


}}

>


          {isSignup && (
<> <label>Full Name</label>
<input
type="text"
placeholder="Enter your full name"
value={fullName}
onChange={(event) => setFullName(event.target.value)}
required
/>
</>
)}

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            className="primary-button full-button"
          >
            {isSignup ? 'Create Account →' : 'Login →'}
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '13px' }}>
  {isSignup ? 'Already have an account?' : 'New to iMovies?'}
  {' '}
  <button
    type="button"
    onClick={() => setIsSignup(!isSignup)}
    style={{
      background: 'none',
      border: 'none',
      color: '#ff3155',
      cursor: 'pointer',
      fontWeight: '600'
    }}
  >
    {isSignup ? 'Login' : 'Sign Up'}
  </button>
</p>

      </div>
    </div>
  </div>
)}

  {selectedMovie && (
    <div className="modal-backdrop" onClick={closeMovie}>
      <div className="movie-modal" onClick={event => event.stopPropagation()}>
        <button className="close-button" onClick={closeMovie}>✕</button>

        <div className="modal-poster" style={{ background: `linear-gradient(145deg, ${selectedMovie.color}, #101016)` }}>
          <span>{selectedMovie.emoji}</span>
        </div>

        <div className="modal-content">
          <span className="genre">{selectedMovie.genre} · {selectedMovie.year}</span>
          <h2>{selectedMovie.title}</h2>
          <p className="modal-rating">⭐ {selectedMovie.rating}/10</p>
          <p>{selectedMovie.description}</p>

          {!showBooking ? (
            <button className="primary-button full-button" onClick={() => setShowBooking(true)}>
              Book Tickets 🎟️
            </button>
          ) : (
            <div className="booking-section">
              <h3>Select Location</h3>
<select
  className="showtime"
  value={selectedLocation}
  onChange={(e) => {
  setSelectedLocation(e.target.value);
  setSelectedTheatre('');
  setSelectedSeats([]);
}}
>
  <option value="">Choose your city</option>
  <option value="Indore">Indore</option>
  <option value="Bhopal">Bhopal</option>
  <option value="Mumbai">Mumbai</option>
  <option value="Delhi">Delhi</option>
</select>

{selectedLocation && (
  <>
    <h3>Select Theatre</h3>
    <select
      className="showtime"
      value={selectedTheatre}
      onChange={(e) => setSelectedTheatre(e.target.value)}
    >
      <option value="">Choose your theatre</option>
      <option value="PVR Cinemas">PVR Cinemas</option>
      <option value="INOX">INOX</option>
      <option value="Cinepolis">Cinepolis</option>
    </select>
  </>
)}
             <h3>Select Show Date</h3>

<input
  type="date"
  className="showtime"
  min={new Date().toLocaleDateString('en-CA')}
  value={showDate}
  onChange={(e) => {
    setShowDate(e.target.value);
    setSelectedSeats([]);
  }}
/>
              <h3>Choose Showtime</h3>
              <div className="showtimes">
                {['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'].map(time => (
                  <button
                    key={time}
                    className={selectedShow === time ? 'showtime active' : 'showtime'}
                    onClick={() => {
  setSelectedShow(time);
  setSelectedSeats([]);
}}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <h3>Select Your Seats</h3>
              <div className="screen">SCREEN</div>
              <div className="seat-grid">
               {['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'].map(seat => (
  <button
    key={seat}
    disabled={bookedSeats[currentSeatKey]?.includes(seat)}
    className={
      bookedSeats[currentSeatKey]?.includes(seat)
        ? 'seat booked'
        : selectedSeats.includes(seat)
        ? 'seat selected'
        : 'seat'
    }
    onClick={() => toggleSeat(seat)}
  >
    {seat}
  </button>
))}
       
              </div>

              <p className="selected-info">
                Selected: {selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}
              </p>
              <p className="total-price">Total: ₹{selectedSeats.length * 200}</p>

              <button
className="primary-button full-button"
disabled={
  !selectedLocation ||
  !selectedTheatre ||
  !selectedShow ||
  selectedSeats.length === 0
}
onClick={() => {
if (!isLoggedIn) {
alert('Please login before booking your movie ticket.');
setShowLogin(true);
return;
}


setBookingDetails({
  movie: selectedMovie.title,
  location: selectedLocation,
  theatre: selectedTheatre,
  showtime: selectedShow,
  showDate: showDate,
  seats: [...selectedSeats],
  total: selectedSeats.length * 200
});
  

setShowPayment(true);


}}

>

Confirm Booking → </button>

            </div>
          )}
                </div>
      </div>
    </div>
  )}
{showConfirmation && bookingDetails && (

  <div className="modal-backdrop">
    <div className="movie-modal">
      <div className="modal-content">
        <h2>🎉 Booking Confirmed!</h2>
        <p>Your movie ticket has been booked successfully.</p>


    <h3>Booking Summary</h3>
    <p>Movie: {bookingDetails.movie}</p>
    <p>Location: {bookingDetails.location || 'Not selected'}</p>
    <p>Theatre: {bookingDetails.theatre || 'Not selected'}</p>
    <p>Showtime: {bookingDetails.showtime}</p>
    <p>Seats: {bookingDetails.seats.join(', ')}</p>
    <h3>Total Amount: ₹{bookingDetails.total}</h3>

    <button
      className="primary-button full-button"
      onClick={() => {
        setShowConfirmation(false);
        setSelectedMovie(null);
        setSelectedSeats([]);
        setShowBooking(false);
      }}
    >
      Back to Movies
    </button>
        </div>
    </div>
  </div>
)}
</div>
);
}
export default App;
