#!/usr/bin/env node

const commander = require('commander');
const builder = require(',/builder');

commander.parse(process.argv);

// console.log(commander)

const type = commander.type;
const isMin = commander.min;

builder(type, isMin);
