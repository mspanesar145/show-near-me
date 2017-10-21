var radiusIterationMap = {
	1000 : [1000],
	5000 : [1000,5000],
	10000 : [1000,5000,10000],
	20000 : [1000,5000,10000,20000]
};

var userCurrentPosition = {};

	
var app = angular.module('starter.controllers', []);
app.controller('MapController', function($scope,$rootScope,$location, $cordovaGeolocation,$ionicLoading,$ionicPlatform, $http,$stateParams,MapService) {
	
	$ionicPlatform.onHardwareBackButton(function() {
	     event.preventDefault();
	     event.stopPropagation();
	     $ionicHistory.goBack();
  	});

	$scope.showCurrentPosition = function() {
		if (window.localStorage.getItem("searchWithIn")) {
			$rootScope.searchWithIn = window.localStorage.getItem("searchWithIn");
		} else {
			$rootScope.searchWithIn = 1000;
		}
		plotCurrentLocationMap();
	}
	
	var changeInterval = null;
	$scope.showCustomSearchData = function(searchKeyword) {
		    clearInterval(changeInterval);
		    changeInterval = setInterval(function() {
		    	if (searchKeyword == '') {
				return;
			}
			$scope.showLoading();
			var type = $stateParams.type;
			var posOptions = {
			    enableHighAccuracy: true,
			    timeout: 20000,
			    maximumAge: 0
			};
			plotGraph(posOptions,'',searchKeyword);	
			clearInterval(changeInterval)
		    }, 2000);
	}

 	$scope.showQuickSearch = function() {
		  $ionicLoading.show({
	    		template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
		  });
         
         	var type = $stateParams.type;
		var posOptions = {
		    enableHighAccuracy: true,
		    timeout: 20000,
		    maximumAge: 0
		};
	 
		plotGraph(posOptions,type,'');
	 }
	 
	 $scope.updateNearByDistanceSelection = function(nearByDistanceValue) {
	 	window.localStorage.setItem("searchWithIn",nearByDistanceValue);
	 	$rootScope.searchWithIn = nearByDistanceValue;
	 }
	 
	 function plotGraph(posOptions,type,keyword) {
	 
	 	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
		    var lat  = position.coords.latitude;
		    var long = position.coords.longitude;

		    var myLatlng = new google.maps.LatLng(lat, long);
		    userCurrentPosition = myLatlng;
		    console.log(JSON.stringify(myLatlng)); 
		    var mapOptions = {
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		    };          

		   var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
		     
		   $scope.map = map;   
		   var currentPosMarker = new google.maps.Marker({
			    position: myLatlng,
			    animation: google.maps.Animation.DROP,
			    optimized: false,
			    icon: 'img/user.gif',
			    map: map
			  });
		
		var radiusToIterate = radiusIterationMap[$rootScope.searchWithIn];
			 
		var keepTrackOfUniqueRecords = [];
		var uniqueResults = [];
		var count = 0; //This is used to add the 
		for (var key in radiusToIterate) {
			var searchObj = {
				lat:lat,
				long:long,
				type:type,
				keyword : keyword,
				radius : radiusToIterate[key]
			};
			

			//This will fetch the information from nearby places google API
			MapService.nearByPlaces(searchObj).then(function(response) {


				for (var resKey in response.data.results) {
					if (keepTrackOfUniqueRecords.indexOf(response.data.results[resKey].id) == -1) {
						keepTrackOfUniqueRecords.push([response.data.results[resKey].id]);
						uniqueResults.push(response.data.results[resKey]);
					}
				}
				if (count == radiusToIterate.length - 1) {
					plotGraphByForPlacesInRadius(map,uniqueResults);
					 $ionicLoading.hide();   
				}
				count++;
			});
		}	  
		
		           
		     
		}, function(err) {
		    $ionicLoading.hide();
		    console.log(err);
		});
	 }
	 
	 function plotGraphByForPlacesInRadius(map,searchResults) {
	 	var markers = [];
			var infowindows = [];
			var contents = [];
			for (var i=0; i < searchResults.length; i++) {
				var location = searchResults[i].geometry.location;
				//addMarkers(response.data.results[i],map,'restaurant.gif');
				console.log("Locations : "+JSON.stringify(location));
				markers[i] = new google.maps.Marker({
				    position: location,
				    animation: google.maps.Animation.DROP,
				    optimized: false,
				    icon: 'img/loc.png',
				    map: map
				});
				markers[i].index = i;
				  
				var contentStr = '<b>'+searchResults[i].name+'</b><br/>'+searchResults[i].vicinity;
				if (searchResults[i].rating) {
					var val = parseFloat(searchResults[i].rating);
					// Make sure that the value is in 0 - 5 range, multiply to get width
					size = Math.max(0, (Math.min(5, val))) * 16;
					contentStr += '<br/> <span class=\"stars\" style=\"width:'+size+'px\"><span></span></span>'
				}
				
				  contentStr += '<button onclick="getDirections('+location.lat+','+location.lng+')">Get There</button>';
				  contents[i] = contentStr;
				  infowindows[i] = new google.maps.InfoWindow({
				    content: contents[i],
				    maxWidth: 300
				   });
				   console.log(contents[i] );
				google.maps.event.addListener(markers[i], 'click', function() {
				    	//console.log(this.index); // this will give correct index
				    	//console.log(i); //this will always give 10 for you
				    	//infowindows[this.index].open(map,markers[this.index]);
				    	//map.panTo(markers[this.index].getPosition());

						if(!markers[this.index].open){//This will check if the marker clicked is opened
													  //If not opened then, then it will open the current clicked marker,
													  //And will close the rest of markers.	
			                infowindows[this.index].open(map,markers[this.index]);
			                markers[this.index].open = true;
			                for (var i = 0; i < infowindows.length; i++) {
			                	if (this.index == i) {
			                		continue;
			                	}
			            		var infoWindow = infowindows[i];
			            		infoWindow.close();	
			            	}
			            } else {
			                infowindows[this.index].close();
			                markers[this.index].open = false;
			            }

			            //This will close all the infoWindows on map click
			            google.maps.event.addListener(map, 'click', function() {
			            	for (var i = 0; i < infowindows.length; i++) {
			            		var infoWindow = infowindows[i];
			            		infoWindow.close();	
			            	}
			                markers[this.index].open = false;
			            });

			    	});

		    	}	
	 }
	 
	function plotCurrentLocationMap () {
		var posOptions = {
			    enableHighAccuracy: true,
			    timeout: 20000,
			    maximumAge: 0
			};
		$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
		    var lat  = position.coords.latitude;
		    var long = position.coords.longitude;
		    console.log("My latitude : "+lat+" , longitude : "+long);
		    var myLatlng = new google.maps.LatLng(lat, long);
		    var mapOptions = {
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		    };          

		   var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
		     
		   $scope.map = map;   
		   var currentPosMarker = new google.maps.Marker({
			    position: myLatlng,
			    animation: google.maps.Animation.DROP,
			    optimized: false,
			    icon: 'img/user.gif',
			    map: map
		   });
		});
	}	

	$scope.showLoading = function() {
		$ionicLoading.show({
            		template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        	  });
	}
	
	$scope.hideLoading = function() {
		$ionicLoading.hide()
	}

});
