var app = angular.module('app', [
	'mainCtrl',
	'backendService'
]);

app.constant('appConfig', {
	ws: 'https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=408&deploy=1&compid=3803303&h=768e554d1169907e8957'
});