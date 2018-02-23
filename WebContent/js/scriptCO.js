var couponApp = angular.module('couponApp', ['ngRoute','ngFileUpload','couponAppServices']);

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
	
	// route current company info page
	.when('/myCompany', {
		templateUrl : 'partialHTML/myCompany.html',
		controller : 'myCompanyController'
	})
	
	// route coupons manage list for current company
	.when('/manageCoupons', {
		templateUrl : 'partialHTML/couponList.html',
		controller : 'couponListController'
	});
});

// create the controller and inject Angular's $scope
couponApp.controller('mainController',['$scope','$http','userDetails','handleMessage','$location', function($scope,$http, userDetails,handleMessage,$location) {
	userDetails.setSupportedUser("COMPANY");
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
				'loginController', ['$scope' , '$http' , 'userDetails' ,'handleMessage','$location',
				function($scope, $http, userDetails,handleMessage,$location) {
					
					$scope.message = handleMessage.getClearMessage();
					
					$scope.login = function() {$http.post('http://localhost:8080/CouponSystem.web/rest/login',
										{
											"userName" : encodeURIComponent($scope.userName),
											"password" : encodeURIComponent($scope.password),
											"userType" : "COMPANY"
										})
								.then(function() {
									$scope.userDetails= userDetails.getCurrentUser();
									$location.path('/');
										},function(response) {
											handleMessage.handleError(response);
								})
					};					
					
					}]);


couponApp.controller('myCompanyController',['$scope','$http','handleMessage', function($scope,$http,handleMessage) {
	$scope.message = handleMessage.getClearMessage();
	
    $http.get('http://localhost:8080/CouponSystem.web/rest/company').then(
			function(response) {
				$scope.company=response.data;
			},function(response) {
				handleMessage.handleError(response);
		});

}]);


//controller for managing coupons for company user
couponApp.controller('couponListController',['$scope','$http', 'Upload', '$timeout','handleMessage','handleImage', function($scope, $http, Upload, $timeout,handleMessage,handleImage) {
	$scope.message = handleMessage.getClearMessage();
	
	// declaring coupons list object
	$scope.coupons={};
	$scope.couponsTemp={};
	
	// updates all coupons in the list
    $scope.showAllCoupons=function (){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/company/coupon').then(
    			function(response) {
    				$scope.updateCouponArray(response.data);
    				$scope.updateCouponsTemp(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
	
	
	// call the function to requests all coupons
	$scope.showAllCoupons();
	
	// initiate tempCoupon object which will hold field values of adding/editing coupon form
	$scope.tempCoupon={};
	$scope.updateMode=false;  // indicates to the form fields if it's an update mode
	$scope.addMode=false      // indicates to the form fields if it's an add mode
	$scope.showCouponForm=false;  // indicates if to show the Coupon form or hide
	
	/// checking and loading an image of the coupon
	$scope.checkLoad=function (imageName){
		if(imageName != null && imageName!=""){
			return handleImage.isLoaded(imageName);
		}
		return "False";
	};
	
	
	/////////////////////////////// creates new coupon with an image
	$scope.addCoupon = function(file) {
		
		////////////////  ONLY POSTING WITHOUT IMAGE
//		$http.post('http://localhost:8080/CouponSystem.web/rest/company/coupon', JSON.stringify($scope.tempCoupon)).then(
//    			function(response) {
//    				handleMessage.setSuccess("success creating new coupon");
//    				$scope.showAllCoupons();
//    				$scope.resetCouponForm();
//    			},function(response) {
//    				handleMessage.handleError(response);
//    			});
		
		
		///////////// N E E D    F I X I N G    I M A G E      U P L O A D
	    file.upload = Upload.upload({
	      url: 'http://localhost:8080/CouponSystem.web/rest/upload/coupon/image',
	      data: {file: file, username: $scope.username},
	    });

	    file.upload.then(function (response) {
	      $timeout(function () {
	        file.result = response.data;
	        $scope.tempCoupon.image=response.data;
	        $http.post('http://localhost:8080/CouponSystem.web/rest/company/coupon', JSON.stringify($scope.tempCoupon)).then(
	    			function(response) {
	    				handleMessage.setSuccess("success creating new coupon");
	    				$scope.showAllCoupons();
	    				$scope.resetCouponForm();
	    			},function(response) {
	    				handleMessage.handleError(response);
	    			});
	        
	      });
	    }, function (response) {
	    	handleMessage.handleError(response);
	    }, function (evt) {
	      // Math.min is to fix IE which reports 200% sometimes
	      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	    });
		
	    };
	
	
	// cancels the action of adding/editing coupon
	$scope.resetCouponForm=function (){
		$scope.showCouponForm=false;
		$scope.tempCoupon={};
		$scope.updateMode=false;
		$scope.addMode=false;
		$scope.picFile=null;
	};
	
	// sets the coupon form to adding mode
	$scope.setAddMode=function (){
		handleMessage.getClearMessage();
		$scope.tempCoupon={};
		$scope.updateMode=false;
		$scope.addMode=true;
		$scope.showCouponForm=true;
	};
	
	$scope.editCoupon=function (coupon){
		handleMessage.getClearMessage();
		$scope.updateMode=true;
		$scope.tempCoupon.id=coupon.id;
		$scope.tempCoupon.title=coupon.title;
		$scope.tempCoupon.startDate=coupon.startDate;
		$scope.tempCoupon.endDate=coupon.endDate;
		$scope.tempCoupon.amount=coupon.amount;
		$scope.tempCoupon.type=coupon.type;
		$scope.tempCoupon.message=coupon.message;
		$scope.tempCoupon.price=coupon.price;
		$scope.tempCoupon.image=coupon.image;
		$scope.picFile={};
		$scope.showCouponForm=true;
	};
	// confirmed send update function
	$scope.updateCoupon=function (Coupon){
		$http.put('http://localhost:8080/CouponSystem.web/rest/company/coupon', JSON.stringify(Coupon)).then(
    			function(response) {
    				handleMessage.setSuccess("success updating coupon");
    				$scope.showAllCoupons();
    				$scope.resetCouponForm();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
	};
	
	
	//delete coupon
    $scope.removeCoupon = function (id) {
    	$http.delete('http://localhost:8080/CouponSystem.web/rest/company/coupon/'+id).then(
    			function(response) {
    				handleMessage.setSuccess("success deleting coupon");
    				$scope.showAllCoupons();
    				$scope.resetCouponForm();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    	
    };
    
    
    
    // show coupons of type
    $scope.showCouponsOfType= function (couponType){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/company/coupon/type/'+couponType).then(
    			function(response) {
    				$scope.updateCouponArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
    
    
    // show coupons equals or under the price
    $scope.showCouponsByTopPrice= function (price){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/company/coupon/price/'+price).then(
    			function(response) {
    				$scope.updateCouponArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
    
    // show coupon by id
    $scope.showCouponByID=function (id){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/company/coupon/'+id).then(
    			function(response) {
    				$scope.updateCouponArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
    
    // show coupons with expiration date sooner than parameter
    $scope.showCouponsByEndDate=function (endDate){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/company/coupon/date/'+endDate).then(
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
    
    // updating couponsTemp object which will be used for info about all coupons
    $scope.updateCouponsTemp=function(data){
    	if(data==null){
    		$scope.couponsTemp=null;
    	}else if (data.coupon==null){
    		$scope.couponsTemp=null;
    	}else if(!angular.isArray(data.coupon)){
    		$scope.couponsTemp=[];
    		$scope.couponsTemp[0]=data.coupon;
    	}else{
    		$scope.couponsTemp=data.coupon;
    	}
    };

    
}]);

