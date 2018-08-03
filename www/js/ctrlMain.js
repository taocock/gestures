
alert("inicio carga ctrlMain");

app.run(['$rootScope','Modelo','$http','objURL',function($rootScope,Modelo,$http,objURL){
	$rootScope.DB = {};
	$rootScope.promesas =0;	
	Modelo.get("apk/getServicios",function(response){	
		$rootScope.DB.servicios = response.rows;				
		$rootScope.promesas++;	
	});
	Modelo.get("apk/getMateriales",function(response){
		$rootScope.DB.materiales = response.rows;
		$rootScope.promesas++;			
	});
	Modelo.post({},"apk/postPedidos",function(response){
		$rootScope.DB.pedidos = response.rows;
		$rootScope.promesas++;	
	});
	Modelo.get("apk/getUsuarios",function(response){		
		$rootScope.DB.usuarios = response.rows;
		$rootScope.promesas++;		
	});
}]);


app.controller('ctrlMain', function($rootScope,$scope,Modelo,$http,Calendario) {
	$scope.test = function(){
		Modelo.get('apk/getServicios',function(response){
			console.log($rootScope.DB);
		});
	};

	/* Opciones de Menu */	
	$scope.list = function(){		
		var filter = {'servicio':12,'inicio':1,'count':10};
		Modelo.post(filter,'apk/getPedidos',function(response){
			alert(response.rows);
			angular.forEach(response.rows,function(row,index){
				row.materiales = null;
				row.fAlta = Calendario.getDateTimeToTime(row.fAlta);				
				if (row.fRevisado!==null){
					row.fRevisado = Calendario.getDateTimeToTime(row.fRevisado);
				}					
			});
			$rootScope.DB.pedidos = response.rows;
			alert("lista");
		})
	}

	/* Metodos desde list.html */
	$scope.verMateriales = function(row){
		console.log("VerMateriales");
		console.log(row);
	}
	//$scope.demo = ['./js/prueba.html','list.html'];
/*
	$scope.pages {
		html : ['./js/prueba.html','list.html'],
		actual:0,
	};
	*/
	//$scope.list();

	$scope.getItems = function(){		
		var filter = {'anio':$scope.fecha.anio,'mes':$scope.fecha.mes+1}; 
		Modelo.post(filter,"usuario/getItemsDePedidos",function(response){
			$rootScope.DB.usuarios = response.rows;			
		})
		Modelo.post(filter,"servicio/getItemsDePedidos",function(response){
			$rootScope.DB.servicios = response.rows;			
		})		
		$scope.modal.pause = true;			   		
		Modelo.post({'anio':$scope.fecha.anio,'mes':$scope.fecha.mes+1},"pedido/getItems",function(response){			
			$scope.rows = response.rows;
			angular.forEach($scope.rows,function(row,index){
				row.fAlta = Calendario.getDateTimeToTime(row.fAlta);				
				if (row.fRevisado!==null){
					row.fRevisado = Calendario.getDateTimeToTime(row.fRevisado);
				}				
			});
			$scope.modal.pause = false;
		});
	}

	$scope.clickPedido = function(row){
		$scope.modal.pause = true;
		Modelo.post({'id':row.id},'pedido/getHistoriales',function(response){	
			$scope.pedido = row;
			$scope.pedido.detalles = response.detalles;	
			angular.forEach($scope.pedido.detalles,function(row,index){
				row.newEntrega = 0;			
				row.fEntregado = row.fEntregado ?  Calendario.getDateTimeToTime(row.fEntregado) : null;
			});					
			$scope.modal.pause = false;
		});
	}

	$scope.revisado = function(){
		$scope.modal.pause=true;
		Modelo.post({'id':$scope.pedido.id},'pedido/revisado',function(response){			
			if (response.error.number==0){
				$scope.pedido.revisadopor_id = response.IDusuario;				
				$scope.pedido.fRevisado = Calendario.getDateTimeToTime(response.ahora);
			}
			else{
				$scope.showJSON(response.error.message);		
			}
			$scope.modal.pause = false;
		})
	};

	$scope.formRevisado = function(){
		//console.log("Form Revisado");
	};

	$scope.entregaMaterial = function(row){
		if (+row.newEntrega==0)				
			row.newEntrega = +row.pedido - +row.salida;
		else row.newEntrega = 0;
	}	

	$scope.entregar = function(){
		var entregas = [];
		var valor = 0;
		angular.forEach($scope.pedido.detalles,function(row,index){
			valor = isNaN(row.newEntrega) ? 0 : +row.newEntrega;
			if ((valor == valor.toFixed(0)) && (+valor.toFixed(0) !== 0)){
				entregas.push({
					id : row.id,
					entrega : valor
				});			
			}
		});
		if(entregas.length){
			Modelo.post({'entregas':entregas},'pedido/entregar',function(response){
				if (response.error.number == 0){
					$scope.clickPedido($scope.pedido);
				}
				else {
					$scope.showJSON(response.error.message);	
				}
			})		
		}
		else{
			angular.forEach($scope.pedido.detalles,function(row,index){
				row.newEntrega = 0;
			})
		}
	}


	$scope.editNota = function(){
		$scope.modal.col = "modal-w6";		
		$scope.modal.title = "Notas del pedido.";
		$scope.modal.row = {
			id : $scope.pedido.id,
			nota : $scope.pedido.nota,
		}
		$scope.modal.postHtml({},'pedido/editNota.html',function(response){});
		$scope.modal.submit = function(){
			$scope.modal.pause=true;															
			Modelo.post($scope.modal.row,'pedido/saveNota',function(response){					
				if (response.error.number==0){
					$scope.pedido.nota = $scope.modal.row.nota;
					$scope.modal.reset();
				}
				else{
					$scope.modal.writeMessage(response.error);
				}
				$scope.modal.pause=false;
			});	
		}
	}

	$scope.pedidoWrite = function(row){
		var material = null;
		angular.forEach($rootScope.DB.allMateriales,function(row,index){
			row.cantidad = 0;
			row.pedidos = +row.pedidos;
			row.cantidadAux = 0;
		});	
		Modelo.post({'id':row.id},'pedido/getDetalles',function(response){
			angular.forEach(response.detalles,function(row,index){			
				material = $filter('getRowSearch')($rootScope.DB.allMateriales,'id',row.material_id);
				material.cantidad = +row.pedido;
				material.cantidadAux = +row.pedido;
			});
			$scope.modal.col = "modal-w10";
			$scope.modal.title = "Editar Nº pedido : " + row.id;
			$scope.modal.row = {'nota':row.nota};
			$scope.modal.postHtml({},'pedido/formNew.html',function(response){});
			$scope.modal.submit = function(){
				var materiales = $filter('noCero')($rootScope.DB.allMateriales,'cantidad');
				if (materiales.length){
					Modelo.post({'id':row.id,'nota':$scope.modal.row.nota,'materiales':materiales},'pedido/updateItem',function(response){
						if (response.error.number==0){
							$scope.getItems();
							$scope.modal.reset();
						}
						else{
							$scope.modal.writeMessage(response.error);
						}
					})
				}
				else{
					$scope.modal.writeMessage({'number':0,'message':'Pedido sin material'});
				}				
			}
		});
	}


});

