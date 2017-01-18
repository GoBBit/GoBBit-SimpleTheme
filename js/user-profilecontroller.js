myApp.controller('user-profile', function($scope, $http, AppService) {
	
	$scope.init = function(){
		window.addEventListener('user:load', function(evt){
			$scope.uslug = evt.uslug;
			$scope.getUserInfo($scope.uslug);
			$scope.getUserTopics($scope.uslug, 0);

			// Show modal
			$("#userProfileModal").show(200);
		});
	};
	$scope.init();

	$scope.setUid = function(uid){
		$scope.uid = uid;
	};

	$scope.getUserInfo = function(uslug){
		$http.get("/api/user?u="+ uslug).then(function(response) {
			$scope.userprofile = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.getUserTopics = function(uslug, start){
		$http.get("/api/user/topics?u="+ uslug +"&start="+ start).then(function(response) {
			$scope.usertopics = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.ignoreUser = function(uid){
		$http.post("/api/user/ignore?uid="+ uid).then(function(response) {
			$scope.refreshUser();
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.unIgnoreUser = function(uid){
		$http.delete("/api/user/ignore?uid="+ uid).then(function(response) {
			$scope.refreshUser();
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.banUser = function(uid){
		$http.post("/api/user/ban?uid="+ uid).then(function(response) {
			$scope.userprofile.isbanned = true;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.unBanUser = function(uid){
		$http.delete("/api/user/ban?uid="+ uid).then(function(response) {
			$scope.userprofile.isbanned = false;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.refreshUser = function(){
		var evt = new Event('user:refresh');
		window.dispatchEvent(evt);
	};

	$scope.closeModal = function(){
		$("#userProfileModal").hide(200);
	};

});