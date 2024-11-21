import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin'

esbuild.build({
    entryPoints: ['./src_web/**/*.ts', './src_web/**/*.scss'],
    entryNames: '[dir]/[name]',
    external: [],
    bundle: false,
    platform: 'browser',
    target: ['es2020'],
    sourcemap: false,
    outdir: './web',
    plugins: [sassPlugin({})]
});
