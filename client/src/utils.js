export const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export const dayLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export const timeLabel = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

export const dateTimeLabel = (d) => `${dayLabel(d)}, ${timeLabel(d)}`;

export const hours = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

export const seatsLeft = (st) => st.rows * st.cols - st.bookedSeats.length;
