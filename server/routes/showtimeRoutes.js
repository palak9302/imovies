const router = require('express').Router();
const c = require('../controllers/showtimeController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/movie/:movieId', c.getByMovie);
router.get('/:id', c.getOne);
router.post('/', protect, adminOnly, c.createShowtime);
router.delete('/:id', protect, adminOnly, c.deleteShowtime);

module.exports = router;
