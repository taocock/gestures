app.controller('ctrlModal',[
  '$scope',
  '$filter',
  'objURL',
  'Modelo',
  '$rootScope',
  '$compile'  ,
  '$http',
  function($scope,$filter,objURL,Modelo,$rootScope,$compile,$http){
    $scope.showMessage = function(mensaje){
      $scope.modal.html = objURL.vista + 'mensajes/message.html';
      $scope.modal.title = " Información";
      $scope.modal.message = mensaje;
      $scope.modal.show  = true;
    }
    $scope.modal = {};
    $scope.modal.reset = function(){
      $scope.modal.show = false;
      $scope.modal.html = objURL.vista ;
      $scope.modal.title = null;
      $scope.modal.row = {};
      $scope.modal.labelButton = 'Aceptar';
      $scope.modal.labelClose = "Cancelar";
      $scope.modal.accion   = objURL.index + '/';
      $scope.modal.submit = null;
      $scope.modal.showMessage = false;
      $scope.modal.message = '';
      $scope.modal.enDesarrollo = false;
      $scope.modal.pause = false;
      $scope.modal.style = null;
      
      $scope.modal.disabled = false;
      $scope.modal.other = {};     
    };
    $scope.modal.reset();            
    $scope.modal.close = function(){
      $scope.modal.reset()
    };
    $scope.modal.writeMessage = function(error){
      $scope.modal.message = error.number + ": " + error.message;
      $scope.modal.showMessage = true;
    }
    $scope.showJSON = function(json){        
      $scope.modal.title = " Información del objeto";
      $scope.modal.row = json;
      $scope.modal.postHtml({},'desarrollo/showJSON.html',function(response){
      })
    }
    $scope.modal.postHtml = function(data,url,callback){
      url = objURL.vista + url;    
      $http({method:'POST',url:url})
      .success(function(data,status){
        var e = document.getElementById('modal');
        
        angular.element(e).html(data);
        $compile(document.getElementById('modal'))($scope);
        $scope.modal.show = true;    
        callback(data);     
      })
      .error(function(data,status){
        callback({"error":1000,"message":"error de conexión:" +status});
      })

    }


    $scope.menus = {
      main : '',
    }

    $scope.logout = function(){ // 
      var url = ORIGEN + 'base0.php';
      window.location.replace(url);
    }


    $scope.loseFocus = function(){

    }

  }]); 
