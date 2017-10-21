function getDirections(latitude,longitude) {
    window.location.href = "#/path/direction?latitude="+latitude+"&longitude="+longitude;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay,endPosition) {

		var start = userCurrentPosition;
		var end = endPosition;
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}

var currentMap = null;

app.controller('DirectionController', function($scope,$rootScope,$location,$ionicHistory, $cordovaGeolocation,$ionicLoading, $http,$stateParams,MapService) {

  $scope.goBack = function() {
      $ionicHistory.goBack();
  }

 $ionicPlatform.onHardwareBackButton(function() {
     event.preventDefault();
     event.stopPropagation();
     $ionicHistory.goBack();
  });

	$scope.plotPathToDestination = function() {
		var latitude = $location.search().latitude;
		var longitude = $location.search().longitude;

		    var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var start = userCurrentPosition;
        var map = new google.maps.Map(document.getElementById('direction-map'), {
          zoom: 16,
          center: start
        });
        currentMap = map;
        directionsDisplay.setMap(map);
        var endPositionLocation = new google.maps.LatLng(latitude, longitude);
        //var onChangeHandler = function() {
	    calculateAndDisplayRoute(directionsService, directionsDisplay,endPositionLocation);
	}


  $scope.isUserMoving = false;
  var movingMarker = null;
  var updateUserLocation = null;
	$scope.updateLocationOnMoving = function() {

    window.plugins.toast.showWithOptions({
        message: "Marker will start moving as you move",
        duration: "short", // 2000 ms
        position: "bottom"
    });


    $scope.isUserMoving = true;
    movingMarker = new google.maps.Marker({
      position: userCurrentPosition,
      animation: google.maps.Animation.DROP,
      optimized: false,
      icon: 'img/user.gif',
      map: currentMap
    });
		updateUserLocation = setInterval(function() {
		   	
        var posOptions = {
            enableHighAccuracy: true,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, long);
            movingMarker.setPosition(myLatlng);
           

          }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });

		}, 2000);
	}

  $scope.stopUpdateLocationOnMoving = function() {
      clearInterval(updateUserLocation);
      $scope.isUserMoving = false;
  }

});