#!/usr/bin/env node
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const commander = require('commander');
const {WayArray} = require('@oneline/utils');
commander.parse(process.argv);

console.log(commander)
function resolve(src) {
    return path.resolve(__dirname, src);
}
const fsSizes = new WayArray(8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 50, 60)
 
const variable = {
    "fs-sizes": fsSizes,
    "size-unit": commander.type == 'app'?'rpx':'px',
    "size-mult": commander.type == 'app'? 2:1
}

const min = commander.min ? 'compressed': 'expanded';

sass.render({
    watch: true,
    file: resolve("../lib/index.scss"),
    outFile: resolve('../dist'),
    outputStyle: min, //compact | compressed | expanded
    importer(url, prev, done) {
      const abpath = path.resolve(path.dirname(prev), url);

      let content = fs.readFileSync(abpath);
      Object.keys(variable).forEach((key => {
          const varRegx = new RegExp(`--${key}--`, "ig");
          let value = variable[key];
          if(Array.isArray(value)) {
              value = `(${value.join(",")})`
          }

          content = content.toString('utf-8').replace(varRegx, value);
      }))

    //   console.log(content);
    //   console.log(url, prev, done, path.resolve(prev, url), path.dirname(prev));
      
      return {path: abpath , contents: content}
    }
}, 

(err, result) => {
    if(err) {
        console.error(err);
        return;
    }
    const compilerResult = result.css.toString("utf-8");
    // console.log(compilerResult)
    const dist = ["../dist/"];
    const filename =  commander.type == 'app' ? 'index.app' : 'index';
    dist.push(filename);
    
    commander.min && dist.push(".min");

    dist.push(".css");
    const filepath = dist.join("");
    fs.writeFileSync(path.resolve(__dirname, filepath), compilerResult, {flag: 'w'});
})
