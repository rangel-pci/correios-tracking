const express = require('express');
const cors = require('cors');

const correios = require('correios.js');

const app = express();
app.use(cors());

var PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	const {tracking} = req.query;

	correios.track(tracking)
	.then((result) => {
		res.json({ message: 'ok', tracking, result });
	})
	.catch(() => {
		res.json({ message: 'error', error });
	})

});

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`));