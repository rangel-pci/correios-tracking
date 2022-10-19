const express = require('express');
const nunjucks = require('nunjucks');
const cors = require('cors');
const Correios = require('correios.js');
const correios = new Correios();

const app = express();
app.use(cors());

var PORT = process.env.PORT || 3000;

//public folder
app.use(express.static('public'));

//template engine Nunjucks
nunjucks.configure('views', {
	express: app,
	noCache: true //turn off to deploy
});

//routes
app.get('/', (req, res) => {
	res.render('index.njk');
});

app.get('/:tracking', (req, res) => {
	const {tracking} = req.params;

	correios.track(tracking)
	.then((result) => {
		const events = result.events;
		
		let temp = [];
		events.map((r) => {
			r.message = r.event;
			r.event = '';
			temp.push(r);
		})
		result.events = temp;

		res.status(200).json({ message: 'ok', tracking, result });
	})
	.catch(() => {
		res.json({ message: 'error', error });
	})

});

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`));