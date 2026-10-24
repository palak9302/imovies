// Run with: npm run seed   (wipes the DB and inserts demo data)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');

const movies = [
  { title: 'Midnight Express 1974', description: 'A late-night train, a missing ledger, and twelve strangers who all lie about where they were going.', genre: ['Thriller', 'Mystery'], language: 'English', duration: 118, rating: 8.1 },
  { title: 'Monsoon Letters', description: 'Two pen pals in Indore and Kochi plan to meet on the first day of the rains.', genre: ['Romance', 'Drama'], language: 'Hindi', duration: 132, rating: 7.8 },
  { title: 'Gravity Well', description: 'A repair crew on a dying space station has six hours to restart the engines.', genre: ['Sci-Fi', 'Action'], language: 'English', duration: 125, rating: 8.4 },
  { title: 'Chai & Chaos', description: 'A tea stall owner accidentally becomes the manager of a struggling cricket team.', genre: ['Comedy'], language: 'Hindi', duration: 109, rating: 7.2 },
  { title: 'The Last Lighthouse', description: 'The final keeper of a remote lighthouse discovers the lamp is guiding something other than ships.', genre: ['Horror', 'Mystery'], language: 'English', duration: 101, rating: 7.6 },
  { title: 'Kaveri', description: 'Three generations of a farming family face a decision about the river that feeds their land.', genre: ['Drama'], language: 'Tamil', duration: 140, rating: 8.6 },
];

const slots = [[10, 30], [14, 0], [18, 15], [21, 30]];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Movie.deleteMany(), Showtime.deleteMany(), Booking.deleteMany()]);

  await User.create([
    { name: 'Admin', email: 'admin@imovies.com', password: 'admin123', role: 'admin' },
    { name: 'Demo User', email: 'user@imovies.com', password: 'user123' },
  ]);

  const created = await Movie.insertMany(movies);
  const rowsLabel = 'ABCDEFGH';
  const showtimes = [];

  created.forEach((movie, mi) => {
    for (let day = 0; day < 4; day++) {
      // 2 slots per day, rotating so every movie has shows
      [slots[(mi + day) % 4], slots[(mi + day + 2) % 4]].forEach(([h, m], si) => {
        const start = new Date();
        start.setDate(start.getDate() + day);
        start.setHours(h, m, 0, 0);
        if (start < new Date()) return; // skip shows that already started today
        const bookedSeats = [];
        for (let k = 0; k < 6; k++) {
          const seat = `${rowsLabel[Math.floor(Math.random() * 8)]}${1 + Math.floor(Math.random() * 10)}`;
          if (!bookedSeats.includes(seat)) bookedSeats.push(seat);
        }
        showtimes.push({
          movie: movie._id,
          screen: `Screen ${1 + ((mi + si) % 3)}`,
          startTime: start,
          price: [180, 220, 250, 300][(mi + si) % 4],
          rows: 8,
          cols: 10,
          bookedSeats,
        });
      });
    }
  });

  await Showtime.insertMany(showtimes);
  console.log(`Seeded ${created.length} movies and ${showtimes.length} showtimes`);
  console.log('Admin  -> admin@imovies.com / admin123');
  console.log('User   -> user@imovies.com  / user123');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
