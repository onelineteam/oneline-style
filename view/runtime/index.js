const { start } = require('@oneline/core');
const Watchpack = require('watchpack');
const watch = new Watchpack({ poll: true });
const path = require('path');
const fs = require('fs');
const copy = require('copyfiles');

//复制静态文件
copy([path.resolve(__dirname, '../icon') + '/*', 
path.resolve(__dirname, '../js') + '/*', 
path.resolve(__dirname, "../../dist")], {all: true, flat: false, up:2}, ()=>{})


const builder = require('../../bin/builder')
const appFile = path.resolve(__dirname, '../../lib');
const htmlFile = path.resolve(__dirname, '../pages');

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
    path: path.resolve(__dirname, "../../dist") 
  },
  cros: {
    origin: '*',
    allowedHeaders:  ["Verify", "Origin", "Access-Control-Allow-Origin", "Access-Control-Request-Headers", "X-Requested-With", "Content-Type", "Accept", "Referer", "User-Agent"]
  }
 }, [], () => {
  console.log("启动成功")
})

function getCommon() {

  let index = fs.readFileSync(path.resolve(__dirname, "../pages/index.html")).toString("utf-8");
  index = index.replace("</head>", cssTemplate + "</head>");
  index = index.replace("</body>", socketTemplate + "</body>");
  return index;
}


app.get("/view/*", (request, response) => {
  // console.log(request);

  // console.log(":::::", request);


  const page = request.params["*"] || "index.html";
  console.log(page, "----------")
  const file = path.resolve(__dirname, "../pages/" + page);
  if (fs.existsSync(file)) {
    response.type("text/html")
    let content = "";
    //if (page === 'index.html') {
    //  content = "index";
   // } else {
      const fileData = fs.readFileSync(file);
      content = fileData.toString();

      const indexs = content.match(/<\/?body.*?>/ig);
      // console.log(indexs)
      if(indexs) {
        content = content.substring(content.indexOf(indexs[0]) + indexs[0].length, content.indexOf(indexs[1]));
      }
      

      content = getCommon().replace('{{body}}', content);
    //}

    

    response.send(content);
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
