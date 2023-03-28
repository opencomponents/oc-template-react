const chalk = require('chalk');
const fs = require('fs');
const resolve = require('resolve');
const path = require('path');
const os = require('os');
const immer = require('immer').produce;

function writeJson(fileName, object) {
  fs.writeFileSync(fileName, JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL);
}

function verifyTypeScriptSetup(componentPath) {
  const paths = {
    appTsConfig: path.resolve(componentPath, 'tsconfig.json'),
    yarnLockFile: path.resolve(componentPath, 'yarn.lock'),
    appNodeModules: path.resolve(componentPath, 'node_modules'),
    appTypeDeclarations: path.resolve(componentPath, 'src', 'oc-app.d.ts')
  };
  let firstTimeSetup = false;

  if (!fs.existsSync(paths.appTsConfig)) {
    writeJson(paths.appTsConfig, {});
    firstTimeSetup = true;
  }

  const isYarn = fs.existsSync(paths.yarnLockFile);

  // Ensure typescript is installed
  let ts;
  try {
    ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules
    }));
  } catch (_) {
    console.error(
      chalk.bold.red(
        `It looks like you're trying to use TypeScript but do not have ${chalk.bold(
          'typescript'
        )} installed.`
      )
    );
    console.error(
      chalk.bold(
        'Please install',
        chalk.cyan.bold('typescript'),
        'by running',
        chalk.cyan.bold(isYarn ? 'yarn add typescript' : 'npm install typescript') + '.'
      )
    );
    console.error();
    process.exit(1);
  }

  const compilerOptions = {
    // These are suggested values and will be set when not present in the
    // tsconfig.json
    // 'parsedValue' matches the output value from ts.parseJsonConfigFileContent()
    target: {
      parsedValue: ts.ScriptTarget.ES5,
      suggested: 'es5'
    },
    lib: { suggested: ['dom', 'dom.iterable', 'esnext'] },
    allowJs: { suggested: true },
    skipLibCheck: { suggested: true },
    esModuleInterop: { suggested: true },
    allowSyntheticDefaultImports: { suggested: true },
    strict: { suggested: true },
    forceConsistentCasingInFileNames: { suggested: true },
    // TODO: Enable for v4.0 (#6936)
    // noFallthroughCasesInSwitch: { suggested: true },

    // These values are required and cannot be changed by the user
    // Keep this in sync with the rollup config
    module: {
      parsedValue: ts.ModuleKind.ESNext,
      value: 'esnext',
      reason: 'for import() and import/export'
    },
    moduleResolution: {
      parsedValue: ts.ModuleResolutionKind.NodeJs,
      value: 'node',
      reason: 'to match rollup resolution'
    },
    resolveJsonModule: { value: true, reason: 'to match rollup loader' },
    isolatedModules: { value: true, reason: 'implementation limitation' },
    jsx: {
      parsedValue: ts.JsxEmit.ReactJSX,
      suggested: 'react-jsx'
    },
    paths: { value: undefined, reason: 'aliased imports are not supported' }
  };

  const formatDiagnosticHost = {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => os.EOL
  };

  const messages = [];
  let appTsConfig;
  let parsedTsConfig;
  let parsedCompilerOptions;
  try {
    const { config: readTsConfig, error } = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile);

    if (error) {
      throw new Error(ts.formatDiagnostic(error, formatDiagnosticHost));
    }

    appTsConfig = readTsConfig;

    // Get TS to parse and resolve any "extends"
    // Calling this function also mutates the tsconfig above,
    // adding in "include" and "exclude", but the compilerOptions remain untouched
    let result;
    parsedTsConfig = immer(readTsConfig, (config) => {
      result = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(paths.appTsConfig));
    });

    if (result.errors && result.errors.length) {
      throw new Error(ts.formatDiagnostic(result.errors[0], formatDiagnosticHost));
    }

    parsedCompilerOptions = result.options;
  } catch (e) {
    if (e && e.name === 'SyntaxError') {
      console.error(
        chalk.red.bold(
          'Could not parse',
          chalk.cyan('tsconfig.json') + '.',
          'Please make sure it contains syntactically correct JSON.'
        )
      );
    }

    console.log(e && e.message ? `${e.message}` : '');
    process.exit(1);
  }

  if (appTsConfig.compilerOptions == null) {
    appTsConfig.compilerOptions = {};
    firstTimeSetup = true;
  }

  for (const option of Object.keys(compilerOptions)) {
    const { parsedValue, value, suggested, reason } = compilerOptions[option];

    const valueToCheck = parsedValue === undefined ? value : parsedValue;
    const coloredOption = chalk.cyan('compilerOptions.' + option);

    if (suggested != null) {
      if (parsedCompilerOptions[option] === undefined) {
        appTsConfig.compilerOptions[option] = suggested;
        messages.push(
          `${coloredOption} to be ${chalk.bold('suggested')} value: ${chalk.cyan.bold(
            suggested
          )} (this can be changed)`
        );
      }
    } else if (parsedCompilerOptions[option] !== valueToCheck) {
      appTsConfig.compilerOptions[option] = value;
      messages.push(
        `${coloredOption} ${chalk.bold(valueToCheck == null ? 'must not' : 'must')} be ${
          valueToCheck == null ? 'set' : chalk.cyan.bold(value)
        }` + (reason != null ? ` (${reason})` : '')
      );
    }
  }

  // tsconfig will have the merged "include" and "exclude" by this point
  if (parsedTsConfig.include == null) {
    appTsConfig.include = ['src'];
    messages.push(`${chalk.cyan('include')} should be ${chalk.cyan.bold('src')}`);
  }

  if (parsedTsConfig.exclude == null) {
    appTsConfig.exclude = ['src/_package'];
    messages.push(`${chalk.cyan('exclude')} should have ${chalk.cyan.bold('src/_package')}`);
  }

  if (messages.length > 0) {
    if (firstTimeSetup) {
      console.log(
        chalk.bold('Your', chalk.cyan('tsconfig.json'), 'has been populated with default values.')
      );
      console.log();
    } else {
      console.warn(
        chalk.bold(
          'The following changes are being made to your',
          chalk.cyan('tsconfig.json'),
          'file:'
        )
      );
      messages.forEach((message) => {
        console.warn('  - ' + message);
      });
      console.warn();
    }
    writeJson(paths.appTsConfig, appTsConfig);
  }

  // Reference `oc-template-typescript-react-compiler` types
  if (!fs.existsSync(paths.appTypeDeclarations)) {
    fs.writeFileSync(
      paths.appTypeDeclarations,
      `/// <reference types="oc-template-typescript-react" />${os.EOL}`
    );
  }
}

module.exports = verifyTypeScriptSetup;
