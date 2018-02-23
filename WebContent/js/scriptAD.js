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
		
	// route companies manage for admin
	.when('/manageCompanies', {
		templateUrl : 'partialHTML/companyList.html',
		controller : 'companyListController'
	})
	
	// route customers manage for admin
	.when('/manageCustomers', {
		templateUrl : 'partialHTML/customerList.html',
		controller : 'customerListController'
	});
});

// create the controller and inject Angular's $scope
couponApp.controller('mainController',['$scope','$http','userDetails','handleMessage','$location', function($scope,$http, userDetails,handleMessage,$location) {
	userDetails.setSupportedUser("ADMIN");
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
				'loginController', ['$scope' , '$http' , 'userDetails','handleMessage','$location' ,
				function($scope, $http, userDetails,handleMessage,$location) {
					
					$scope.message = handleMessage.getClearMessage();
					
					$scope.login = function() {
						$http.post('http://localhost:8080/CouponSystem.web/rest/login',
										{
											"userName" : encodeURIComponent($scope.userName),
											"password" : encodeURIComponent($scope.password),
											"userType" : "ADMIN"
										})
								.then(function(response) {
									$scope.userDetails= userDetails.getCurrentUser();
									$location.path('/');
										},function(response) {
											handleMessage.handleError(response);
								})
					};
					
				}]);


// controller for companies for Admin user
couponApp.controller('companyListController',['$scope','$http','handleMessage', function($scope, $http,handleMessage) {
	
	$scope.message = handleMessage.getClearMessage();
	
	// declaring coupons list object
	$scope.companies={};
	$scope.companiesTemp={};
	
	// method to request all companies from DB
    $scope.showAllCompanies=function (){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/admin/company').then(
    			function(response) {
    				$scope.clearFeilds();
    				$scope.updateCompanyArray(response.data);
    				$scope.updateCompaniesTemp(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
	
	
	// call the function to requests all companies
	$scope.showAllCompanies();
	
	// initiate tempCoupon object which will hold field values of adding/editing coupon form
	$scope.tempCompany={};
	$scope.updateMode=false;  // indicates to the form fields if it's an updating mode
	$scope.showCompanyForm=false;  // indicates if to show the Coupon form or hide
	
	// pushes the new coupon to the array
	$scope.addCompany=function (Company){
		$http.post('http://localhost:8080/CouponSystem.web/rest/admin/company', JSON.stringify(Company)).then(
    			function(response) {
    				handleMessage.setSuccess("success creating new company: "+Company.companyName);
    				$scope.showAllCompanies();
    				$scope.resetCompanyForm();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
	};	
	
	
	// cancels the action of adding/editing coupon
	$scope.resetCompanyForm=function (){
		$scope.showCompanyForm=false;
		$scope.tempCompany={};
		$scope.updateMode=false;
	};
	
	// sets the coupon form to adding mode
	$scope.addMode=function (){
		handleMessage.getClearMessage();
		$scope.tempCompany={};
		$scope.updateMode=false;
		$scope.showCompanyForm=true;
	}
	
	$scope.editCompany=function (company){
		handleMessage.getClearMessage();
		$scope.updateMode=true;
		$scope.tempCompany.id=company.id;
		$scope.tempCompany.companyName=company.companyName;
		$scope.tempCompany.password=company.password;
		$scope.tempCompany.email=company.email;
		$scope.showCompanyForm=true;
	};
	
	// confirmed send update function
	$scope.updateCompany=function (Company){
		$http.put('http://localhost:8080/CouponSystem.web/rest/admin/company', JSON.stringify(Company)).then(
    			function(response) {
    				handleMessage.setSuccess("success updating company: "+Company.companyName);
    				$scope.showAllCompanies();
    				$scope.resetCompanyForm();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
	};
	
	
	//delete company
    $scope.removeCompany = function (id) {
    	$http.delete('http://localhost:8080/CouponSystem.web/rest/admin/company/'+id).then(
    			function(response) {
    				handleMessage.setSuccess("success deleting company: "+response.data.companyName);
    				$scope.showAllCompanies();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    	
    };
    
    
    // show company by id
    $scope.showCompanyByID=function (id){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/admin/company/'+id).then(
    			function(response) {
    				$scope.clearFeilds();
    				handleMessage.setSuccess("showing company with ID: "+id);
    				$scope.updateCompanyArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
    
    // shows all the companies in the list
    $scope.viewAllCompanies=function (){
    	$scope.showAllCompanies();
    	handleMessage.getClearMessage();
    };
    
    // order returned coupon data inside array
    $scope.updateCompanyArray=function (data){
    	if(data==null){
    		$scope.companies={company:[]};
    	}else if (data.company==null){
    		$scope.companies.company=[];
    		$scope.companies.company[0]=data;
    	}else if(!angular.isArray(data.company)){
    		$scope.companies.company=[];
    		$scope.companies.company[0]=data.company;
    	}else{
    		$scope.companies=data;
    	}
    };
    
    // order returned companies data in the CompaniesTemp
    $scope.updateCompaniesTemp=function (data){
    	if(data==null){
    		$scope.companiesTemp=null;
    	}else if (data.company==null){
    		$scope.companiesTemp=null;
    	}else if(!angular.isArray(data.company)){
    		$scope.companiesTemp=[];
    		$scope.companiesTemp[0]=data.company;
    	}else{
    		$scope.companiesTemp=data.company;
    	}
    };
    
    // clearing all the feilds in the search form
    $scope.clearFeilds= function (){
    	$scope.query="";
    	$scope.orderProp=null;
    	$scope.id=null;
    }
    
    
}]);




////////////////////////////////////////controller for customers for Admin user
couponApp.controller('customerListController',['$scope','$http','handleMessage', function($scope, $http,handleMessage) {
	
	$scope.message = handleMessage.getClearMessage();
	
	// declaring customers list object
	$scope.customers={};
	$scope.customersTemp={};
	
	// updates all customers in the list
    $scope.showAllCustomers=function (){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/admin/customer').then(
    			function(response) {
    				$scope.clearFeilds();
    				$scope.updateCustomerArray(response.data);
    				$scope.updateCustomersTemp(response.data);
    			},function(response) {
    				handleMessage.handleError(response);    				
    			});
    };
	
	
	// call the function to requests all companies
	$scope.showAllCustomers();
	
	// initiate tempCustomer object which will hold field values of adding/editing customer form
	$scope.tempCustomer={};
	$scope.updateMode=false;  // indicates to the form fields if it's an updating mode
	$scope.showCustomerForm=false;  // indicates if to show the Customer form or hide
	
	// pushes the new customer to the array
	$scope.addCustomer=function (Customer){
		$http.post('http://localhost:8080/CouponSystem.web/rest/admin/customer', JSON.stringify(Customer)).then(
    			function(response) {
    				handleMessage.setSuccess("success creating new customer: "+Customer.customerName);
    				$scope.resetCustomerForm();
    				$scope.showAllCustomers();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
	};
	
	// cancels the action of adding/editing coupon
	$scope.resetCustomerForm=function (){
		$scope.showCustomerForm=false;
		$scope.tempCustomer={};
		$scope.updateMode=false;
	};
	
	// sets the coupon form to adding mode
	$scope.addMode=function (){
		handleMessage.getClearMessage();
		$scope.tempCustomer={};
		$scope.updateMode=false;
		$scope.showCustomerForm=true;
	}
	
	$scope.editCustomer=function (customer){
		handleMessage.getClearMessage();
		$scope.updateMode=true;
		$scope.tempCustomer.id=customer.id;
		$scope.tempCustomer.customerName=customer.customerName;
		$scope.tempCustomer.password=customer.password;
		$scope.showCustomerForm=true;
	};
	// confirmed send update function
	$scope.updateCustomer=function (customer){
		$http.put('http://localhost:8080/CouponSystem.web/rest/admin/customer', JSON.stringify(customer)).then(
    			function(response) {
    				handleMessage.setSuccess("success updating customer: "+customer.customerName);
    				$scope.resetCustomerForm();
    				$scope.showAllCustomers();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
	};
	
	
	//delete customer
    $scope.removeCustomer = function (id) {
    	$http.delete('http://localhost:8080/CouponSystem.web/rest/admin/customer/'+id).then(
    			function(response) {
    				handleMessage.setSuccess("success deleting customer: "+response.data.customerName);
    				$scope.resetCustomerForm();
    				$scope.showAllCustomers();
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
    
    // show customer by id
    $scope.showCustomerByID=function (id){
    	$http.get('http://localhost:8080/CouponSystem.web/rest/admin/customer/'+id).then(
    			function(response) {
    				$scope.clearFeilds();
    				handleMessage.setSuccess("showing customer with ID: "+id);
    				$scope.updateCustomerArray(response.data);
    			},function(response) {
    				handleMessage.handleError(response);
    			});
    };
    
    
 // order returned coupon data inside array
    $scope.updateCustomerArray=function (data){
    	if(data==null){
    		$scope.customers={customer:[]};
    	}else if (data.customer==null){
    		$scope.customers.customer=[];
    		$scope.customers.customer[0]=data;
    	}else if(!angular.isArray(data.customer)){
    		$scope.customers.customer=[];
    		$scope.customers.customer[0]=data.customer;
    	}else{
    		$scope.customers=data;
    	}
    };
    
 // shows all the customers in the list
    $scope.viewAllCustomers=function (){
    	$scope.showAllCustomers();
    	handleMessage.getClearMessage();
    };
    
 // order returned customers data in the customersTemp
    $scope.updateCustomersTemp=function (data){
    	if(data==null){
    		$scope.customersTemp=null;
    	}else if (data.customer==null){
    		$scope.customersTemp=null;
    	}else if(!angular.isArray(data.customer)){
    		$scope.customersTemp=[];
    		$scope.customersTemp[0]=data.customer;
    	}else{
    		$scope.customersTemp=data.customer;
    	}
    };
    
    
 // clearing all the feilds in the search form
    $scope.clearFeilds= function (){
    	$scope.query="";
    	$scope.orderProp=null;
    	$scope.id=null;
    }
    
    
}]);