var app = {
	inicio : function () {
		this.iniciaBotones();
		this.iniciaFastClick();
		this.iniciaHammer();
	},

	iniciaFastClick: function(){
		FastClick.attach(document.body);		
	},

	iniciaBotones : function(){
		var botonClaro = document.querySelector('#claro');
		var botonOscuro = document.querySelector('#oscuro');

		botonClaro.addEventListener('click',this.ponloClaro,false);
		botonOscuro.addEventListener('click',app.ponloOscuro,false);
	},

	iniciaHammer : function(){
		var zona = document.getElementById('zona-gestos');
		var hammertime = new Hammer(zona);
		hammertime.get('pinch').set({enable:true});
		hammertime.get('rotate').set({enable:true});

		zona.addEventListener('webkitAnimationEnd',function(e){
			zona.className= '';
		});
		hammertime.on('doubletap',function(ev){
			zona.className = 'doubletap';
		});
		hammertime.on('press',function(ev){
			zona.className = 'press';
		});
		
		hammertime.on('swipe',function(ev){
			var clase = '';
			direccion = ev.direction;
			if (direccion==4) clase ='swipe-derecha'; 
			if (direccion==2) clase ='swipe-izquierda';
			//clase = 'rotate';
			document.querySelector('#info').innerHTML = clase;
			zona.className = clase;
		});

		hammertime.on('rotate',function (ev) {
			var umbral = 25 ;
			if (ev.distance > umbral) zona.className = 'rotate';
		});

		//hammertime.on('tap doubletap pan swipe press pinc rotate', function(ev){
		hammertime.on('tap doubletap swipe press pinc rotate', function(ev){
			//document.querySelector('#info').innerHTML = ev.type+'!';
			//document.querySelector('#info').innerHTML = ev.direction;
		});
		
	},

	ponloClaro : function(){
		document.body.className = 'claro';
		var zona = document.getElementById('zona-gestos');
		zona.className = 'swipe-izquierda';
	},

	ponloOscuro : function(){
		document.body.className = 'oscuro';
		var zona = document.getElementById('zona-gestos');
		zona.className = 'rotate';		
		document.querySelector('#info').innerHTML = 'Debe de rotar';

	},
};

if ('addEventListener' in document){
	document.addEventListener('DOMContentLoaded',function(){
		app.inicio();
		alert("ya esta cargado");
	},false);
}

/* version video 1 d
var app = {
	inicio : function () {

		var botonClaro = document.querySelector('#claro');
		var botonOscuro = document.querySelector('#oscuro');

		botonClaro.addEventListener('click',this.ponloClaro,false);
		botonOscuro.addEventListener('click',this.ponloOscuro,false);
	},

	ponloClaro : function(){
		document.body.className = 'claro';		
	},

	ponloOscuro : function(){
		document.body.className = 'oscuro';
	},
};

if ('addEventListener' in document){
	document.addEventListener('DOMContentLoaded',function(){
		FastClick.attach(document.body);
		app.inicio();
	},false);
}
*/