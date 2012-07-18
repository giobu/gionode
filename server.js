var http = require('http'),
    faye = require('faye'),
    jQuery = require('jquery');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello, non-Bayeux request');
  response.end();
});

//
jDev = "Nada"
setInterval(function(){
	jQuery.get("http://tvconf.juicedev.me/tv/todo.json", function(data){
		jDev = data;
	});
}, 120000);
//
function bienvenida(){
	if(typeof jDev == "object"){
		bayeux.getClient().publish('/messages', jDev);
	} else {
		setTimeout(function(){bienvenida(bayeux);}, 1000);
	}
}
c = 0;
bayeux.bind('subscribe', function(clientId) {
  	c++;
  	console.log("Conectados: "+ c);
	bienvenida();
})
bayeux.bind('unsubscribe', function(clientId) {
  	c--;
  	console.log("Conectados: "+ c);
})
bayeux.attach(server);
server.listen(8000);