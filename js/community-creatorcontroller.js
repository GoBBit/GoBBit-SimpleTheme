myApp.controller('community-creator', function($scope, $http, AppService) {
	
	$scope.init = function(){
	};
	$scope.init();

	$scope.setCommunity = function(c){
		$scope.selectedCommunity = c;
	};

	$scope.sendCommunity = function(){
		var data = {
			name: $scope.nameTxt,
			description: $scope.descriptionTxt,
			picture: $scope.pictureTxt,
			csrf:AppService.csrf
		};

		$http.post("/api/community", data).then(function(response) {
			// refresh communities list
			var evt = new Event('communities:load');
			window.dispatchEvent(evt);

			$scope.closeModal();

			// Clean all
			$scope.nameTxt = "";
			$scope.descriptionTxt = "";
			$scope.pictureTxt = "";
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.closeModal = function(){
		$("#communityCreatorModal").hide(200);
	};

});