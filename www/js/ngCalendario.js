
app.service('Calendario',[function(){
	return {		
    fecha : new Date(),
    sigMes:function(){
    	var anio = this.fecha.getFullYear();
    	var mes = this.fecha.getMonth();    		
    	if (mes==11)this.fecha = new Date(anio+1,0,1);
    	else this.fecha = new Date(anio,mes+1,1);
    },
    antMes:function(){
    	var anio = this.fecha.getFullYear();
    	var mes  = this.fecha.getMonth();
    	if (mes==0) this.fecha = new Date(anio-1,11,1)
    	else this.fecha = new Date(anio,mes-1,1);
    },
    getFecha : function(){      
    	return this.fecha;
    }, 
    setFecha : function(fecha){
      this.fecha = fecha;
    },
    getDiasMes : function(){
	    var anio = this.fecha.getFullYear();
    	var mes  = this.fecha.getMonth();
    	return this.fecha.diasMes(anio,mes) ;
    },  
    getPrimeroMes : function(){
      var anio = this.fecha.getFullYear();
      var mes  = this.fecha.getMonth();       
      var primero =  new Date(anio,mes,1);
      primero.setHours(0);   
      primero.setMinutes(0);              
      primero.setSeconds(0);
      primero.setMilliseconds(0);
      return primero;
    },
    getPrimeroMesTime : function(){
      var anio = this.fecha.getFullYear();
      var mes  = this.fecha.getMonth();       
      var primero =  new Date(anio,mes,1);
      primero.setHours(0);   
      primero.setMinutes(0);              
      primero.setSeconds(0);
      primero.setMilliseconds(0);
      return primero.getTime();
    }, 
    getAnio : function(){
      return this.fecha.getFullYear();
    }, 
    getMes : function(){
      return this.fecha.getMonth();
    },
    getUltimoMes : function(){
      var ultimo = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.getDiasMes());
      ultimo.setHours(0);   
      ultimo.setMinutes(0);              
      ultimo.setSeconds(0);
      ultimo.setMilliseconds(0);
      return ultimo;      
    },
    getUltimoMesTime : function(){
      var ultimo = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.getDiasMes());
      ultimo.setHours(0);   
      ultimo.setMinutes(0);              
      ultimo.setSeconds(0);
      ultimo.setMilliseconds(0);
      return ultimo.getTime();      
    },  

    getBetween : function(fecha,fInicial,fFinal){return !(fecha<fInicial || fecha>fFinal);},

    getBetweenRango : function(rango,fechas){//var fInicialOK = (fechas.fInicial<rango.fInicial || fechas.fInicial>)
    },

    getDias : function(fInicial,fFinal){ return Math.floor((+fFinal-fInicial)/(1000*60*60*24));},

    addDias : function(fecha,dias){
      fecha = new Date(fecha);
      var anio = fecha.getFullYear();
      var mes  = fecha.getMonth();
      var dia  = +fecha.getDate() + dias; 
      fecha = new Date(anio,mes,dia,0,0,0,0,0);
      return fecha.getTime();
    },

    restaDias : function(fecha,dias){
      fecha = new Date(fecha);
      var anio = fecha.getFullYear();
      var mes  = fecha.getMonth();
      var dia  = +fecha.getDate() - dias; 
      fecha = new Date(anio,mes,dia,0,0,0,0,0);
      return fecha.getTime();      
    },

    getDateToMysql : function(fecha){
      fecha = new Date(fecha)
      var anio = fecha.getFullYear();
      var mes = fecha.getMonth() + 1;
        mes = mes < 10 ? "0"+mes : mes;
      var dia = fecha.getDate();
        dia = dia < 10 ? "0"+dia : dia;
      return "" + anio + "-" + mes + "-" + dia;
    },

    getMysqlToDate : function(fecha){    	
      var arrayFecha = fecha.split("-")
        var anio  = arrayFecha[0];
        var mes   = +arrayFecha[1] - 1;
        var dia   = +arrayFecha[2];
        fecha = new Date(anio,mes,dia,0,0,0,0)
        return fecha.getTime();
    },

    getDateTimeToTime :function(dateTime){
      if (dateTime!==null){
        var fecha = dateTime.split(' ')[0];
        var hora  = dateTime.split(' ')[1];
        fecha  = fecha.split('-');
          var anio  = fecha[0];
          var mes   = fecha[1]-1;
          var dia   = fecha[2];
        hora = hora.split(':');
          var hh    = hora[0];
          var mm    = hora[1];
          var ss    = hora[2];
        fecha  = new Date(anio,mes,dia,hh,mm,ss,0);
        return fecha;
      }
      else{
        return null;
      }
    },

    getDiasFill : function(){
      var celdas = 42;
      var dias = [6,7,1,2,3,4,5];
      var beginDia = this.getPrimeroMes().getDay();
      var diasFill = {
        begin : dias[beginDia],
        end   : celdas - (dias[beginDia] + this.getDiasMes()),
      }
      return diasFill;
    },
    
    getIndexFecha: function(fecha){
      var indexDia = this.getDias(this.getPrimeroMes().getTime(), this.getMysqlToDate(fecha));
      return indexDia + this.getDiasFill().begin;
    },   
  };
}]);

