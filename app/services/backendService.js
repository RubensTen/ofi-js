angular.module('backendService', [])
.factory('Backend', ['$http', 'appConfig', '$window', function($http, appConfig, $window){
	
	var backendServiceFactory = {};

		backendServiceFactory.obtenerInfo = obtenerInfo;
		
		backendServiceFactory.mockInfo = mockInfo;		

		backendServiceFactory.getXMLStructure = getXMLStructure;

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
		var hostOrigin = $window.location.origin;
		return $http.get(hostOrigin + '/ofi-js/app/data.json');
	}
}]);