// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    /*********** AD MOB CODE STARTS  ***************/
    var publisherId = '';
    if(ionic.Platform.isAndroid()) {
         publisherId = "ca-app-pub-2606986526305997~9784915633" 
    } else {
         //publisherId ="ca-app-pub-9293763250492023/8573028797"; 
    }       

    window.plugins.AdMob.setOptions( {
          publisherId: publisherId,
          interstitialAdId: 'ca-app-pub-2606986526305997/1452319417',
          bannerAtBottom: true, // set to true, to put banner at top
          overlap: false, // set to true, to allow banner overlap webview
          offsetTopBar: false, // set to true to avoid ios7 status bar overlap
          isTesting: false, // receiving test ad
          autoShow: true // auto show interstitial ad when loaded
    });
    window.plugins.AdMob.createBannerView();
    /*********** AD MOB CODE ENDS  ***************/
    
    /*  pushNotification = window.plugins.pushNotification;
      successHandler = function(result) {
  	loginLogEntries	('PushNotificationSuccessHandler',result);
  	if (!ionic.Platform.isAndroid()) {
  		// alert("Data: alert check 2"+$http);
  		var device = ionic.Platform.device();
  		
  		//Gettig the device token for IOS
  		window.devicetoken = result;
  		//Getting device 
  		window.device = device.platform.toLowerCase();
  		
  		

  	   }					// alert('result = ' + result);
  		};
  		errorHandler = function(error) {
  			//alert('error = ' + error);
  			loginLogEntries	('PushNotificationErrorHandler',error);	
  		}

  		pushNotification.register(successHandler, errorHandler, {
  			'badge' : 'true',
  			'sound' : 'true',
  			'alert' : 'true',
  			'ecb' : 'onNotification',
  			'senderID' : '381406729456',
  		}); */
  	});
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
     url: '/app',
     abstract: true,
     templateUrl: "app/menu.html"
  }).state('app.map', {
  cache:false,
    url: '/map',
    views: {
        'menuContent' :{
          templateUrl: "app/map.html"
        }
      }
  }).state('app.quick-search', {
  	cache:false,
    url: '/quick-search/:type',
    views: {
        'menuContent' :{
          templateUrl: "app/quick-search.html"
        }
      }
  }).state('app.settings', {
    cache:false,
    url: '/settings',
    views: {
        'menuContent' :{
          templateUrl: "app/settings.html"
        }
      }
  });

  $stateProvider.state('path', {
     url: '/path',
     templateUrl: ""
  }).state('path.direction', {
    cache:false,
    url: '/direction',
    templateUrl: "app/direction-map.html"
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/map');
});

// This will be called when ever app is loaded
window.onNotification = function(e) {
	if (ionic.Platform.isAndroid()) {
		console.log(e.regid);
	}

	if (!ionic.Platform.isAndroid()) {
		e["event"] = "message";
	}
	switch (e.event) {
	case 'registered':
		break;
	case 'message':
            break;
	case 'error':
		alert('error occured');
		break;
	}
};
