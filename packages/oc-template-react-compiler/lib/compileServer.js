const vite = require('vite');
const fs = require('fs-extra');
const path = require('path');
const { callbackify } = require('util');
const coreModules = require('builtin-modules');
const hashBuilder = require('oc-hash-builder');
const higherOrderServerTemplate = require('./higherOrderServerTemplate');

const nodeModuleMatcher = /^[a-z@][a-z\-/0-9.]+$/i;

async function compileServer(options) {
  const componentPath = options.componentPath;
  const serverFileName = options.componentPackage.oc.files.data;
  let serverPath = path.join(options.componentPath, serverFileName);
  if (process.platform === 'win32') {
    serverPath = serverPath.split('\\').join('\\\\');
  }
  const publishFileName = options.publishFileName || 'server.js';
  const publishPath = options.publishPath;
  const dependencies = options.componentPackage.dependencies || {};
  const componentName = options.componentPackage.name;
  const componentVersion = options.componentPackage.version;
  const production = !!options.production;

  const higherOrderServerContent = higherOrderServerTemplate({
    serverPath,
    componentName,
    componentVersion
  });
  const tempFolder = path.join(publishPath, 'temp');
  const higherOrderServerPath = path.join(tempFolder, '__oc_higherOrderServer.ts');
  const externals = [...Object.keys(dependencies), ...coreModules];

  try {
    await fs.outputFile(higherOrderServerPath, higherOrderServerContent);

    const result = await vite.build({
      appType: 'custom',
      root: componentPath,
      mode: production ? 'production' : 'development',
      logLevel: options.verbose ? 'info' : 'silent',
      build: {
        lib: { entry: higherOrderServerPath, formats: ['cjs'] },
        write: false,
        minify: production,
        rollupOptions: {
          external: (id) => {
            if (nodeModuleMatcher.test(id)) {
              if (!externals.includes(id)) {
                throw new Error(`Missing dependencies from package.json => ${id}`);
              }
              return true;
            }
            return false;
          }
        }
      }
    });
    const out = Array.isArray(result) ? result[0] : result;
    const bundle = out.output[0].code;

    await fs.ensureDir(publishPath);
    await fs.writeFile(path.join(publishPath, publishFileName), bundle);

    return {
      type: 'node.js',
      hashKey: hashBuilder.fromString(bundle),
      src: publishFileName
    };
  } finally {
    await fs.remove(tempFolder);
  }
}

module.exports = callbackify(compileServer);
