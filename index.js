#!/usr/bin/env node

const config 	= require('./cli');
const init 		= require('./init');
const clean 	= require('./clean');
const test		= require('./test');
const restify 	= require('restify');




var api = restify.createServer({
	name: 			'Web Component Benchmark'
});

api.listen(9000, function() {
	console.log('API server is running');
	
	init(config)
	.then(test)
	.then(config => {
		config = config;
	})
	.catch(err => {
		console.log(err);
		process.exit(-1);
	});
});

api.use(restify.bodyParser());
api.use(restify.queryParser({mapParams: false}));

api.pre(function(req, res, next) {
	req.headers.accept = 'application/json';
	return next();
});

api.post('/stats', (req, res, next) => {
	console.log(req.params);
	res.send();
});



