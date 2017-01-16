myApp.controller('topic', function($scope, $http, AppService, $sce) {
	$scope.postsPerPage = 20;
	
	$scope.init = function(){
		window.addEventListener('topic:load', function(evt){
			$scope.tid = evt.tid;
			$scope.getTopic();
			$scope.getTopicPosts(0);

			// Show modal
			$("#topicModal").show(200);
		});
	};
	$scope.init();

	$scope.getTopic = function(){
		$http.get("/api/topic?tid="+ $scope.tid).then(function(response) {
	      $scope.topic = response.data;
	      $scope.page = 0;
	      $scope.pages = Math.floor($scope.topic.posts_number / $scope.postsPerPage) + 1;
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
	$scope.getTopicPostsByPage = function(p){
		$scope.page = p;
		var start = $scope.postsPerPage * p;
		$scope.getTopicPosts(start);
	};

	$scope.nextPage = function(){
		if($scope.page+1 < $scope.pages){
			$scope.page++;
			$scope.getTopicPostsByPage($scope.page);
		}
	};
	$scope.prevPage = function(){
		if($scope.page > 0){
			$scope.page--;
			$scope.getTopicPostsByPage($scope.page);
		}
	};


	$scope.sendReply = function(){
		var data = {
			tid: $scope.topic.id,
			content: $scope.replyTxt
		};

		$http.post("/api/post", data).then(function(response) {
			var post = response.data;
			post.user = AppService.user;
			$scope.posts.push(post);

			$scope.replyTxt = "";
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.searchPost = function(pid){
		for(i in $scope.posts){
			var p = $scope.posts[i];
			if(p.id == pid){
				return i;
			}
		}
	};

	$scope.deletePost = function(pid){
		$http.delete("/api/post?pid="+ pid).then(function(response) {
			var p = $scope.searchPost(pid);
			$scope.posts.splice(p, 1);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};


	$scope.parsePost = function(text){
		if(!text)
		{
			return text;
		}
		
		text = $sce.trustAsHtml( AppService.parseText(text) );
		return text;
	};

	$scope.updatePreview = function(text){
		if(!text)
		{
			return text;
		}
		
		$scope.contentPreview = $sce.trustAsHtml( AppService.parseText(text) );
	};

	$scope.closeModal = function(){
		$("#topicModal").hide(200);
	};

});