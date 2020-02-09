const {start} = require('@oneline/core');
const Watchpack = require('watchpack');
const watch = new Watchpack({poll: true});
const path = require('path');
const fs = require('fs');
const builder = require('../../bin/builder')


const appFile = path.resolve(__dirname, '../../lib');
const htmlFile = path.resolve(__dirname, '../pages');
let socket = null;


watch.watch([], [appFile, htmlFile], Date.now());
watch.on('change',(filePath) => {
  // console.log("文件改变", ":", filePath);
  builder('pc', false);
  if(socket) {
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
  <link rel="stylesheet" href="/css/index.css" type="text/css">
`

const app = start(5000, {static: {prefix: "/css", path: path.resolve(__dirname, "../../dist")}}, [], ()=>{
  console.log("启动成功")
})

app.get("/:page", (request, response)=>{
   const page = request.params.page; 
   const file = path.resolve(__dirname, "../pages/" + page);
   if(fs.existsSync(file)) {
    const fileData = fs.readFileSync(file);
     
    response.type("text/html")
    let content = fileData.toString();
    content = content.replace("</head>", cssTemplate + "</head>");
    content = content.replace("</body>", socketTemplate + "</body>");
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

function handle (conn) {
  conn.pipe(conn) // creates an echo server
  socket = conn.socket;
}
