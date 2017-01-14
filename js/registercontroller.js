myApp.controller('register', function($scope, $http, AppService) {

	$scope.register = function(){

		if($scope.password != $scope.rpassword)
		{
			AppService.showErrorAlert("password_does_not_match");
			return;
		}

		var registerJson = {
			username: $scope.username,
			email: $scope.email,
			password: $scope.password
		};

		$http.post("/register", registerJson).then(function(response) {
			document.location.reload();
		}, function(e){
			// error
			AppService.showErrorAlert(e.data);
		});
	};
});