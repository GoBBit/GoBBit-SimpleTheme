myApp.controller('topic-composer', function($scope, $http, AppService) {
	
	$scope.init = function(){
	};
	$scope.init();

	$scope.setCommunity = function(c){
		$scope.selectedCommunity = c;
	};

	$scope.sendTopic = function(){
		var data = {
			title: $scope.titleTxt,
			content: $scope.contentTxt,
			community: $scope.selectedCommunity
		};

		$http.post("/api/topic", data).then(function(response) {
			$scope.closeModal();

			// Clean all
			$scope.titleTxt = "";
			$scope.contentTxt = "";
			$scope.selectedCommunity = null;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.closeModal = function(){
		$("#topicComposerModal").hide(200);
	};

});