myApp.controller('user-edit', function($scope, $http, AppService, Ajaxify) {
	
	$scope.init = function(){
		window.addEventListener('user:edit', function(evt){
			$scope.uslug = evt.uslug || AppService.user.slug;
			$scope.getUserInfo($scope.uslug);
			$scope.getUserIgnore();
			// if is admin modifying another user
			$scope.isAnotherUser = ($scope.uslug != AppService.user.slug);

			// Show modal
			$("#userEditModal").show(200);
		});
	};
	$scope.init();

	$scope.setUid = function(uid){
		$scope.uid = uid;
	};

	$scope.getUserInfo = function(uslug){
		$http.get("/api/user?u="+ uslug).then(function(response) {
			$scope.userprofile = response.data;
			$scope.renderUserInfo();
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.renderUserInfo = function(uslug){
		$scope.picture = $scope.userprofile.picture;
		$scope.email = $scope.userprofile.email;
		$scope.uu.isadmin = $scope.userprofile.isadmin;

		Ajaxify.updateUrl($scope.userprofile.username, "/?u="+ $scope.userprofile.slug);
	};

	$scope.getUserIgnore = function(uslug){
		$http.get("/api/user/ignore").then(function(response) {
			// ignored users
			$scope.userignore = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.updateUser = function(){
		var data = {
			email: $scope.email,
			picture: $scope.picture
		};

		var endpoint = "/api/me";
		if($scope.isAnotherUser){
			endpoint = "/api/user?u="+ $scope.userprofile.slug;
			data.isadmin = $scope.uu.isadmin;
		}

		$http.put(endpoint, data).then(function(response) {
			if(!$scope.isAnotherUser){
				$scope.refreshUser();
			}
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.updateUserPassword = function(){
		if($scope.password != $scope.rpassword)
		{
			AppService.showErrorAlert("password_does_not_match");
			return;
		}

		var data = {
			oldpassword: $scope.oldpassword,
			newpassword: $scope.password
		};

		$http.put("/api/user/changepassword", data).then(function(response) {
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.refreshUser = function(){
		var evt = new Event('user:refresh');
		window.dispatchEvent(evt);
	};

	$scope.destroy = function(){
		// "destructor" to free memory deleting properties and HTML nodes
		$scope.uid = "";
		$scope.userignore = [];
		$scope.userprofile = {};

		$scope.password = "";
		$scope.oldpassword = "";
		$scope.email = "";
		$scope.picture = "";
	};

	$scope.closeModal = function(){
		$("#userEditModal").hide(200);
		$scope.destroy();
	};

});