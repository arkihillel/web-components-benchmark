const exec 		= require('child_process').exec;

const execPolyServe = (path, browsers, components) => {
	console.log(`polymer serve --root ${path} -o --open-path runner.html -b ${browsers.join(' -b ')}`);
	const server = exec(`polymer serve --root ${path} -o --open-path runner.html --sources harness.html -b ${browsers.join(' -b ')}`);
	return server.pid;
};

const killPid = pid => {
	process.kill(-pid);
};

module.exports = {
	start: execPolyServe,
	stop: killPid
};