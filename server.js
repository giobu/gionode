var io = require('socket.io').listen(3000), 
request = require('request');
io.set('log level', 2);  
//
jDev = {status: "Nada"};
function getJdev(){
	request('http://tvconf.juicedev.me/tv/todo.json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			jDev.status = JSON.parse(body);
		}
	});
	setTimeout(function(){ getJdev()}, 120000);
}
getJdev()
//

io.sockets.on('connection', function (socket) {
	bienvenida(socket);
	c++;
	conectado();
	socket.on('disconnect', function () {
    	c--;
    	conectado();
  	});
});

function bienvenida(socket){
	if(typeof jDev.status == "object"){
		socket.volatile.emit('status', jDev.status);
	} else {
		setTimeout(function(){bienvenida(socket);}, 1000);
	}
}
c = 0;
function conectado(a){
	console.log("Conectados: "+ c);
	io.sockets.volatile.emit('stats', {conectados: c});
}
