const ncp 			= require('ncp').ncp;
const fs 			= require('fs');
const colors 		= require('colors');
const shelljs		= require('shelljs');
const git			= require('nodegit');
const browsers		= require('james-browser-launcher');

const getVariants = (variants, path) => {
	let variantsNames = ['mainline'];

	if(variants){
		const bwr = JSON.parse(fs.readFileSync(`${path}/bower.json`));

	}

	return variantsNames;
}

const writeConfig = (config, path) => {
	var js = `window.config = {runs: 25, components: ${JSON.stringify(config.components)}}`;
	fs.writeFileSync(`${path}/polyperf.js`, js);
}

const copy = config => {
	return new Promise((resolve, reject) => {
		config.variantNames = getVariants(config.variants, config.path);
		config.runs = {};
		console.log(config.path);

		console.log(`Copying the current version`);
		shelljs.rm('-rf', `${__dirname}/tmp`);
		shelljs.rm('-rf', `${config.path}/wcp`);
		shelljs.exec(`cp -R ${config.path}/ ${__dirname}/tmp`, {silent: true});
		shelljs.mkdir('-p', `${config.path}/wcp/current`);
		shelljs.exec(`cp -R ${__dirname}/tmp/ ${config.path}/wcp/current/`, {silent: true});
		shelljs.exec(`cp -R ${__dirname}/perf-lib/ ${config.path}/wcp/current/`, {silent: true});
		shelljs.exec(`polymer install --variants --root ${config.path}/wcp/current`, {silent: true});
		
		const bwr = JSON.parse(fs.readFileSync(`${config.path}/wcp/current/bower.json`));
		config.runs.current = bwr.variants ? Object.keys(bwr.variants) : [];
		config.runs.current.push('mainline');
		config.components = bwr.main;
		writeConfig(config, `${config.path}/wcp/current`);

		for(let version of config.regressions) {
			console.log(`Initializing the ${version} version...`);
			shelljs.mkdir('-p', `${config.path}/wcp/${version}`);
			shelljs.exec(`cp -R ${config.path}/wcp/current/ ${config.path}/wcp/${version}/`, {silent: true});
			var init = shelljs.exec(`cd ${config.path}/wcp/${version} && git checkout -- . && git checkout ${version} && polymer install --variants`, {silent: true});

			if(init.code)
				return reject(init.toString().red + '\nError: Are there conflicts in your Bower dependencies?');

			const bwr = JSON.parse(fs.readFileSync(`${config.path}/wcp/${version}/bower.json`));
			config.runs[version] = bwr.variants ? Object.keys(bwr.variants) : [];
			config.runs[version].push('mainline');
			config.components = bwr.main;

			writeConfig(config, `${config.path}/wcp/${version}`);

			if(!config.runs[version].includes('1-x'))
				shelljs.rm('-rf', `${config.path}/wcp/${version}/bower_components-1.x`);
		};

		return resolve(config);
	});
};

const getBrowsers = config => {
	return new Promise((resolve, reject) => {
		if(config.browser && config.browser.length) 
			return resolve(config);

		browsers.detect(available => {
			console.log(available);

			config.browser = available.filter(browser => {
				return !browser.command.startsWith('/Volumes/');
			}).map(browser => {
				return `"${browser.command}"`;
			});

			return resolve(config);
		});
	});
};

module.exports = config => {
	return new Promise((resolve, reject) => {
		console.log('Initialization'.bold);

		copy(config)
		.then(getBrowsers)
		.then(resolve)
		.catch(reject);
	});
};