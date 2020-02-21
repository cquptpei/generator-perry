'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');
const copyFile = require('./libs/copyFile');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  // 接受用户输入
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the geometric ${chalk.red('generator-perry')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'namespace',
        message: 'Please input your project namespace,such as @perry:',
        default: ''
      },
      {
        type: 'input',
        name: 'name',
        message: 'Please input project name:',
        default: 'perry-demo'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please input project description:',
        default: 'a cli demo'
      },
      {
        type: 'input',
        name: 'main',
        message: 'Main file (index.js):',
        default: 'index.js'
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        default: 'cli,tool'
      },
      {
        type: 'input',
        name: 'author',
        message: '"Author\'s Name"',
        default: this.user.git.name()
      },
      {
        type: 'input',
        name: 'email',
        message: '"Author\'s Email"',
        default: this.user.git.email()
      },
      {
        type: 'input',
        name: 'repository',
        message: 'Project homepage url',
        default: ''
      },
      {
        type: 'input',
        name: 'homepage',
        message: '"Author\'s Homepage"',
        default: ''
      },
      {
        type: 'input',
        name: 'license',
        message: 'License',
        default: 'MIT'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      if (this.props.namespace) {
        this.props.fullName = this.props.namespace + '/' + this.props.name;
      } else {
        this.props.fullName = this.props.name
      }
    });
  }

  // 创建项目目录
  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(`\nYour generator must be inside a folder named
        ${this.props.name}\n
        I will automatically create this folder.\n`);
      
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  writing() {
    this.log('\nWriting...\n');
    this._writingPackageJson();
    this._writingREADME();
    this._writingBabelrc();
    this._writingGitignore();
    this._writingEditorConfig();
    this._writingEslintrc();
    this._writingEslintIgnore();
    this._writingSrc();
  }

  _writingPackageJson() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        name: this.props.name,
        fullName: this.props.fullName,
        description: this.props.description,
        keywords: this.props.keywords.split(','),
        author: this.props.author,
        email: this.props.email,
        repository: this.props.repository,
        homepage: this.props.homepage,
        license: this.props.license
      }
    )
  }

  _writingREADME() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        fullName: this.props.fullName,
        description: this.props.description,
        email: this.props.email,
        author: this.props.author,
        year: new Date().getFullYear()
      }
    )
  }

  _writingBabelrc() {
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    )
  }

  _writingGitignore() {
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    )
  }

  _writingEditorConfig() {
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    )
  }

  _writingEslintrc() {
    this.fs.copyTpl(
      this.templatePath('.eslintrc.js'),
      this.destinationPath('.eslintrc.js')
    )
  }

  _writingEslintIgnore() {
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore')
    )
  }

  _writingSrc() {
    copyFile(this.sourceRoot() + '/src', this.destinationRoot() + '/src');
  }

  install() {
    this.log('\nInstall deps...\n');
    this.installDependencies({ bower: false });
  }
};
