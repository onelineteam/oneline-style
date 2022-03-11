const path = require('path');
const fs = require('fs');

function parseInclude(html, dir)
{
  //console.log("parseInclude", dir);
  const ma = html.matchAll(/<\!-- *inc +([^-]+) *-->/ig);
  //console.log(ma.next())
   for(let item of ma)
   {
     //console.log(item, ">>>")
     const filePath = item[1];
     const file = path.resolve(__dirname, dir, filePath);
     const content = fs.readFileSync(file).toString("utf-8");
     html = html.replace(item[0], content);
   }
   return html;
}

module.exports = {parseInc: parseInclude}