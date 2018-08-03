app.controller('ctrlLista', function($rootScope,$scope,Modelo,$http,Calendario) {
	$scope.verMateriales = function(row){
		if (row.materiales === null){
			Modelo.post(row,"apk/getLinesPedido",function(response){
				row.materiales = response.rows;
			})			
		}
		else{
			console.log('ya estas cargados');
			console.log(row.materiales);
		}
		
		console.log(row);
	}
});