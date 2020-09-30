var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var upload = require('express-fileupload');
const { request } = require("https");

app.use(express.static(__dirname + '/public'));
app.use(upload());


app.get('/', function (req, res) {
   res.sendfile('index.html');
});
var internetAvailable = require("internet-available");

internetAvailable().then(function () {
   console.log("Internet available");
}).catch(function () {
   console.log("No internet");
}); 




var users = [];
var left = [];

io.on('connection', (socket) => {

   console.log('user connected' + ':' + socket.id);





   socket.on('new-user-join', name => {

      socket.emit('message', 'welcome' + ':' + name);
      socket.emit('heading', 'welcome' + ':' + name);
      io.emit('auser', name);
      

      console.log(name + ':' + 'connected');


      users[name] = socket.id;
      left[socket.id] = name;

      io.emit('user-join', name);

   });

   socket.on('chatm', data => {
      var socketid = users[data.receiver];

      io.to(socketid).emit('pmsg', data);



   });
   socket.on('chatp', data => {
      socket.broadcast.emit('pumsg', data);

   });

   socket.on('disconnect', message => {
      socket.broadcast.emit('left', left[socket.id]);
      socket.broadcast.emit('leftli', left[socket.id]);



      console.log(left[socket.id] + ':' + 'disconnected');
      delete left[socket.id];
   });




   socket.on('upload', msg => {

      console.log(msg);
      
      
      app.post('/' , (req ,res) => {
         
         if (req.files){
            console.log(req.files);
            var file=req.files.file;
            console.log(file);
            var filename=file.name;
            console.log(filename);
            
            file.mv('./public/img/' + filename , function (err){
               if(err){
                  res.send(err);
               }
               else{
                 
                 
                   socket.broadcast.emit('ufname', filename);
               }
            });
         }
         
         
         
         });
         
      
      
      
      
      
      
      
         } );
           
      
         });
           












var port = process.env.PORT || 3000

http.listen(port, () => {
   console.log('listening on :' + port);
});
