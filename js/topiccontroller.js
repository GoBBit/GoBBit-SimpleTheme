myApp.controller('topic', function($scope, $http, AppService) {
	
	$scope.init = function(){
		window.addEventListener('topic:load', function(evt){
			$scope.tid = evt.tid;
			$scope.getTopic();
			$scope.getTopicPosts(0);
		});
	};
	$scope.init();

	$scope.getTopic = function(){
		$http.get("/api/topic?tid="+ $scope.tid).then(function(response) {
	      $scope.topic = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.getTopicPosts = function(start){
		$http.get("/api/topic/posts?tid="+ $scope.tid +"&start="+ start).then(function(response) {
	      $scope.posts = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

});