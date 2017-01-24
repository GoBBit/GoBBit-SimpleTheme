
// To change the URL on the browser
myApp.service('Ajaxify', function(){
	
	this.updateUrl = function (title, url) {
		if(window.history && window.history.pushState) {
			window.history.pushState({
				url: url,
				title: title
			}, title, url);
			document.title = title;
		}
	};

});
