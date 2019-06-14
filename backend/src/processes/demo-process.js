process.on('message', (msg) => {
  const { data } = msg;

  const db = require('path/to/helper').connect();

  db.on('error', error => process.send({ error }));

  db.once('open', async () => {
    const Model = require('path/to/model');

    try {
      // do something

      process.send({ ok: true, data });
    } catch (error) {
      process.send({ error });
    }
  });
});
