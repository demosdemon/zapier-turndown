import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';
// import replace from 'rollup-plugin-replace';

const externalModules = [
  'bluebird',
  'cssom',
  'rollup-plugin-node-builtins',
  'sshpk',
  'zapier-platform-core',
];

function getNodeModule(path) {
  const anchor = 'node_modules/';
  const index = path.indexOf(anchor);

  if (index === -1)
    return undefined;

  const end = path.indexOf('/', index + anchor.length);
  return path.slice(index + anchor.length, end === -1 ? undefined : end);
}

const seen = {
  files: new Set(),
  modules: new Set(),
};

const logFile = id => {
  if (seen.files.has(id))
    return;
  seen.files.add(id);
  console.log(`isExternal(${id});`);
}

const logModule = id => {
  if (seen.modules.has(id))
    return;
  seen.modules.add(id);
  console.log(`getNodeModule() = '${id}';`);
}

const isExternal = id => {
  if (id.startsWith('\0'))
    return false;

  const colon = id.indexOf(':');
  const proxy = colon === -1 ? null : id.slice(0, colon);
  const path = id.slice(colon + 1);

  if (externalModules.indexOf(path) !== -1)
    return true;

  logFile(id);
  const module = getNodeModule(id);

  if (module)
    logModule(module);

  if (module && externalModules.indexOf(module) !== -1)
    return true;
};

export default {
  input: 'lib/index.js',
  external: isExternal,
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    sourceMap: false,
  },
  plugins: [
    commonjs(),
    json({
      preferConst: true,
    }),
    nodeBuiltins(),
    nodeGlobals(),
    nodeResolve(),
    // replace(),
  ],
};
