const shelljs		= require('shelljs');

module.exports = config => {
	return new Promise((resolve, reject) => {
		if(!config['keep-copid-files']){
			console.log('Removing copied files...');
			shelljs.rm('-rf', `${__dirname}/tmp`);
			shelljs.rm('-rf', `${config.path}/wcp`);
		}

		return resolve();
	});
};