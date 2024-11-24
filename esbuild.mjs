import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin'
import { copy } from 'esbuild-plugin-copy';

/** @type {import('esbuild').BuildOptions} */
const options = {
    entryPoints: ['./src_web/**/*.ts', './src_web/**/*.scss'],
    entryNames: '[dir]/[name]',
    bundle: true,
    platform: 'browser',
    target: ['es2020'],
    format: 'esm',
    sourcemap: false,
    outdir: './web',
    loader: {
        '.png': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.eot': 'dataurl',
        '.ttf': 'dataurl',
        '.svg': 'file',
        '.gif': 'dataurl'
    },
    plugins: [sassPlugin({}), copy({
        assets: [{
            from: './src_web/**/*.{html,js}',
            // this is relative to outdir, so go to root of that
            to: './'
        }]
    }), {
        name: 'bundle node modules stuff only', setup: (build) => {
            build.onResolve({ filter: /\.js$/i }, args => {
                let markExternal = true;
                if (args.path.includes('@shoelace-style') || args.path.includes('@alenaksu') || args.resolveDir.includes('node_modules')) {
                    markExternal = false;
                }
                return { external: markExternal }
            })
        }
    }]
}

if (process.argv.includes('--watch')) {
    const ctx = await esbuild.context(options);
    ctx.watch({});
}
else {
    esbuild.build(options);
}
