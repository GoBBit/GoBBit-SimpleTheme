
// Posts parser to embed content such us Youtube, Soundcloud...
myApp.service('EmbedCombo', function(){

	this.embeds = []; // array of supported embeds

	this.init = function(){
		// embeds from https://github.com/exo-do/nodebb-plugin-embed-combo/
		// :)

		this.embeds.push({
			id: 'YouTube',
			code: '<div class="js-lazyYT embedElement" data-youtube-id="$1" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/$1"></iframe></div>',
			regexps: [
				/<a href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)(.+)">.*?<\/a>/g,
				/<a href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/(.+)">.*?<\/a>/g,
				/<a href="(?:https?:\/\/)?(?:www\.)?youtube.com\/embed\/([\w\-_]+)">.*?<\/a>/
			],
			icon: 'fa-youtube-play'
		});

		this.embeds.push({  //ok
			id: 'Twitter',
			code: '<div class="twitter"><blockquote class="twitter-tweet" lang="en"><a href="//twitter.com/$1/status/$2"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></div>',
			regexps: [/<a href="(?:https?:\/\/)?(?:twitter\.com)\/([^\/"\s]*)\/statuse?s?\/([^\/"\s]*)(\/photo\/\d|)".*?>.+?<\/a>/g],
			icon: 'fa-twitter'
		});

		this.embeds.push({  //ok
			id: 'Instagram',
			code: '<div class="embed-container instagram"><iframe src="//instagram.com/p/$1/embed/" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>',
			regexps: [/<a href="(?:https?:)?\/\/(?:www.)?(?:instagram\.com)\/p\/([^\/"]+)\/"[^<]+(?:<\/a>)/g],
			icon: 'fa-instagram'
		});

		this.embeds.push({ //ok
			id: 'Vine',
			/* code: '<iframe class="vine-embed embedElement" src="https://vine.co/v/$1/embed/postcard?related=0" width="480" height="480" frameborder="0"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>',*/
			code: '<div class="embed-container vine"><iframe src="//vine.co/v/$1/embed/simple" frameborder="0" scrolling="no" allowtransparency="true"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script></div>',
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:vine\.co)\/v\/?([^"]+)".*>.*?<\/a>/g],
			icon: 'fa-vine'
		});

		this.embeds.push({  //ok
			id: 'Vimeo',
			code: '<div class="vimeo"><iframe src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)".*>.*?<\/a>/g],
			icon: 'fa-vimeo'
		});

		this.embeds.push({  //ok
			id: 'Dumpert',
			code: '<div class="dumpert"><iframe src="//www.dumpert.nl/embed/$1/$2/" frameborder="0" allowfullscreen></iframe></div>',
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:dumpert\.nl\/mediabase)\/([a-zA-Z0-9_-]{4,11})\/([a-zA-Z0-9_-]{4,11}).*">.*?<\/a>/g],
			icon: 'fa-gg-circle'
		});

		this.embeds.push({  //ok
				id: 'Twitch',
				code: '<div class="twitch"><iframe src="//player.twitch.tv/?channel=$1" frameborder="0" scrolling="no"></iframe><a href="//www.twitch.tv/$1?tt_medium=live_embed&tt_content=text_link" style="padding:2px 0px 4px; display:block; font-weight:normal; font-size:10px;text-decoration:underline;">Twitch Video</a></div>',
				regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv)\/?(.+)".*>.*?<\/a>/g],
				icon: 'fa-twitch'
		});

		this.embeds.push({  //ok
			id: 'Soundcloud Track',
			code: '<iframe class="vimeo-embed" width="100%" height="166" scrolling="no" frameborder="no" src="//w.soundcloud.com/player/?url=//soundcloud.com/$1/$2&amp;show_artwork=true"></iframe>',
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com)\/?([\w\-_]+)\/([\w\-_]+)".*>.*?<\/a>/g],
			icon: 'fa-soundcloud'
		});

		this.embeds.push({  //ok but some console errors
			id: 'Soundcloud Set',
			code: '<iframe class="soundcloud" width="100%" height="410" scrolling="no" frameborder="no" src="http://w.soundcloud.com/player/?url=://soundcloud.com/$1/sets/$2&amp;show_artwork=true"></iframe>',
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com)\/?([\w\-_]+)\/sets\/([\w\-_]+)".*>.*?<\/a>/g],
			icon: 'fa-soundcloud'
		});

		this.embeds.push({ //ok
			id: 'Spotify Track-Album',
			code: '<iframe class="spotify" src="//embed.spotify.com/?uri=spotify:$1:$2" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>',
			regexps: [/spotify:(track|album):([a-zA-Z0-9]+)/g],
			icon: 'fa-spotify'
		});

		this.embeds.push({ //ok
			id: 'Spotify User Playlist',
			code: '<iframe class="spotify" src="//embed.spotify.com/?uri=spotify:user:$1:playlist:$2" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>',
			regexps: [/spotify:user:([a-zA-Z0-9]+):playlist:([a-z-A-Z0-9]+)/g],
			icon: 'fa-spotify'
		});


		this.embeds.push({ //ok
			id: 'Vocaroo',
			//code: '<object class="embedElement" width="148" height="44"><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=$1&autoplay=0"></param><param name="wmode" value="transparent"></param><embed src="http://vocaroo.com/player.swf?playMediaID=$1&autoplay=0" width="148" height="44" wmode="transparent" type="application/x-shockwave-flash"></embed></object>',
			code: '<div class="playerBoxHTML5" id="idPlayerBox"><a href="http://vocaroo.com/i/$1" title="Vocaroo"><img src="http://vocaroo.com/mascot-robot.png" width="50 "height="50"></img></a><audio controls=""><source src="http://vocaroo.com/media_command.php?media=$1&amp;command=download_mp3" type="audio/mpeg"><source src="http://vocaroo.com/media_command.php?media=$1&amp;command=command=download_webm" type="audio/webm"><p>Your browser does not support in page playback. Please <a href="http://vocaroo.com/media_command.php?media=$1&amp;command=download_mp3">download as MP3</a>.</p></audio></div>',
			//regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:vocaroo\.com)\/(?:i\/)(.+)".*>.*?<\/a>/g],
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:vocaroo\.com)\/(?:i\/)([^"]*)".*>.*?<\/a>/g],
			icon: 'fa-volume-off'
		});

		this.embeds.push({ //ok
			id: 'Webm',
			code: '<video class="webm" width="640" height="360" preload="metadata" controls="" src="$1"></video>',
			regexps: [/<a href="(.+?\.webm)".*>.*?<\/a>/g],
			icon: 'fa-video-camera'
		});

		this.embeds.push({ //ok
			id: 'Gfycat',
			code:'<iframe class="gfycat" width="640" height="360" src="https://gfycat.com/ifr/$1" frameborder="0" scrolling="no" style="-webkit-backface-visibility: hidden;-webkit-transform: scale(1);" ></iframe>',
			regexps: [/<a href="(?:https?:\/\/)?(?:www\.)?(?:gfycat\.com)\/?([\w\-_]+?)".*>.*?<\/a>/g],
			icon: 'fa-github-alt'
		});

		// Gifv
		this.embeds.push({ //ok
			id: 'Gifv',
			code: '<video class="gifv" width="640" height="360" autoplay loop muted><source type="video/webm" src="$1.webm"><source type="video/mp4" src="$1.mp4"></video>',
			regexps: [/<a href="(.+?)\.gifv".*>.*?<\/a>/g],
			icon: 'fa-pied-piper-alt'
		});

		//liveleaks
		this.embeds.push({
			id: 'Liveleak',
			code: '<iframe width="640" height="360" src="http://www.liveleak.com/ll_embed?i=$1" frameborder="0" allowfullscreen></iframe>',
			regexps: [/<a href="http?:\/\/www\.liveleak\.com\/view\?.*i\=(\w+)".*>.*<\/a>/g],
			icon: 'fa-exclamation-triangle'
		});

		//pornhub
		this.embeds.push({
			id: 'Pornhub',
		  	code: '<iframe src="//www.pornhub.com/embed/$1" frameborder="0" width="608" height="338" scrolling="no"></iframe>',
		  	regexps: [/<a href="https?:\/\/.*\.pornhub\.com\/view_video\.php\?.*viewkey\=(\w+)".*>.*<\/a>/g],
		  	icon: 'fa-times-circle-o'
		});
	};
	this.init();
	
	this.parse = function (postContent) {
		for(var i in this.embeds)
		{
			var e = this.embeds[i];
			for(var j in e.regexps)
			{
				var regex = e.regexps[j];
				postContent = postContent.replace(regex, e.code);
			}	
		}

		return postContent;
	};

});
