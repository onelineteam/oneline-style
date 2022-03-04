const { start } = require('@oneline/core');
const Watchpack = require('watchpack');
const watch = new Watchpack({ poll: true });
const path = require('path');
const fs = require('fs');
 
const fileType = {
  "css": "text/css",
  "js": "application/javascript",
  "png": "image/png",
  "jpeg": "image/jpeg",
  "jpg": "image/jpg",
  "svg": "application/svg"
}

const builder = require('../bin/builder')
const appFile = path.resolve(__dirname, '../lib');
const htmlFile = path.resolve(__dirname, '../view/pages');

let socket = null;

watch.watch([], [appFile, htmlFile], Date.now());
watch.on('change', (filePath) => {
  // console.log("文件改变", ":", filePath);
  builder('pc', false);
  if (socket) {
    socket.send("true");
  }
});


const socketTemplate = `<script>
    const socket = new WebSocket("ws://0.0.0.0:5000/live");
      socket.onmessage = (msgEvt) => {
         if(msgEvt.data == "true") {
           window.location.reload()
         } 
    }
    </script>
`
const cssTemplate = `
  <link rel="stylesheet" href="/css/index.min.css" type="text/css">
`

const app = start(5000, {
  static: {
    prefix: "/css",
    path: path.resolve(__dirname, "../dist")
  },
  cros: {
    origin: '*',
    allowedHeaders: ["Verify", "Origin", "Access-Control-Allow-Origin", "Access-Control-Request-Headers", "X-Requested-With", "Content-Type", "Accept", "Referer", "User-Agent"]
  }
}, [], () => {
  console.log("启动成功")
})

function getCommon() {

  let index = fs.readFileSync(path.resolve(__dirname, "../view/pages/template.html")).toString("utf-8");
  index = index.replace("</head>", cssTemplate + "</head>");
  index = index.replace("</body>", socketTemplate + "</body>");
  return index;
}

app.get("/", (request, response) => {
  response.redirect("/pages/index.html");
});

app.get("/*", (request, response) => {
  // console.log(request);

  // console.log(":::::", request);
  const page = request.params["*"] || "index.html";


 // console.log(page, "----------")
  const file = path.resolve(__dirname, "../view/" + page);
  if (fs.existsSync(file)) {
    const fileData = fs.readFileSync(file);
    
    let content = fileData.toString();
    if (page.endsWith(".html")) { 
      //const html = path.resolve(__dirname, "../view/pages/" + page);
      response.type("text/html")
      const indexs = content.match(/<\/?body.*?>/ig);
      if (indexs) {
        content = content.substring(content.indexOf(indexs[0]) + indexs[0].length, content.indexOf(indexs[1]));
      }
      content = getCommon().replace('{{body}}', content); 
      response.send(content);
    }
    else 
    {
      const starti = page.lastIndexOf(".");
      const endi   = page.length;

      
      let type = starti > -1 ? page.substring(starti+1, endi):"";
      let docType = fileType[type]; 
      response.type(docType);
      response.send(fileData);
    }
     
    
  } else {
    response.type("text/html")
    response.send("file not found: 404")
  }
})

app.register(require('fastify-websocket'), {
  handle,
  options: {
    maxPayload: 1048576,
    path: '/live'
  }
})

function handle(conn) {
  conn.pipe(conn) // creates an echo server
  socket = conn.socket;
}
