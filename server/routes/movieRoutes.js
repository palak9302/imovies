const router = require('express').Router();
const c = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', c.getMovies);
router.get('/:id', c.getMovie);
router.post('/', protect, adminOnly, c.createMovie);
router.put('/:id', protect, adminOnly, c.updateMovie);
router.delete('/:id', protect, adminOnly, c.deleteMovie);

module.exports = router;
