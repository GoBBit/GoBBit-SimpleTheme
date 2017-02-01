
myApp.service('Translator', function(AppService){
	
	this.translate = function(translation, args){
		var result = AppService.translation[translation];
		for(var i in args){
			result = result.replace("%"+i, args[i]);
		}
		return result;
	};

});

