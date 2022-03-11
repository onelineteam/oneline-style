const fs = require('fs');
const path = require('path');

const commander = require('commander');
commander.option("-t, --type <type>", "编译类型: pc, app");
commander.option("--min", "是否压缩");


const builder = require('./builder');


 


commander.parse(process.argv);

// console.log(commander)

const type = commander.type;
const isMin = commander.min;
const watchfn = (e, file) => {
  console.log(type, isMin);
  builder(type, isMin);
};
fs.watch(path.resolve(__dirname, "../lib"), watchfn);
fs.watch(path.resolve(__dirname, "../lib/components"), watchfn);
fs.watch(path.resolve(__dirname, "../lib/form"), watchfn);



