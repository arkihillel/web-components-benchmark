const cli = require('command-line-args');

const cliDefinition = [
	{
		name: 'output',
		alias: 'o',
		type: String,
		description: 'Save the results to a JSON file'
	}, 
	{
		name: 'browser',
		alias: 'b',
		type: String,
		defaultValue: [],
		description: 'Browser against which the performance test will be run – Default: [chrome]'
	},
	{
		name: 'all-browsers',
		alias: 'a',
		type: Boolean,
		defaultValue: false,
		description: 'Runs against all avaliable browsers'
	},
	{
		name: 'regression-testing',
		alias: 'r',
		type: String,
		multiple: true,
		defaultValue: [],
		description: 'Tests against a previous version of the component\n- "last" – Last Git tag\n- "tags/[xxx]" – compares against a specific Git tag\n- [commit-hash] – compares against a specific Git commit'
	},
	{
		name: 'quiet',
		alias: 'q',
		type: Boolean,
		defaultValue: false,
		description: 'Silence output'
	}, 
	{
		name: 'path',
		alias: 'p',
		type: String,
		defaultValue: process.cwd(),
		description: 'Path to the component'
	}, 
	{
		name: 'keep-copied-files',
		type: Boolean,
		defaultValue: false,
		description: 'Keep copied files after the run – Defaults to false'
	}, 
	{
		name: 'verbose',
		alias: 'v',
		type: Boolean,
		defaultValue: true,
		description: 'Verbose mode'
	},  
	{
		name: 'help',
		alias: 'h',
		type: Boolean,
		description: 'This page'
	}
];

const config = cli(cliDefinition);


if (config.help) {
	const getUsage = require('command-line-usage');

	const sections = [{
		header: 'Web Component Benchmark',
		content: 'Benchmarks Web Components by running them multiple time'
	}, {
		header: 'Options',
		optionList: cliDefinition
	}]
	const usage = getUsage(sections);

	console.log(usage);
	process.exit();
}

if (config.verbose) console.log(config);

config.regressions = config['regression-testing'];

module.exports = config;