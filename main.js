var qs = require('querystring');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '12341234',
	database: 'chat'
	
});
db.connect();


var text = ''; 


function templateHTML(description, creat) {
 return `<!doctype html>
<html>
<head>
  <title>chat - Welcome</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a></a></h1>
  <h2>chat</h2>
  <ul>
  ${description}
  </ul>
  ${creat}
</body>
</html>`
}

var app = http.createServer(function(request, response) {
	 console.log("서버 열림");
  var _url = request.url;
  var queryData = url.parse(_url, true).query;

  var pathname = url.parse(_url, true).pathname
 
 if (pathname === '/'){
 
	 db.query(`SELECT * FROM chat`, function(error, chats){
		 

		 for(var i = 0; i <  chats.length; i++){
			 text = text +`<li>${chats[i].description}</li>`;
			id 

		 }
		 var description = text;
		 
		 var creat = `<form action="/creat_process" method="post">
	
		<p>
		<input type="text" name="description" placeholder="description" autofocus ></input>
		</p>
		<p>
		
		<input type="submit" >
		</p>
		</form>`;
		template = templateHTML(description, creat);
	
		response.writeHead(200);
	    response.end(template);
	 });
	 
}
	else if(pathname === '/ing'){
		 db.query(`SELECT * FROM chat`, function(error, chats){
		 
			 text = text +`<li>${chats[chats.length -1].description}</li>`;
			

		 
		 var description = text;
		 
		 var creat = `<form action="/creat_process" method="post">
	
		<p>
		<input type="text" name="description" placeholder="description" autofocus ></input>
		</p>
		<p>
		
		<input type="submit" >
		</p>
		</form>`;
		template = templateHTML(description, creat);
	
		response.writeHead(200);
	    response.end(template);
	 });
		
	
	}	
 else if(pathname === '/creat_process'){
	 var body = '';
	 request.on('data', function(data) {
	 body = body + data;
	 });
	 request.on('end', function() {	
	  	
	 var post = qs.parse(body);
			 
	db.query(`
		INSERT INTO chat (description, created) VALUES(?, NOW())`,[post.description], function(error, chats){
		if(error){
			
			throw error;
		}
		
		console.log(post.description);
		
	});
		
});
	 response.writeHead(302, {Location: '/ing'});
	 response.end();
	
}
 else{
	 
	 
	response.writeHead(404);
  	response.end("실패");
 }
	
});

app.listen(3000);

//다음 할 내용: 글 생성시 중복되는 것 지우기