const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const ora = require('ora');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const semver = require('semver');
const rewriteFiles = require('./rewriteFilesByOptions');
const { REPOSITORY_PATH, LOWEST_NODE_VERSION } = require('./constant');


const cwd = process.cwd();

class Creator {
  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.targetDir = path.join(cwd, name);
  };

  async create() {
    const checkNode = this.checkNodeVersion();
    if (!checkNode) return;
    const isOverwrite = await this.handleDirectory();
    if (!isOverwrite) return;
    await this.downloadTemplate(REPOSITORY_PATH);
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
    await this.downloadGitRepo(url, this.targetDir, { clone: true });
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

  checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
      console.log(chalk.yellow(`The minimum version of node is required v${lowestVersion}，The current node.js version is ${currentVersion}`));
      return false
    }
    return true;
}
};

module.exports = async (name, options) => {
  const creator = new Creator(name, options);
  await creator.create();
}
