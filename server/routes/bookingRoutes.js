const router = require('express').Router();
const c = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', c.createBooking);
router.get('/mine', c.myBookings);
router.put('/:id/cancel', c.cancelBooking);

module.exports = router;
