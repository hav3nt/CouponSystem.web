'use strict';

var couponAppServices = angular.module('couponAppServices',[]);

//creating service handle current user details
couponAppServices.service('userDetails',['$http' , function($http) {
	var currentUser = {links : [],
    userType :'GUEST',
    userName :'guest'};
	var supportedUser="GUEST";

	return {
		getCurrentUser : function(){
			$http.get('http://localhost:8080/CouponSystem.web/rest/login/userDetails')    
			.then(function (response) {
				var data=response.data;
				if(data.userType!= "GUEST" && data.userType !=supportedUser){
					alert("only 1 user can be logged in, please log out first with the current user");
					currentUser.userType=data.userType;
					currentUser.links = [];
				}else if(data.userType== 'CUSTOMER'){
					currentUser.userType=data.userType;
					currentUser.links = [ {
						"href" : "#myCustomer",
						"name" : "My Customer"
					}, {
						"href" : "#buyCoupons",
						"name" : "Buy Coupons"
					},{
						"href" : "#myCoupons",
						"name" : "My Coupons"
					} ];
					currentUser.userName=data.userName;
					}else if(data.userType== 'COMPANY'){
				currentUser.userType=data.userType;
				currentUser.links = [ {
					"href" : "#myCompany",
					"name" : "My Company"
				}, {
					"href" : "#manageCoupons",
					"name" : "Manage Coupons"
				} ];
				currentUser.userName=data.userName;
				}else if(data.userType== 'ADMIN'){
					currentUser.userType=data.userType;
					currentUser.links = [ {
						"href" : "#manageCompanies",
						"name" : "Manage Companies"
					}, {
						"href" : "#manageCustomers",
						"name" : "Manage Customers"
					} ];
					currentUser.userName=data.userName;
					}
			},function(response) {
	    	alert(JSON.stringify(response.data));
		    });
			return currentUser;
		},
		setGuest : function (){
			currentUser.links = [];
			currentUser.userType ='GUEST';
			currentUser.userName='guest';
		},
		setSupportedUser : function (userType){
			supportedUser=userType;
		}
	}
}]);

//creating service to handle messages
couponAppServices.service('handleMessage',['$http','$location','userDetails' , function($http,$location,userDetails) {
	var message= {"success":"", "errorDetails":""};

	return {
		handleError : function(response){
			message.success = "";
			if(response.status==401){
				alert("please log in to the system");
				userDetails.setGuest();
				$location.path('/login');
			}
			if (response.data.error != null){
				message.errorDetails = "Error: " + response.data.error;
			}else{
				message.errorDetails = "Error: please try again";
			}
			return message.errorDetails;
		},
		setSuccess : function (msg){
			message.errorDetails="";
			message.success=msg;
			return message.success;
		},
		getClearMessage : function (){
			message.errorDetails="";
			message.success="";
			return message;
		}
	}
}]);

// service to handle images files
couponAppServices.service('handleImage',['$http' , function($http) {
	var answer="False";
	
	return {
		isLoaded : function (imageName){
			$http.get('http://localhost:8080/CouponSystem.web/rest/upload/coupon/image/check/'+imageName).then(
					function(response){
						answer=response.data;
					},function (response){
						answer="False";
					});
			return answer;
		},
		loadImage : function (imageName){
			$http.get('http://localhost:8080/CouponSystem.web/rest/upload/coupon/image/load/'+imageName).then(
					function(response){
						answer=response.data;
					},function (response){
						answer="False";
					});
			return answer;
		}
	}
	
	
}]);

