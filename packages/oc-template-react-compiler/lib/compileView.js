const fs = require('fs-extra');
const vite = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');
const EnvironmentPlugin = require('vite-plugin-environment').default;
const hashBuilder = require('oc-hash-builder');
const ocViewWrapper = require('oc-view-wrapper');
const { callbackify } = require('util');
const viewTemplate = require('./viewTemplate');
const reactOCProviderTemplate = require('./reactOCProviderTemplate');
const cssModules = require('./cssModulesPlugin');

const clientName = 'clientBundle';

const partition = (array, predicate) => {
  const matches = [];
  const rest = [];
  for (const element of array) {
    if (predicate(element)) {
      matches.push(element);
    } else {
      rest.push(element);
    }
  }
  return [matches, rest];
};

async function compileView(options) {
  function processRelativePath(relativePath) {
    let pathStr = path.join(options.componentPath, relativePath);
    if (process.platform === 'win32') {
      return pathStr.split('\\').join('\\\\');
    }
    return pathStr;
  }

  const staticFiles = options.componentPackage.oc.files.static;
  const staticFolder = Array.isArray(staticFiles) ? staticFiles[0] : staticFiles;
  const viewFileName = options.componentPackage.oc.files.template.src;
  const componentPath = options.componentPath;
  const viewPath = processRelativePath(viewFileName);

  const publishPath = options.publishPath;
  const tempPath = path.join(publishPath, 'temp');
  const publishFileName = options.publishFileName || 'template.js';
  const componentPackage = options.componentPackage;
  const { getInfo } = require('../index');
  const externals = getInfo().externals;
  const production = !!options.production;

  const reactOCProviderContent = reactOCProviderTemplate({ viewPath });
  const reactOCProviderName = 'reactOCProvider.tsx';
  const reactOCProviderPath = path.join(tempPath, reactOCProviderName);

  await fs.outputFile(reactOCProviderPath, reactOCProviderContent);

  const globals = externals.reduce((externals, dep) => {
    externals[dep.name] = dep.global;
    return externals;
  }, {});

  const result = await vite.build({
    appType: 'custom',
    root: componentPath,
    mode: production ? 'production' : 'development',
    plugins: [react(), EnvironmentPlugin(['NODE_ENV']), cssModules()],
    logLevel: 'silent',
    build: {
      sourcemap: !production,
      lib: { entry: reactOCProviderPath, formats: ['iife'], name: clientName },
      write: false,
      minify: production,
      rollupOptions: {
        external: Object.keys(globals),
        output: {
          globals
        }
      }
    }
  });
  const out = Array.isArray(result) ? result[0] : result;
  const bundle = out.output.find((x) => x.facadeModuleId.endsWith(reactOCProviderName)).code;
  const [cssAssets, otherAssets] = partition(
    out.output.filter((x) => x.type === 'asset'),
    (x) => x.fileName.endsWith('.css')
  );
  const cssStyles = cssAssets.map((x) => x.source.replace(/\n/g, '') ?? '').join(' ');
  const bundleHash = hashBuilder.fromString(bundle);
  const wrappedBundle = `(function() {
    ${bundle}

    return ${clientName};
  })()`;

  const reactRoot = `oc-reactRoot-${componentPackage.name}`;
  const templateString = viewTemplate({
    reactRoot,
    css: cssStyles,
    externals,
    wrappedBundle,
    hash: bundleHash
  });
  const templateStringCompressed = production
    ? templateString.replace(/\s+/g, ' ')
    : templateString;
  const hash = hashBuilder.fromString(templateStringCompressed);
  const view = ocViewWrapper(hash, templateStringCompressed);

  await fs.unlink(reactOCProviderPath);
  await fs.mkdir(publishPath, { recursive: true });
  await fs.writeFile(path.join(publishPath, publishFileName), view);
  if (staticFolder) {
    for (const asset of otherAssets) {
      // asset.fileName could have paths like assets/file.js
      // so we need to create those extra directories
      await fs.ensureFile(path.join(publishPath, staticFolder, asset.fileName));
      await fs.writeFile(
        path.join(publishPath, staticFolder, asset.fileName),
        asset.source,
        'utf-8'
      );
    }
  }

  return {
    template: {
      type: options.componentPackage.oc.files.template.type,
      hashKey: hash,
      src: publishFileName
    }
  };
}

module.exports = callbackify(compileView);
