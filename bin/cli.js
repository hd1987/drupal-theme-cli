#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const version = require('../package.json').version;
const createModel = require('../lib/create');
const name = 'drupal-theme-cli';

program
  .name(name)
  .version(version)
  .usage('[option]')
  .description('Create a new project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((options) => {
    createModel(options);
  })

program.on('--help', () => {
  console.log();
  console.log(`Run ${chalk.cyan(`${name} --help`)} for detailed usage of given command.`);
});

program.parse(process.argv);
