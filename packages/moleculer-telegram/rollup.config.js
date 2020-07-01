import autoExternal from 'rollup-plugin-auto-external';
import esbuild from 'rollup-plugin-esbuild';
import builtinModules from 'builtin-modules';
import nodeResolve from '@rollup/plugin-node-resolve';
import pkgJson from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default () => {
  const resolveOptions = {
    mainFields: ['jsnext:main', 'es2020', 'es2018', 'es2017', 'es2015', 'module', 'main'],
    preferBuiltins: true,
    extensions: ['.ts', '.js', '.mjs', '.node'],
    modulesOnly: false,
    browser: false
  };
  const plugins = [
    autoExternal({
      builtins: true,
      peerDependencies: true,
      dependencies: true
    }),
    nodeResolve(resolveOptions),
    esbuild({
      minify: isProd,
      target: 'esnext'
    })
  ];
  const inputMain = {
    input: './src/index.ts',
    treeshake: true,
    output: {
      sourcemap: !isProd,
      format: 'cjs',
      file: pkgJson.main
    },
    external: [...builtinModules],
    plugins
  };
  const inputModule = {
    ...inputMain,
    output: {
      sourcemap: !isProd,
      format: 'esm',
      file: pkgJson.module
    }
  };
  return [inputMain, inputModule];
}
