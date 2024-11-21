
// TODO

if((window as any).jkImageWindow)
{
    console.log('in custom window!')
}
// setup a watch dev script for esbuild
// commmunicate between imageFeed.ts and here with window.postmessage and onMessage, etc
// also add option to ignore temp dir, etc.
// keep it simple for now, just a ligthbox maybe?

// also try what this guy is doing here: https://github.com/tachyon-beep/comfyui-simplefeed/blob/main/web/js/imageTray.js#L1252
// detecting image nodes, would that be better?
// try that first, install and debug and se what hes doing