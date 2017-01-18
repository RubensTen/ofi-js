angular.module('backendService', [])
.factory('Backend', ['$http', 'appConfig', function($http, appConfig){
	
	var backendServiceFactory = {};

		backendServiceFactory.obtenerInfo = obtenerInfo;
		
		backendServiceFactory.mockInfo = mockInfo;		

		return backendServiceFactory;

	/**
	 * Funcion que obtiene cierto numero de ciudades con mas ventas en el año
	 * @param  {Integer} numeroCiudades a obtener
	 * @return {http promise} promesa http con el resultado del ws            
	 */
	function obtenerInfo(){		
		return $http.get(appConfig.ws);
	}

	function mockInfo(){
		return $http.get('http://localhost:81/ofi-js/app/data.json');
	}
}]);