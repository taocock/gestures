
var app = angular.module("app",[]);
//var ORIGEN = 'http://10.138.50.47/esterilizacion/'; 
var ORIGEN = 'http://10.138.50.215/hospital/esterilizacion/' ;



app.constant("objURL",{
  base : ORIGEN + 'indexapk.php/', 
  vista: ORIGEN + 'vista/',
  ctrl: ORIGEN + 'controllers/'
});


app.service('Modelo',['$http','$rootScope','objURL',function($http,$rootScope,objURL){
	return {
    get : function(url,callback){
      url = objURL.base + url;
      $http({method: 'GET', url: url}
        ).success(function(data, status, headers, config) {
          callback(data);        
        }).
        error(function(data, status, headers, config) {
          alert("error");    

        });     
    },
    post : function(row,url,callback){
      $http({
        method : 'POST',
        url : objURL.base + url,
        data : row,   
      }).success(function(data,status){
        callback(data);
      }).error(function(data,status){
        callback({"error":1000,"message":"error de conexión:" +status});
      })
    },

    openForm : function(verb, url, data, target) {
      url = objURL.base + url;
      var form = document.createElement("form");
      form.action = url;
      form.method = verb;
      form.target = target || "_self";
      if (data) {
        var input = document.createElement("textarea");
        input.name = 'row';        
        input.value = data;
        form.appendChild(input);
      }
      form.style.display = 'none';
      document.body.appendChild(form);
      form.submit();
    },     
  };
}]);


app.run(['$rootScope',function($rootScope){
  $rootScope.dgBase = {
    filterYesNo : [// OJO esto debejeria se de manera general
      {'id':undefined,'text':'De baja?'},
      {'id':0,'text':'No'},
      {'id':1,'text':'Si'}
    ],
    activo:undefined,     
    search :{},
    filter:{},
    reload :function(selectPropety){
      if (this.filter[selectPropety] === null)
        delete this.filter[selectPropety]
    },    
    predicate : 'nombre',
    reverse : false,
    order : function(predicate){
      this.reverse = (this.predicate === predicate) ? !this.reverse : false;
      this.predicate = predicate;
      this.pag.first();
    },    
    pag : {
      textCSS : {'width':'82px'},
      textRegistros : 'Reg.',
      textPaginas   : 'Pág.' ,
      showRows : 40, // registros a mostrar por pagina
      actual : 1, // pagina actual
      tPag : 0, // numero de paginas
      fPgG : 1, // Primera pagina del grupo
      pagsG : [], // Numero de pagina por grupo
      sig : function(){
        var newPg = this.actual + 1;
        if (newPg<=this.tPag){
          this.actual=newPg;
          this.fPgG = newPg==this.pagsG.length+this.fPgG ? this.pagsG.length + this.fPgG : this.fPgG;
        }
      },
      ant : function(){
        var newPg = this.actual-1;
        if (newPg>0){         
          this.actual = newPg;
          this.fPgG = newPg % this.pagsG.length == 0 ? this.fPgG - this.pagsG.length   : this.fPgG;
        }
      },
      first : function(){this.actual = 1 ; this.fPgG=1;},
      last : function(){
        this.actual = this.tPag;
        var entero = Math.floor(this.actual/this.pagsG.length);
        var resto  = this.actual % this.pagsG.length;       
        this.fPgG = this.pagsG.length * entero + (resto==0 ? 0:1);
      },
      showPag: function(pagina){this.actual=this.fPgG + pagina},
      load : function(dg){ // por ver 
        dg.pag.actual =1 ;
        var nPaginas =  Math.ceil(newValue / dg.pag.showRows);
        dg.pag.tPag = nPaginas;
        dg.pag.first(); 
        return dg.pag;       
      }
    },
  }   
}]);


