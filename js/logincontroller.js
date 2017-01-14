myApp.controller('login', function($scope, $http, AppService) {

	$scope.login = function(){
		var loginJson = {
			username: $scope.username,
			password: $scope.password
		};

		$http.post("/login", loginJson).then(function(response) {
			document.location.reload();
		}, function(e){
			// error
			AppService.showErrorAlert(e.data);
		});
	};
});