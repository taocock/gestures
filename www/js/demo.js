
app.run(['$rootScope','Modelo','$http','objURL',function($rootScope,Modelo,$http,objURL){
	$rootScope.DB = {};
	$rootScope.promesas =0;	
	Modelo.get("servicio/getItems",function(response){		
		$rootScope.DB.servicios = response.rows;		
		$rootScope.promesas++;	
	});
	Modelo.get("material/getItems",function(response){
		$rootScope.DB.materiales = response.rows;
		$rootScope.promesas++;	
	});
	Modelo.get("usuario/getItems",function(response){
		$rootScope.DB.allUsuarios = response.rows;
		$rootScope.promesas++;	
	});
}]);


app.controller('ctrlPedido', function($rootScope,$scope,Modelo,$http,objURL,Calendario,$filter,$compile) {  
 	$scope.menus.main = 'pedido'	;
 	$scope.dg = angular.copy($rootScope.dgBase);
 	$scope.dg.filterYesNo[0].text = 'Entregado?';
	$scope.dg.predicate="fAlta";  
	$scope.$watch('dg.rows.length',function(newValue,oldValue){
		if (newValue!==oldValue){
			$scope.dg.pag.actual =1 ;
			var nPaginas =  Math.ceil(newValue / $scope.dg.pag.showRows);
			$scope.dg.pag.tPag = nPaginas;
			$scope.dg.pag.first();
		} 
	})

	$scope.nota = '';

	$scope.fecha = {
		anio  :  new Date().getFullYear(),
		mes 	:  new Date().getMonth(),
		fecha :  new Date(),
	};
	$scope.fecha.max = {anio:$scope.fecha.anio, mes:$scope.fecha.mes};
	$scope.fecha.min = {anio:2015, mes:0};

	$scope.modal.pause = true;	
  $scope.$watch('promesas',function(newValue,oldValue){
    if(newValue !== oldValue ){
    	if(newValue === 3){$scope.getItems()}
    }
  })	

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

	$scope.sigMes = function(){		
		if ($scope.fecha.mes==11){
			$scope.fecha.mes=0;
			$scope.fecha.anio++;
		}
		else{$scope.fecha.mes++;}
		$scope.fecha.fecha = new Date($scope.fecha.anio,$scope.fecha.mes,1);
		$scope.getItems();
	}

	$scope.antMes = function(){
		if ($scope.fecha.mes==0){
			$scope.fecha.mes=11;
			$scope.fecha.anio--;
		}
		else{$scope.fecha.mes--;}
		$scope.fecha.fecha = new Date($scope.fecha.anio,$scope.fecha.mes,1);
		$scope.getItems();
	}	
});