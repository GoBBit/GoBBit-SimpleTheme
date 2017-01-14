

myApp.service('AppService', function(){
	// used to access from other controllers
	var lang, translation;
	var csrf = "";
	var user = {};

});


myApp.controller('App', function($scope, $http, AppService) {
	$scope.allLoaded = false;
	// Load & setup language based on user browser lang
	AppService.lang = $scope.lang = localStorage.getItem("lang") || navigator.language.toLowerCase().substr(0, 2) || "en";
	moment.locale($scope.lang);
	$http.get("/languages/" + $scope.lang + ".json").then(function(response) {
		// save translations on app service to access from other controllers
		AppService.translation = $scope.translation = response.data;
	}, function(e){
		// error, English by default
		AppService.lang = $scope.lang = "en";
		$scope.changeLanguage();
	});

	// Get user info and save
	$http.get("/api/me").then(function(response) {
		$scope.user = AppService.user = response.data;
		AppService.csrf = response.data.csrf;

		// load home topics
		$scope.getHomeTopics(0);

		$scope.allLoaded = true;
	}, function(e){
		// error
		//AppService.showErrorAlert(e.data);
	});


	$scope.changeLanguage = function(){

		localStorage.setItem("lang", $scope.lang);

		$http.get("/languages/" + $scope.lang + ".json").then(function(response) {
	      $scope.translation = response.data;
		}, function(e){
			// error
		});
	};

	$scope.getHomeTopics = function(start){
		$scope.community = null;
		$http.get("/api/user/home?start="+start).then(function(response) {
	      $scope.topics = response.data;
		}, function(e){
			// error
		});
	};

	$scope.getCommunityTopics = function(c, start){
		$scope.community = c;
		$http.get("/api/community/topics?c="+c+"&start="+start).then(function(response) {
	      $scope.topics = response.data;
		}, function(e){
			// error
		});
	};

	$scope.getCommunities = function(){
		$http.get("/api/communities").then(function(response) {
	      $scope.communities = response.data;
		}, function(e){
			// error
		});
	};
	$scope.getCommunities();


	$scope.formatDate = function(t){
		return moment(t).fromNow();
	};

	$scope.formatDateComplete = function(t){
		return moment(t).format("LLLL");
	};

	$scope.range = function(min, max, step) {
		// generate range for menus
		// ex: hour menu: 00, 01, 02... 13, 14...
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) {
	    	var text = i;
	    	if(i < 10)
	    	{
	    		text = "0" + i;
	    	}

	        input.push(text);
	    }
	    return input;
	};

	$scope.rangeSimple = function(min, max, step) {
		// generate range for menus
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) {
	        input.push(i);
	    }
	    return input;
	};

	AppService.parseText = $scope.parseText = function(text){
		// Simple parser for Markdown
		// parse links
		text = text.replace(/(https?:\/\/[^ ]+)/gi, '<a href="$1" target="_blank">$1</a>');
		// parse newlines
		text = text.replace(/\n+/gi, '<br>');
		// parse markdown bold
		text = text.replace(/(\*\*|__)(.*?)\1/gi, '<b>$2</b>');
		// parse markdown italic
		text = text.replace(/(\*|_)(.*?)\1/gi, '<em>$2</em>');
		// parse markdown code
		text = text.replace(/`(.*?)`/gi, '<code>$1</code>');

		return text;
	};

	AppService.showErrorAlert = $scope.showErrorAlert = function(key){
		var message = AppService.translation[key];
		if(!message){
			message = key;
		}
		alert(message);
	};

	$scope.isAllLoaded = function(){
		return $scope.allLoaded;
	}
});







