//const { WayArray } = require('@oneline/utils');
const {fontSize, perSize} = require('../config/size');
const {olColor} = require('../config/color');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const ugl = require('uglifycss');
//const scssVar = require('../lib/variable.js');


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

  const variable = {
    "fs-sizes": fontSize,
    "per-sizes": perSize,
    "size-unit": type == 'app' ? 'rpx' : 'px',
    "size-mult": ['app','taro'].indexOf(type) > -1 ? 2 : 1,
     
    ...olColor
    //...scssVar
  }
  //console.log(isMin, variable)

 

  // const min = isMin ? 'compressed' : 'expanded';


  const pathMap = {};



  sass.render({
    watch: true,
    file: resolve("../lib/index.scss"),
    outFile: resolve('../dist'),
    outputStyle: 'expanded', //compact | compressed | expanded
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

      ////////////////////////////////////////////////////////////////
      if(isMin) {
       compilerResult = ugl.processString(compilerResult);
      }
      /////////
      const dist = ["../dist/"];
      const filename = type == 'pc' ? 'index' : 'index.' + type;
      dist.push(filename);

      isMin && dist.push(".min");

      dist.push(".css");
      const filepath = dist.join("");
      fs.writeFileSync(path.resolve(__dirname, filepath), compilerResult, { flag: 'w' });
    })

}