  app.filter('getRowSearch',function(){
    return function(rows,propertySearch,searchValue,propertyReturn,returnNoExiste){
      if(rows === undefined) return '';
      if(searchValue === undefined) return '';
      var row = null;
      for (i=0;i<rows.length;i++){      
        row = rows[i][propertySearch] == searchValue ? rows[i] : null;
        if (row !== null) break;
      }
      var valorNull = returnNoExiste || "No Existe";
      return row === null ? valorNull  : propertyReturn === undefined ? row : row[propertyReturn];        
    }
  });

  app.filter('getRowSearchIndex',function(){
    return function(rows,propertySearch,searchValue){
      var index = -1;
      for (i=0;i<rows.length;i++){
        index = rows[i][propertySearch] == searchValue ? i : -1;
        if (index !== -1) break;
      }
      return index;
    }
  });

  app.filter('paginacion',function(){
    return function(rows,showRows,actual){
      if (rows!==undefined){
        return rows.slice(showRows*(actual-1),showRows*actual);
      }
      else return rows;
    }
  })


app.filter("esNull",function(){
  return function(rows,property,si){
    si = si || true;
    if (rows!==undefined){
      var filtered = [];
      for (var i=0;i<rows.length;i++){
        var row = rows[i];
        if (si){ if (row[property]===null) filter.push(row);}
        else if (row[property]!==null) filter.push(row);
      }
      return filtered;
    }
    else {return rows}
  }
});

// Directivas y filter inputs
  app.filter("isNull",function(){
    return function(rows,property,value){      
      if (rows!==undefined && value!==undefined) { 
        var filtered = [];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row[property]===null===!value) {
            filtered.push(row);
          }
        }
        return filtered;
      }
      else {return rows}
    };
  });

  app.filter("boolean",function(){
    return function(value){
      if (value) return "Si"
      else return "No"
    };
  })

  app.filter("noCero2",function(){
    return function(rows,property,value){      
      if (rows!==undefined && value!==undefined) {         
        value = +value;
        var filtered = [];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (+row[property]!==value) {
            filtered.push(row);
          }
        }
        return filtered;
      }
      else {return rows}
    };    
  })

  app.filter("isCero",function(){
    return function(rows,property,value){      
      if (rows!==undefined && value!==undefined) {         
        var filtered = [];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row[property]===value) {
            filtered.push(row);
          }
        }
        return filtered;
      }
      else {return rows}
    };
  });

  app.filter("ceroLeft",function(){    
    return function(value,ceros){
      value = ''+value;
      var cadena = '0';
      for (var i=0;i<ceros;i++) cadena += '0';
      return (cadena + value).slice(-ceros);
    }
  });

  app.filter("noCero",function(){
    return function(rows,property){
      if (rows!==undefined){
        var filtered = []; var row = null;
        for (var i=0;i<rows.length;i++){
          row = rows[i];
          if (+row[property]!==0) filtered.push(row);
        }
        return filtered;
      }
      else {return rows}
    }
  });

  app.filter('sumaDistinto',function(){
    return function(rows,propertys,total){
      if (angular.isArray(rows)){
        var filtered =[]; var propiedades = []; var row=null;
        if (angular.isArray(propertys)) propiedades = propertys;          
        else propiedades.push(propertys);        
        for (var i=0;i<rows.length;i++){
          row=rows[i];var suma = 0;
          angular.forEach(propiedades,function(item,index){
            suma += +row[item];
          })
          if (suma!==+total) filtered.push(row);          
        }
        return filtered;
      }
      else{ return rows}
    }
  })




  app.filter('range',function(){ // no se usa
    return function(rows,inicio,fin){      
      fin   = parseInt(fin);
      inicio  = parseInt(inicio);
      for (var i=inicio; i<=fin;i++){
        rows.push({
          name  : ""+ i,  
          value : i,
        });
      }
      return rows;
    }
  });

  app.directive("myFirstTab",function($timeout){
    return{
        link: function ( scope, element, attrs ) {
            scope.modal.firstTab = element;
            scope.$watch( attrs.myFirstTab, function ( val ) {
              if ( angular.isDefined( val ) && val ) {
                $timeout( function () {
                  element[0].focus(); 
                  element[0].select();
                });
              }
            }, true);
            element.bind('blur', function () {
                if ( angular.isDefined( attrs.myFocusLost ) ) {
                    scope.$apply( attrs.myFocusLost );
                    
                }
            });
        }
    }
  })

  app.directive("myLastTab",function(){
    return{
      link:function(scope,element,attrs){
        element.bind('blur',function(){
          scope.modal.firstTab[0].focus();
          scope.modal.firstTab[0].select();
        })
      }
    }
  })

  app.filter("entregado",function(){
    return function(rows,entregados){      
      if (rows!==undefined && entregados!==undefined) { 
        var filtered = [];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (entregados){
            if ((+row.tRevisado - +row.tSalida)===0) filtered.push(row);
          }
          else {
            if ((+row.tRevisado - +row.tSalida)!==0) filtered.push(row);
          }         
        }
        return filtered;
      }
      else {return rows}
    };
  });

  app.directive('myTheadFixed',function(){
    return {
      link:function(scope,element,attrs){
        var thTable = $(element);
        var thsFixed = $(element[0].children[0]).find('th');
        var thead = thTable.next().find('thead');
        thead.bind('resize',function(event){
          var ths = event.target.children[0].children;
          var width = 0;
          for (var i=0;i<ths.length;i++){
            wElement = parseInt($(ths[i]).css('width')); 
            width +=  parseInt($(ths[i]).css('width'));
            $(thsFixed[i]).css('width',wElement+'px');        
          }
          thTable.css('width',thead.css('width'));  
          
        })
      }
    }
  });

  app.directive('iePlaceholder',function(){
    return {
      restrict:'A',
      //require :'ngModel',
      link:function(scope,elm,attrs,ctrl){
        //if(!Modernizr.placeholder){ alert("i8")}; no funciona
        var paddingLeft = parseInt($(elm[0]).css('padding-left')),
            paddingTop  = parseInt($(elm[0]).css('padding-top')),
            left = paddingLeft+1 + (elm[0]).offsetLeft ,
            top  = paddingTop+1 + (elm[0]).offsetTop ;
        var span=angular.element(elm.parent()                  
                  .prepend('<span>'+elm.attr('ie-placeholder')+'</span>')
                  .find('span')[0])
                    .css({'color':'#999',
                          'position':'absolute',
                          'display':'display',
                          'top':top+'px',
                          'left':left+'px'
                        })
                  .bind('click',function(){
                    elm[0].focus();
                  });
        elm.bind('keyup keydown',function(){
          if (elm.val()!=='') $(span[0]).css({'display':'none'});
          else $(span[0]).css({'display':'block'});
        });
      }
    }
  })
