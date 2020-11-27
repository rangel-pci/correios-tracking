const express = require('express');
const cors = require('cors');

const trackingCorreios = require('tracking-correios');
const correios = require('correios.js');

const app = express();
app.use(cors());

const PORT = 3001;

app.get('/', (req, res) => {
	const {tracking} = req.query;

	// trackingCorreios.track(tracking)
	// .then((result) => {
	// 	res.json({ message: 'ok', tracking, result });
	// })
	// .catch(() => {
	// 	res.json({ message: 'error', error });
	// })

	correios.track(tracking)
	.then((result) => {
		res.json({ message: 'ok', tracking, result });
	})
	.catch(() => {
		res.json({ message: 'error', error });
	})

});

app.listen(PORT, '192.168.0.14', () => console.log(`Listening on port ${PORT}`));