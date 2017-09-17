const serve 		= require('./serve');

module.exports = config => {
	return new Promise((resolve, reject) => {
		console.log(config);

		const regressions = config.regressions.concat(['current']);

		config.waiting = {};

		for(let version of regressions) {
			config.waiting[version] = config.browser;
			serve.start(`${config.path}/wcp/${version}`, config.browser, config.components)
		}
	});
};