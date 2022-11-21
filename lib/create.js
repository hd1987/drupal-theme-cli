const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const ora = require('ora');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const rewriteFiles = require('./rewriteFilesByOptions');


const cwd = process.cwd();

class Creator {
  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.targetDir = path.join(cwd, name);
  };

  async create() {
    const isOverwrite = await this.handleDirectory();

    if (!isOverwrite) return;
    await this.downloadTemplate('hd1987/drupal-theme-template');
    await rewriteFiles.action(this.targetDir, this.name);
    await this.showTips();
  };

  async handleDirectory() {
    if (fs.existsSync(this.targetDir)) {
      if (this.options.force) {
        await fs.remove(this.targetDir);
      } else {
        const { action } = await new inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: 'Target directory already exists Pick an action:',
            choices: [
              {
                name: 'Overwrite',
                value: true,
              },
              {
                name: 'Cancel',
                value: false,
              }
            ],
          }
        ]);
  
        if (action) {
          await fs.remove(this.targetDir);
        } else {
          console.log(chalk.red.bold('Termination of creation'));
          return false;
        }
      }
    }
    return true;
  }

  async downloadTemplate(url) {
    this.downloadGitRepo = util.promisify(downloadGitRepo);
    const loading = ora('Download template...')
    loading.start();
    await this.downloadGitRepo(url, this.targetDir);
    loading.succeed();
  }

  async showTips() {
    console.log();
    console.log(`Successfully created project ${chalk.cyan(this.name)}`);
    console.log();
    console.log(`  cd ${chalk.cyan(this.name)}`);
    console.log();
    console.log("  npm install");
    console.log("  npm start");
  }
};

module.exports = async (name, options) => {
  const creator = new Creator(name, options);
  await creator.create();
}
