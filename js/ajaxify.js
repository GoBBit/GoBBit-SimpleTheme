
// To change the URL on the browser
myApp.service('Ajaxify', function(){

	this.init = function(){
		var that = this;
		window.addEventListener('communities:loaded', function(evt){
			that.parseUrl();
		});
	};
	this.init();
	
	this.updateUrl = function (title, url) {
		if(window.history && window.history.pushState) {
			window.history.pushState({
				url: url,
				title: title
			}, title, url);
			document.title = title;
		}
	};

	this.getParameterByName = function(name){
		// get parameter actual from URL
		// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
		var url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		
		if (!results) return null;
		if (!results[2]) return '';
		
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	this.parseUrl = function(){
		// Parse URL parameters to load whatever is needed
		var tid = this.getParameterByName("tid");
		var u = this.getParameterByName("u");
		var c = this.getParameterByName("c");

		if(tid){
			var evt = new Event('topic:load');
			evt.tid = tid;
			window.dispatchEvent(evt);
		}
		if(u){
			var evt = new Event('user:load');
			evt.uslug = u;
			window.dispatchEvent(evt);
		}
		if(c){
			var evt = new Event('community:load');
			evt.c = c;
			window.dispatchEvent(evt);
		}
	};
	this.parseUrl();

});
