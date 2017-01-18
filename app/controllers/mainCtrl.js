angular.module('mainCtrl', [])
.controller('mainController', ['$scope', 'Backend', '$filter', function($scope, Backend, $filter){

	//Definicion de variables
	var infoWS = [];
	$scope.finalVentas= [];
	$scope.total = 0;

	//Meses
	$scope.months = [
		{
			mes: "1",
			nombre: 'Enero',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "2",
			nombre: 'Febrero',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "3",
			nombre: 'Marzo',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "4",
			nombre: 'Abril',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "5",
			nombre: 'Mayo',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "6",
			nombre: 'Junio',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "7",
			nombre: 'Julio',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "8",
			nombre: 'Agosto',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "9",
			nombre: 'Septiembre',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "10",
			nombre: 'Octubre',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "11",
			nombre: 'Noviembre',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		},
		{
			mes: "12",
			nombre: 'Diciembre',			
			promedio: {
				totalVentas: 0,
				numeroVentas: 0
			}
		}		
	];

	//Clientes
	$scope.clientes = [];

	var init = init;
	var obtenerInfo = obtenerInfo;
	var obtenerCiudadesConMasVentasPorAnio = obtenerCiudadesConMasVentasPorAnio;
	var obtenerTotalVentasSinCiudad = obtenerTotalVentasSinCiudad;
	var obtenerPromedioVentaPorMes = obtenerPromedioVentaPorMes;
	var obtenerClientesConMenoresVentas = obtenerClientesConMenoresVentas;
	var obtenerInfoCiudad = obtenerInfoCiudad;
	var obtenerInfoPorAnio = obtenerInfoPorAnio;


	//Metodos de arranque inicial
	init();

	//Metodo inicial
	function init (){		
		//Se obtiene la informacion del ws
		obtenerInfo();
	}

	/**
	 * funcion que obtiene la informacion del ws	 
	 */
	function obtenerInfo(){		
		Backend.mockInfo().then(function (data){			
			if (data && data.data) {
				infoWS = data.data;
				obtenerCiudadesConMasVentasPorAnio(2016);
				obtenerTotalVentasSinCiudad();
				obtenerPromedioVentaPorMes();
				obtenerClientesConMenoresVentas();
			}
		}, function (err){
			console.error('err ws: ', err);
			alert('Error al consumir ws');
		});
	}


	/**
	 * Funcion que obtiene ciudades con mas ventas al año	 
	 */
	function obtenerCiudadesConMasVentasPorAnio(anio){
		//Filtro de la informacion que solo contiene ciudades
		var arrayVentas = obtenerInfoCiudad(infoWS, true);

		//Filtro con la informacion que coincida con el año especificado
		arrayVentas = obtenerInfoPorAnio(arrayVentas, anio);

		$scope.finalVentas = [];
		for(i in arrayVentas){
			var match = false;
			for (j in $scope.finalVentas) {
				if (arrayVentas[i].city === $scope.finalVentas[j].city) {
					$scope.finalVentas[j].count++;
					match=true;
					break;
				}
			}

			if (!match) {
				var aux = {
					city: arrayVentas[i].city,
					count: 1
				};				
				$scope.finalVentas.push(aux);
			}
		}		

		//Ordenamiento de forma desendente
		$scope.finalVentas.sort(function (a, b){
			return b.count - a.count;
		});

		console.log('finalVentas:', $scope.finalVentas);
	}

	function obtenerTotalVentasSinCiudad(){
		//Filtro para obtener ventas sin ciudad
		var arrayVentas = obtenerInfoCiudad(infoWS, false);
		$scope.total = 0;
		for(i in arrayVentas){
			$scope.total+= parseFloat(arrayVentas[i].rate || 0);
		}

		console.log('Total de ventas sin ciudades: ', $scope.total);
	}
	
	function obtenerPromedioVentaPorMes(){
		for(i in infoWS){			
			//El string de fechas es convertido a array
			var arrayDate = infoWS[i].date.split('/');			

			//Se compara el mes y se suma la venta y un contador
			for(j in $scope.months){
				if ($scope.months[j].mes === arrayDate[1]) {
					$scope.months[j].promedio.totalVentas += parseFloat(infoWS[i].rate || 0);
					$scope.months[j].promedio.numeroVentas ++;
					break;
				}	
			}
		}//fin for				
	}


	function obtenerClientesConMenoresVentas(){		
		$scope.clientes=[];
		for(i in infoWS){
			var match = false;
			
			for(j in $scope.clientes){				
				if (infoWS[i].customer === $scope.clientes[j].customer) {
					$scope.clientes[j].count++;
					match = true;
					break;
				}
			}	

			if (!match) {
				var aux = {
					customer: infoWS[i].customer,
					count: 1
				};
				$scope.clientes.push(aux);
			}
		}

		//Ordenamiento de forma ascendente
		$scope.clientes.sort(function (a, b){
			return a.count - b.count;
		});
	}

	function obtenerInfoCiudad(arrayParam, flag){
		var finalInfo = $filter('filter')(arrayParam, function(info, index, array){
			//Si true
			if (flag) {
				//Obtener ventas con ciudades
				if(info.city && info.city.length > 0){
					info.city = info.city.toUpperCase();
					return info;
				}
			}else{
				//Si false
				
				//Obtener ventas sin ciudades
				if (!info.city || info.city.length == 0 || info.city === "") {					
					return info;	
				}
			}

			//En caso contrario 
			return null;
		});
		return finalInfo;
	}

	function obtenerInfoPorAnio(arrayParam, anio){
		var finalInfo = $filter('filter')(arrayParam, function(info, index, array){
			//Si el item tiene una fecha con al menos 8 caracteres
			if(info.date && (info.date.length >= 8)){
				//Si el año se encuentra en la fecha
				var index = info.date.search(anio);
				if (index && index > 0) {
					return info;
				}
			}			
			return null;
		});
		return finalInfo;
	}
}]);