#!/usr/bin/env node
'use strict';

const execSync = require('child_process').execSync;

let browserSync = require('browser-sync').create();

execSync('tsc; npm run browserify; node site/scripts/generateReadme.js; cp ./site/*.css ./site-gh-pages; cp ./site/*.html ./site-gh-pages', { stdio: [0, 1, 2] });

browserSync.init({
    server: 'site-gh-pages',
    files: [
        'site-gh-pages/index.html'
    ]
});

browserSync.watch('site/scripts/*.js', (event) => {
    if (event === 'change') {
        execSync('npm run browserify', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('site/*.css', (event) => {
    if (event === 'change') {
        execSync('cp ./site/*.css ./site-gh-pages', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('site/*.html', (event) => {
    if (event === 'change') {
        execSync('cp ./site/*.html ./site-gh-pages', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('typescript/src/*.js', (event) => {
    if (event === 'change') {
        execSync('tsc', { stdio: [0, 1, 2] });
        execSync('npm run browserify', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('site/scripts/generateReadme.js', (event) => {
    if (event === 'change') {
        execSync('node site/scripts/generateReadme.js', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('README.md', (event) => {
    if (event === 'change') {
        execSync('node site/scripts/generateReadme.js', { stdio: [0, 1, 2] });
    }
});
