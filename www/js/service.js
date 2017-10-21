angular.module('starter').factory('MapService', ['$http', '$q','$rootScope', function($http, $q, $rootScope){
	return {
		nearByPlaces : function(searchObj) {
			return $http.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+searchObj.lat+","+searchObj.long+"&radius="+searchObj.radius+"&type="+searchObj.type+"&keyword="+searchObj.keyword+"&key=AIzaSyAabtKOp3LeaiQ-9Qe7b06RepuMLszWjNg");
              	}
              }
}]);
