import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin'
import { copy } from 'esbuild-plugin-copy';

/** @type {import('esbuild').BuildOptions} */
const options = {
    entryPoints: ['./src_web/**/*.ts', './src_web/**/*.scss'],
    entryNames: '[dir]/[name]',
    external: [],
    bundle: false,
    platform: 'browser',
    target: ['es2020'],
    sourcemap: false,
    outdir: './web',
    plugins: [sassPlugin({}), copy({
        assets: [{
            from: './src_web/**/*.html',
            // this is relative to outdir, so go to root of that
            to: './'
        }]
    })]
}

if(process.argv.includes('--watch'))
{
    const ctx = await esbuild.context(options);
    ctx.watch({  });
}
else{
    esbuild.build(options);
}
