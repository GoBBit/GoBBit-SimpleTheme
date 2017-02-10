myApp.controller('topic', function($scope, $http, AppService, $sce, Ajaxify) {
	$scope.postsPerPage = 20;
	
	$scope.init = function(){
		window.addEventListener('topic:load', function(evt){
			$scope.tid = evt.tid;
			$scope.getTopic();
			$scope.getTopicPosts(0);
			$scope.getTopicPoll();

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

	      Ajaxify.updateUrl($scope.topic.title, "/?tid="+ $scope.topic.id);
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

	$scope.getTopicPoll = function(){
		$http.get("/api/poll?tid="+ $scope.tid).then(function(response) {
	      $scope.poll = response.data;
	      $scope.calculatePercentagesTopicPoll();
		}, function(e){
			$scope.poll = {};
			// AppService.showErrorAlert(e.data);
		});
	};

	$scope.deleteTopicPoll = function(){
		var confirmation = confirm(AppService.translation["delete_poll_confirm"]);
		if(!confirmation){
			return;
		}

		$http.delete("/api/poll?tid="+ $scope.tid).then(function(response) {
	      $scope.poll = {};
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.voteTopicPoll = function(option){
		var data = {
			pollid: $scope.poll.id,
			title: option,
			csrf: AppService.csrf
		};

		$http.post("/api/poll/vote", data).then(function(response) {
			$scope.poll = response.data;
			$scope.calculatePercentagesTopicPoll();
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.calculatePercentagesTopicPoll = function(){
		var options = $scope.poll.options;
		var total = 0;
		for(i in options){
			total += options[i].votes.length;
		}

		for(i in options){
			options[i].percent = parseInt((options[i].votes.length / total) * 100);
		}
	};

	$scope.createTopicPoll = function(){
		var options = $scope.pollCreator.options.split("\n");
		var title = $scope.pollCreator.title;

		var data = {
			title: title,
			options: options,
			tid: $scope.topic.id,
			csrf: AppService.csrf
		};
		
		$http.post("/api/poll", data).then(function(response) {
			$scope.poll = response.data;
			$scope.calculatePercentagesTopicPoll();
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.updatePollPreview = function(){
		var options = $scope.pollCreator.options.split("\n");
		var title = $scope.pollCreator.title;
		$scope.poll.title = title;
		$scope.poll.options = [];
		for(var i=0;i<options.length;i++)
		{
			$scope.poll.options.push({ title:options[i], votes:[] });
		}
		$scope.calculatePercentagesTopicPoll();
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
			content: $scope.replyTxt,
			csrf:AppService.csrf
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
		var confirmation = confirm(AppService.translation["delete_post_confirm"]);
		if(!confirmation){
			return;
		}
		
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

	$scope.destroy = function(){
		// "destructor" to free memory deleting properties and HTML nodes
		$scope.tid = "";
		$scope.topic = {};
		$scope.posts = [];
		$scope.page = 0;
		$scope.pages = 0;
		$scope.replyTxt = "";
		$scope.poll = {};
		$scope.pollCreator = {opened:false};
	};

	$scope.closeModal = function(){
		$("#topicModal").hide(200);
		$scope.destroy();
	};

});