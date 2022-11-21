#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const version = require('../package.json').version;
const createModel = require('../lib/create');
const name = 'drupal-theme-cli';

program
  .name(name)
  .version(version)
  .usage('<command> [option]');

program.on('--help', () => {
  console.log();
  console.log(`Run ${chalk.cyan(`${name} <command> --help`)} for detailed usage of given command.`);
});

program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((name, options) => {
    createModel(name, options);
  })

program.parse(process.argv);
