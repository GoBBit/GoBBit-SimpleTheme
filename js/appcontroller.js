

myApp.service('AppService', function(){
	// used to access from other controllers
	var lang, translation;
	var csrf = "";
	var user = {};
	var topicList = "recent";

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

		// load home topics or recent topics
		$scope.getHomeTopics(0);
		if(AppService.user.username){
			$scope.getHomeTopics(0);
		}else{
			$scope.getRecentTopics(0);
		}

		$scope.allLoaded = true;
	}, function(e){
		// error
		//AppService.showErrorAlert(e.data);
		// Unauthorized, no user. Load recent topics list
		$scope.getRecentTopics(0);
	});

	$scope.init = function(){
		window.addEventListener('communities:load', function(evt){
			$scope.getCommunities();
		});
		window.addEventListener('user:refresh', function(evt){
			$scope.refreshUser();
		});
	};
	$scope.init();

	$scope.refreshUser = function(){
		// Get user info and save
		$http.get("/api/me").then(function(response) {
			$scope.user = AppService.user = response.data;
			AppService.csrf = response.data.csrf;
		}, function(e){
			// error
			//AppService.showErrorAlert(e.data);
		});
	}

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
			AppService.topicList = "home";
	      	if(start > 0){
				$scope.topics = $scope.topics.concat(response.data);
			}else{
				$scope.topics = response.data;
			}
		}, function(e){
			// error
		});
	};

	$scope.getRecentTopics = function(start){
		$scope.community = null;
		$http.get("/api/topics/recent?start="+start).then(function(response) {
			AppService.topicList = "recent";
			if(start > 0){
				$scope.topics = $scope.topics.concat(response.data);
			}else{
				$scope.topics = response.data;
			}
		}, function(e){
			// error
		});
	};

	$scope.getCommunityTopics = function(c, start){
		$http.get("/api/community/topics?c="+ c +"&start="+ start).then(function(response) {
			AppService.topicList = "community";
			if(start > 0){
				$scope.topics = $scope.topics.concat(response.data);
			}else{
				$scope.topics = response.data;
			}
		}, function(e){
			// error
		});
	};

	$scope.loadMoreTopics = function(){
		var c = $scope.community? $scope.community.slug : null;
		var start = $scope.topics.length;

		if(AppService.topicList == "community"){
			$scope.getCommunityTopics(c, start);
		}else if(AppService.topicList == "home"){
			$scope.getHomeTopics(start);
		}else{
			$scope.getRecentTopics(start);
		}
	};

	$scope.setCommunity = function(idx){
		$scope.community = $scope.communities[idx];
		var c = $scope.community.slug;
		$scope.getCommunity(c, function(r){
			// refresh community info
			$scope.communities[idx] = $scope.community = r.data;
		});
		$scope.getCommunityTopics(c, 0);
	};

	$scope.getCommunity = function(c, cb){
		$http.get("/api/community?c="+ c).then(function(response) {
	      cb(response);
		}, function(e){
			// error
		});
	};

	$scope.setCommunityBySlug = function(c){
		for(i in $scope.communities)
		{
			var com = $scope.communities[i];
			if(com.slug == c)
			{
				$scope.setCommunity(i);
				return;
			}
		}
	};

	$scope.getCommunities = function(){
		$http.get("/api/communities").then(function(response) {
	      $scope.communities = response.data;
		}, function(e){
			// error
		});
	};
	$scope.getCommunities();

	$scope.followCommunity = function(c){
		$http.post("/api/user/follow/community?c="+ c).then(function(response) {
			$scope.user.followed_communities.push(c);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.unfollowCommunity = function(c){
		$http.delete("/api/user/follow/community?c="+ c).then(function(response) {
			var idx = $scope.user.followed_communities.indexOf(c);
			$scope.user.followed_communities.splice(idx, 1);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.loadTopic = function(tid){
		var evt = new Event('topic:load');
		evt.tid = tid;
		window.dispatchEvent(evt);
	};

	$scope.searchTopic = function(tid){
		for(i in $scope.topics){
			var t = $scope.topics[i];
			if(t.id == tid){
				return i;
			}
		}
	};

	$scope.deleteTopic = function(tid){
		$http.delete("/api/topic?tid="+ tid).then(function(response) {
			var idx = $scope.searchTopic(tid);
			$scope.topics.splice(idx, 1);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.isMod = function(c, uid){
		var cc = null;
		for(i in $scope.communities)
		{
			var com = $scope.communities[i];
			if(com.slug == c)
			{
				cc = com;
				break;
			}
		}
		return (cc && (cc.mods.indexOf(uid) >= 0))
	};

	$scope.loadUser = function(uslug){
		var evt = new Event('user:load');
		evt.uslug = uslug;
		window.dispatchEvent(evt);
	};

	$scope.editUser = function(uslug){
		var evt = new Event('user:edit');
		evt.uslug = uslug;
		window.dispatchEvent(evt);
	};

	$scope.openTopicComposer = function(){
		$("#topicComposerModal").show(200);
	};

	$scope.openCommunityCreator = function(){
		$("#communityCreatorModal").show(200);
	};


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

	AppService.parseMention = function(text){
		// parse @username mention
		return text.replace(/\B\@([\w\-]+)/gim, "<a onclick='loadUser(\"$1\")' href='#!'>@$1</a>");
	};

	AppService.parseText = $scope.parseText = function(text){
		text = markdown.toHTML(text);
		text = AppService.parseMention(text);
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

// Used on mentions..
loadUser = function(uslug){
	var evt = new Event('user:load');
	evt.uslug = uslug;
	window.dispatchEvent(evt);
};


