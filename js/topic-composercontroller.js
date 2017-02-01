myApp.controller('topic-composer', function($scope, $http, AppService, $sce) {
	
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
			community: $scope.selectedCommunity,
			csrf:AppService.csrf
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

	$scope.updatePreview = function(text){
		if(!text)
		{
			return text;
		}
		
		$scope.contentPreview = $sce.trustAsHtml( AppService.parseText(text) );
	};

	$scope.closeModal = function(){
		$("#topicComposerModal").hide(200);
	};

});