myApp.controller('community-editor', function($scope, $http, AppService) {
	
	$scope.init = function(){
		$scope.mods = [];
		$scope.bans = [];

		window.addEventListener('community:edit', function(evt){
			$scope.setCommunity(evt.c);
			$scope.getCommunityMods(evt.c.slug);
			$scope.getCommunityBans(evt.c.slug);

			// Show modal
			$("#communityEditorModal").show(200);
		});
	};
	$scope.init();

	$scope.setCommunity = function(c){
		$scope.selectedCommunity = c;

		$scope.nameTxt = c.name;
		$scope.descriptionTxt = c.description;
		$scope.pictureTxt = c.picture;
	};

	$scope.sendCommunity = function(){
		// update community
		var data = {
			name: $scope.nameTxt,
			description: $scope.descriptionTxt,
			picture: $scope.pictureTxt
		};

		$http.put("/api/community?c="+ $scope.selectedCommunity.slug, data).then(function(response) {
			// refresh communities list
			var evt = new Event('communities:load');
			window.dispatchEvent(evt);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.getCommunityMods = function(c){
		$http.get("/api/community/mods?c="+ c).then(function(response) {
			$scope.mods = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.addModToCommunity = function(c, uslug){
		$http.post("/api/community/mods?c="+ c +"&u="+ uslug, {csrf:AppService.csrf}).then(function(response) {
			$scope.getCommunityMods(c);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.deleteModToCommunity = function(c, uslug){
		$http.delete("/api/community/mods?c="+ c +"&u="+ uslug).then(function(response) {
			$scope.getCommunityMods(c);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	// Bans
	$scope.getCommunityBans = function(c){
		$http.get("/api/community/ban?c="+ c).then(function(response) {
			$scope.bans = response.data;
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.banUserFromCommunity = function(c, uslug){
		$http.post("/api/community/ban?c="+ c +"&u="+ uslug, {csrf:AppService.csrf}).then(function(response) {
			$scope.getCommunityBans(c);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.unbanUserFromCommunity = function(c, uslug){
		$http.delete("/api/community/ban?c="+ c +"&u="+ uslug).then(function(response) {
			$scope.getCommunityBans(c);
		}, function(e){
			AppService.showErrorAlert(e.data);
		});
	};

	$scope.closeModal = function(){
		$("#communityEditorModal").hide(200);
	};

});