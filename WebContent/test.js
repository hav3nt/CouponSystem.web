var myApp = angular.module('myApp', []);

// create the controller and inject Angular's $scope
myApp.controller('myCtrl',['$scope','$http', function($scope,$http) {
	$scope.imageName="";
	
	$scope.check=function (imageName){
		alert(imageName);
		$http.get('http://localhost:8080/CouponSystem.web/rest/upload/coupon/image/check/'+imageName).then(
		function(response){
			alert(JSON.stringify(response))
		},function (response){
			alert(JSON.stringify(response))
		});
	};
	
}]);
