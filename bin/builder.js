const { WayArray } = require('@oneline/utils');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const scssVar = require('../lib/variable.js');

function resolve(src) {
  return path.resolve(__dirname, src);
}


function replaceVar(content, variable) {
  Object.keys(variable).forEach((key => {
    const varRegx = new RegExp(`--${key}--`, "ig");
    let value = variable[key];
    if (Array.isArray(value)) {
      value = `(${value.join(",")})`
    }

    content = content.replace(varRegx, value);
  }))

  return content;
}


module.exports = function builder(type = "pc", isMin) {

  const fsSizes = new WayArray(8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 50, 60)
  const perSizes = new WayArray();
  for(let i = 1; i <= 24; i++ ) perSizes.push(100/i);
  
  const variable = {
    "fs-sizes": fsSizes,
    "per-sizes": perSizes,
    "size-unit": type == 'app' ? 'rpx' : 'px',
    "size-mult": type == 'app' ? 2 : 1,
    ...scssVar
  }
  console.log(isMin, variable)

 

  const min = isMin ? 'compressed' : 'expanded';


  const pathMap = {};



  sass.render({
    watch: true,
    file: resolve("../lib/index.scss"),
    outFile: resolve('../dist'),
    outputStyle: min, //compact | compressed | expanded
    importer(url, prev, done) {
      
      // console.log(prev, abpath, url);
      
      //简单处理一下路径问题
      if(!pathMap[url]) {
        if(path.isAbsolute(prev)) {
          pathMap[url] = prev; 
        } else {
          pathMap[url] = path.resolve(path.dirname(pathMap[prev]),prev);
        }
      }

      // console.log(pathMap, url);
      const abpath = path.resolve(path.dirname(pathMap[url]), url);

      if(fs.existsSync(abpath)) {
        let content = fs.readFileSync(abpath);

        content = replaceVar(content.toString('utf-8'), variable);
  
        //   console.log(content);
        //   console.log(url, prev, done, path.resolve(prev, url), path.dirname(prev));
  
        return { path: abpath, contents: content }
      }

      done(new Error("米有文件"))

     
    }
  },

    (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      let compilerResult = result.css.toString("utf-8");
      compilerResult = replaceVar(compilerResult, variable);
      // console.log(compilerResult)
      const dist = ["../dist/"];
      const filename = type == 'app' ? 'index.app' : 'index';
      dist.push(filename);

      isMin && dist.push(".min");

      dist.push(".css");
      const filepath = dist.join("");
      fs.writeFileSync(path.resolve(__dirname, filepath), compilerResult, { flag: 'w' });
    })

}