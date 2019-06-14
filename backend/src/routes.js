const router = require('express').Router();
const permit = require('path/to/util');
const validate = require('express-validation');

validate.options({
  status: 400,
  statusText: 'VALIDATION_STATUS_TEXT',
});

// require validation schemas here

// require routes here

router.get('/api/route', permit(['role', 'list']), route.method);
router.post('/api/route', permit(['role', 'list']), validate(validationSchema.method), route.method);

router.all('*', permit(['all']), route404);

module.exports = router;
