var couponApp = angular.module('couponApp', [ 'ngRoute','couponAppServices']);

// configure our routes
couponApp.config(function($routeProvider) {
	$routeProvider

	// route for the home page
	.when('/', {
		templateUrl : 'partialHTML/home.html',
		controller : 'mainController'
	})

	// route for the about page
	.when('/about', {
		templateUrl : 'partialHTML/about.html',
		controller : 'aboutController'
	})

	// route for the contact page
	.when('/contact', {
		templateUrl : 'partialHTML/contact.html',
		controller : 'contactController'
	})

	// route for login page
	.when('/login', {
		templateUrl : 'partialHTML/login.html',
		controller : 'loginController'
	})
	
	// route for current customer info page
	.when('/myCustomer', {
		templateUrl : 'partialHTML/myCustomer.html',
		controller : 'myCustomerController'
	})
	
	// route to purchase coupons page for customer
	.when('/buyCoupons', {
		templateUrl : 'partialHTML/coupons.html',
		controller : 'buyCouponsController'
	})
	
	// route to past purchased coupons page for customer
	.when('/myCoupons', {
		templateUrl : 'partialHTML/myCoupons.html',
		controller : 'myCouponsController'
	});
});

// create the controller and inject Angular's $scope
couponApp.controller('mainController',['$scope','$http','userDetails','handleMessage','$location', function($scope,$http, userDetails,handleMessage,$location) {
	userDetails.setSupportedUser("CUSTOMER");
	$scope.userDetails=userDetails.getCurrentUser();
	$scope.message = handleMessage.getClearMessage();
	
	$scope.logOut=function(){
		$http.delete('http://localhost:8080/CouponSystem.web/rest/login')    
		.then(function (response) {
			userDetails.setGuest();
			$location.path('/');
		},function(response) {
			handleMessage.handleError(response);
		})
	};

}]);

couponApp.controller('aboutController',['$scope', function($scope) {
	$scope.message = 'Look! I am an about page.';
}]);

couponApp.controller('contactController',['$scope', function($scope) {
	$scope.message = 'Contact us! JK. This is just a demo.';
}]);

couponApp
		.controller(
				'loginController', ['$scope' , '$http' , 'userDetails','handleMessage' ,'$location',
				function($scope, $http, userDetails,handleMessage,$location) {
					
					$scope.message = handleMessage.getClearMessage();
					
					$scope.login = function() {
						$http.post('http://localhost:8080/CouponSystem.web/rest/login',
										{
											"userName" : encodeURIComponent($scope.userName),
											"password" : encodeURIComponent($scope.password),
											"userType" : "CUSTOMER"
										})
								.then(function(response) {
									$scope.userDetails= userDetails.getCurrentUser();
									$location.path('/');
										},function(response) {
											handleMessage.handleError(response);
								})
					};
					
				}]);

couponApp.controller('myCustomerController',['$scope','$http','handleMessage', function($scope,$http,handleMessage) {
	$scope.message = handleMessage.getClearMessage();
	
	$http.get('http://localhost:8080/CouponSystem.web/rest/customer').then(
			function(response) {
				$scope.customer=response.data;
			},function(response) {
				handleMessage.handleError(response);
		});
    
}]);


//controller for buying coupons for customer user
couponApp.controller('buyCouponsController',['$scope','$http','handleMessage', function($scope, $http,handleMessage) {
	$scope.message = handleMessage.getClearMessage();
	
	// declaring coupons list object
	$scope.coupons={};
	
	// requests all coupons
	$scope.showSystemCoupons=function (){
	$http.get('http://localhost:8080/CouponSystem.web/rest/customer/systemCoupons').then(
			function(response) {
				$scope.updateCouponArray(response.data);
			},function(response) {
				handleMessage.handleError(response);
    			});
	};
	
	$scope.showSystemCoupons();
	
	// buy Coupon function
	$scope.buyCoupon=function (Coupon){
		$http.put('http://localhost:8080/CouponSystem.web/rest/customer/coupon', JSON.stringify(Coupon)).then(
    			function(response) {
    				handleMessage.setSuccess("thank you for purchasing the coupon");
    				$scope.showSystemCoupons();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
	};
	
	// order returned coupon data inside array
    $scope.updateCouponArray=function (data){
    	if(data==null){
    		$scope.coupons={coupon:[]};
    	}else if (data.coupon==null){
    		$scope.coupons.coupon=[];
    		$scope.coupons.coupon[0]=data;
    	}else if(!angular.isArray(data.coupon)){
    		$scope.coupons.coupon=[];
    		$scope.coupons.coupon[0]=data.coupon;
    	}else{
    		$scope.coupons=data;
    	}
    };
    
       	
}]);


couponApp.controller('myCouponsController',['$scope','$http','handleMessage', function($scope,$http,handleMessage) {
	$scope.message = handleMessage.getClearMessage();
	
	// declaring coupons list object
	$scope.coupons={};
	
	// requests all coupons function
	$scope.showCustomerCoupons=function (){
	$http.get('http://localhost:8080/CouponSystem.web/rest/customer/coupon').then(
			function(response) {
				$scope.updateCouponArray(response.data);
			},function(response) {
				handleMessage.handleError(response);
	    	});
	};
	
	$scope.showCustomerCoupons();
	
	// show coupons of type
    $scope.showCouponsOfType= function (couponType){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/customer/coupon/type/'+couponType).then(
    			function(response) {
    				$scope.updateCouponArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
	
 // show coupons equals or under the price
    $scope.showCouponsByTopPrice= function (price){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/customer/coupon/price/'+price).then(
    			function(response) {
    				$scope.updateCouponArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
	
	// order returned coupon data inside array
    $scope.updateCouponArray=function (data){
    	if(data==null){
    		$scope.coupons={coupon:[]};
    	}else if (data.coupon==null){
    		$scope.coupons.coupon=[];
    		$scope.coupons.coupon[0]=data;
    	}else if(!angular.isArray(data.coupon)){
    		$scope.coupons.coupon=[];
    		$scope.coupons.coupon[0]=data.coupon;
    	}else{
    		$scope.coupons=data;
    	}
    };
        
}]);