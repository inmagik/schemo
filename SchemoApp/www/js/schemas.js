(function(){

"use strict";

angular.module('schemas', [])

.factory('schemaRegistry', [function () {
    var svc = {};
    svc.schemas = {};
    svc.registerSchema = function(schemaDef){
        svc.schemas[schemaDef.name] = schemaDef;
    }
    svc.getSchemas = function(n){
        if(!svc.schemas[n]){
            console.error("wwww! no schema reg", n)
            return;       
        }
        return svc.schemas[n];
    }
    return svc;
}])

.controller('entityFormCtrl', ['$scope', '$attrs', '$timeout', function ($scope, $attrs, $timeout) {
    console.log(10, $scope.entitySchema);

    this.setValue = function(k,v){
        var t =this;
        $timeout(function(){
            $scope.entityModel[k] = v;
            t.updateVisible()
        })
    }

    this.updateVisible = function(){
        var visible = [];
        angular.forEach($scope.entitySchema.properties, function(prop){
            if(!prop.when && prop.name && prop.type){
                visible.push(prop);
            } else {
                angular.forEach(prop.when, function(value, key){
                    if(prop.name && prop.type){
                        if(key == 'equals'){
                            var ok = angular.equals($scope.entityModel[value[0]], value[1])
                            if(ok){
                                visible.push(prop);
                            }
                        }
                    }
                });
            }

        });
        $scope.visibleProperties = visible;
    }
    
    $scope.$watch('entitySchema', this.updateVisible, true)
    

}])


.directive('entityForm', [function () {
    return {
        restrict: 'E',
        controller : 'entityFormCtrl',
        scope : { entitySchema : "=", entityModel:"="},
        templateUrl : "templates/entity-schema.html",
        link: function (scope, iElement, iAttrs) {
            console.log("e form", scope.entityModel)
        }
    };
}])

.controller('entityFieldCtrl', ['$scope', '$attrs', '$timeout', function ($scope, $attrs, $timeout) {
    console.log(100, $scope.fieldSchema, $scope.fieldModel);
    

}])

.directive('entityField', ['$timeout', 'schemaRegistry' ,function ($timeout,schemaRegistry) {
    return {
        restrict: 'E',
        scope : { fieldSchema : "=", fieldModel : "="},
        require : '^entityForm',
        templateUrl : "templates/entity-field.html",
        link: function (scope, iElement, iAttrs, entityForm) {

            
            if(scope.fieldModel === undefined){
                scope.fieldModel = (scope.fieldSchema.type == "object" ||  scope.fieldSchema.type.indexOf("schema:") == 0) ? {} : scope.fieldSchema.type == "array" ? [] : '';
            }
            scope.data = { fieldModel: scope.fieldModel};

            if(scope.fieldSchema.arrayType){
                console.error("s")
                scope.schemaArray = scope.fieldSchema.arrayType.indexOf("schema:") == 0;
            }
            
            
            scope.$watch('fieldSchema', function(){
            if(!scope.fieldSchema.enum){
                scope.includeUrl = "templates/entity-field-"+scope.fieldSchema.type+".html";
            } else {
                scope.includeUrl = "templates/entity-field-select.html";
            }

            console.log(1,scope.includeUrl)
            }, true )
            

            scope.addArrayItem = function(){
                var t = scope.fieldSchema.arrayType;
                var x = (t == "object" ||  t.indexOf("schema:") == 0) ? {} : t == "array" ? [] : '';
                $timeout(function(){
                    scope.data.fieldModel.push(x);
                    entityForm.setValue(scope.fieldSchema.name,scope.data.fieldModel);
                })
            };

            scope.getArraySchema = function(){
                var t = scope.fieldSchema.arrayType;
                t = t || 'string';
                if(t.indexOf("schema:") == 0){
                    var sname = t.split(":")[1];
                    return schemaRegistry.getSchemas(sname)
                } else {
                    return {
                        name : 'item',
                        type : t
                    }
                }
            }

            scope.$watch('data.fieldModel', 
                function(nv, ov){
                    console.error(nv);
                    entityForm.setValue(scope.fieldSchema.name,nv);

                }, 
                true);

            
            
        }
    };
}])





})();