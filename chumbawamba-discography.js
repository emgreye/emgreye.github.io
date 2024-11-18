(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"chumbawamba_discography_atlas_1", frames: [[0,0,1292,876],[0,878,1000,965],[1002,878,894,894]]},
		{name:"chumbawamba_discography_atlas_2", frames: [[0,891,643,888],[1290,0,643,880],[1290,882,643,880],[0,0,643,889],[645,890,643,880],[645,0,643,888]]},
		{name:"chumbawamba_discography_atlas_3", frames: [[0,0,643,880],[645,0,643,877],[1290,0,643,877],[645,879,643,877],[1290,879,643,875],[0,882,643,880]]},
		{name:"chumbawamba_discography_atlas_4", frames: [[645,865,643,858],[0,0,643,872],[1290,0,643,860],[1290,862,643,860],[0,874,643,872],[645,0,643,863]]},
		{name:"chumbawamba_discography_atlas_5", frames: [[1367,0,643,795],[645,722,643,777],[1290,797,643,769],[0,0,643,858],[0,860,643,858],[645,0,720,720]]},
		{name:"chumbawamba_discography_atlas_6", frames: [[0,759,643,740],[645,0,643,740],[645,742,643,698],[1290,742,643,698],[1290,0,643,740],[0,0,643,757]]},
		{name:"chumbawamba_discography_atlas_7", frames: [[0,0,643,656],[1287,0,643,570],[0,658,640,640],[0,1300,640,640],[642,658,640,640],[1287,572,597,600],[1284,1174,600,595],[645,0,640,640],[642,1300,640,640]]},
		{name:"chumbawamba_discography_atlas_8", frames: [[1176,1382,231,57],[1728,1356,236,57],[1500,1238,356,57],[636,1267,327,57],[1911,0,98,57],[965,1267,327,57],[1911,59,98,57],[1911,118,98,57],[1911,177,98,57],[0,1330,258,57],[1911,236,98,57],[1409,1382,228,57],[1728,1297,287,57],[636,1326,268,57],[260,1330,253,57],[906,1326,268,57],[636,1012,862,83],[1081,444,961,142],[636,1097,862,83],[0,868,961,142],[636,1182,862,83],[963,868,961,142],[1726,1109,215,83],[1294,1297,215,83],[595,482,277,95],[1511,1297,215,83],[1726,1012,277,95],[0,747,1690,119],[1692,588,225,225],[1081,0,413,442],[1496,0,413,442],[0,595,1605,150],[1500,1012,224,224],[0,0,593,593],[0,1012,316,316],[595,0,484,480],[318,1012,316,316]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_93 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_92 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_91 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_89 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_88 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_87 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_6"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_6"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_84 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_6"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_83 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_81 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_80 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_79 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_6"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_75 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_74 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_72 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_5"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(img.CachedBmp_61);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,389);


(lib.CachedBmp_60 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(img.CachedBmp_59);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_58 = function() {
	this.initialize(img.CachedBmp_58);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,398);


(lib.CachedBmp_57 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(img.CachedBmp_56);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_55 = function() {
	this.initialize(img.CachedBmp_55);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,403);


(lib.CachedBmp_54 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(img.CachedBmp_53);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_52 = function() {
	this.initialize(img.CachedBmp_52);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,413);


(lib.CachedBmp_51 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(img.CachedBmp_50);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_49 = function() {
	this.initialize(img.CachedBmp_49);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,414);


(lib.CachedBmp_48 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(img.CachedBmp_47);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_46 = function() {
	this.initialize(img.CachedBmp_46);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,414);


(lib.CachedBmp_45 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(img.CachedBmp_44);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_43 = function() {
	this.initialize(img.CachedBmp_43);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,406);


(lib.CachedBmp_42 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(img.CachedBmp_41);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_40 = function() {
	this.initialize(img.CachedBmp_40);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,342);


(lib.CachedBmp_39 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(img.CachedBmp_38);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_37 = function() {
	this.initialize(img.CachedBmp_37);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,398);


(lib.CachedBmp_36 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(img.CachedBmp_35);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_34 = function() {
	this.initialize(img.CachedBmp_34);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,398);


(lib.CachedBmp_33 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(img.CachedBmp_32);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_31 = function() {
	this.initialize(img.CachedBmp_31);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,402);


(lib.CachedBmp_30 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(img.CachedBmp_29);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_28 = function() {
	this.initialize(img.CachedBmp_28);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,398);


(lib.CachedBmp_27 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(img.CachedBmp_26);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_25 = function() {
	this.initialize(img.CachedBmp_25);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,377);


(lib.CachedBmp_24 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(img.CachedBmp_23);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_22 = function() {
	this.initialize(img.CachedBmp_22);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,404);


(lib.CachedBmp_21 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(img.CachedBmp_20);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_19 = function() {
	this.initialize(img.CachedBmp_19);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,390);


(lib.CachedBmp_18 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(img.CachedBmp_17);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_16 = function() {
	this.initialize(img.CachedBmp_16);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2228,404);


(lib.CachedBmp_15 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(img.CachedBmp_14);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2213,124);


(lib.CachedBmp_13 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.ab67616d0000b273a274d2a2f9ec1acda0431f84 = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.abcdefg = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.anarchy = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.back = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.back_white = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.ballots = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.Logo = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.ready = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.rebel = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.revenge = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.shhh = function() {
	this.initialize(ss["chumbawamba_discography_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.showb = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.singsong = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.slap = function() {
	this.initialize(ss["chumbawamba_discography_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.starving = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.swinging = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.theboy = function() {
	this.initialize(ss["chumbawamba_discography_atlas_8"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.tub = function() {
	this.initialize(ss["chumbawamba_discography_atlas_5"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Un = function() {
	this.initialize(ss["chumbawamba_discography_atlas_7"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.track2_wysiwyg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_93();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,444);


(lib.track2_un = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_92();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,440);


(lib.track2_tubthumper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_91();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,440);


(lib.track2_swingin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_90();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,444.5);


(lib.track2_slap = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_89();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,328);


(lib.track2_singsong = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_88();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,370);


(lib.track2_showbusiness = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_87();
	this.instance.setTransform(-160.8,-188.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-188.1,321.5,370);


(lib.track2_shhh = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_86();
	this.instance.setTransform(-160.8,-166.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-166.2,321.5,349);


(lib.track2_revengers = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_85();
	this.instance.setTransform(-160.8,-178.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-178.3,321.5,349);


(lib.track2_readymades = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_84();
	this.instance.setTransform(-160.8,-188.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-188.1,321.5,370);


(lib.track2_pictures = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_83();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,429);


(lib.track2_never = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_82();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,436);


(lib.track2_english = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_81();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,285);


(lib.track2_boy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_80();
	this.instance.setTransform(-155.8,-179.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-155.8,-179.4,321.5,397.5);


(lib.track2_anarchy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_79();
	this.instance.setTransform(-160.8,-176.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-176.8,321.5,378.5);


(lib.track2_abcdefg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_78();
	this.instance.setTransform(-160.8,-200,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-200,321.5,388.5);


(lib.track1_un = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_77();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,440);


(lib.track1_tubthumper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_76();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,440);


(lib.track1_swingin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_75();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,384.5);


(lib.track1_slap = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_74();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,429);


(lib.track1_singsong = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_73();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,438.5);


(lib.track1_showbusiness = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_72();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,438.5);


(lib.track1_shhh = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_71();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,430);


(lib.track1_revengers = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_70();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,430);


(lib.track1_readymades = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_69();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,438.5);


(lib.track1_pictures = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_68();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,429);


(lib.track1_never = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_67();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,436);


(lib.track1_english = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_66();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,646,438);


(lib.track1_boy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_65();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,431.5);


(lib.track1_anarchy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_64();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,437.5);


(lib.track1_abcdefg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,440);


(lib.play_wysiwyg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("wysiwyg_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.ab67616d0000b273a274d2a2f9ec1acda0431f84();
	this.instance.setTransform(-62.7,-62.7,0.196,0.196);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.play_un = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("un_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.Un();
	this.instance.setTransform(-62.7,-62.7,0.196,0.196);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.play_tubthumper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("tubthumper_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.tub();
	this.instance.setTransform(-63.2,-63.2,0.1756,0.1756);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("Ap3J4IAAzvITvAAIAATvg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("Ap3p3ITvAAIAATvIzvAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("Ap3p3ITvAAIAATvIzvAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.2,-66.2,132.4,132.4);


(lib.play_swingin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("swingin_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.swinging();
	this.instance.setTransform(-63.2,-62.7,0.2612,0.2612);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("Ap3JzIAAzlITvAAIAATlg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("Ap3pyITvAAIAATlIzvAAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("Ap3pyITvAAIAATlIzvAAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.2,-65.7,132.5,131.4);


(lib.play_slap = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("slap_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.slap();
	this.instance.setTransform(-61.9,-62.7,0.1385,0.1403);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApqJzIAAzlITVAAIAATlg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApqpyITVAAIAATlIzVAAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApqpyITVAAIAATlIzVAAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64.9,-65.7,129.9,131.4);


(lib.play_singsong = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("singsong_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.singsong();
	this.instance.setTransform(-63.7,-63.2,0.2124,0.2124);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("Ap8J4IAAzvIT5AAIAATvg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("Ap8p3IT5AAIAATvIz5AAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("Ap8p3IT5AAIAATvIz5AAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.7,-66.2,133.5,132.4);


(lib.play_showbusiness = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("showbusiness_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.showb();
	this.instance.setTransform(-62.35,-62.7,0.209,0.209);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApvJzIAAzlITfAAIAATlg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApvpyITfAAIAATlIzfAAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApvpyITfAAIAATlIzfAAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.3,-65.7,130.7,131.4);


(lib.play_shhh = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("shhh_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.shhh();
	this.instance.setTransform(-62.1,-62.6,0.1243,0.1298);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApsJyIAAzjITZAAIAATjg");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_1.setTransform(0.025,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_2.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.1,-65.6,130.3,131.3);


(lib.play_revengers = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("revengers_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.revenge();
	this.instance.setTransform(-61.9,-61.9,0.3918,0.3918);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApqJrIAAzVITVAAIAATVg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApqpqITVAAIAATVIzVAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApqpqITVAAIAATVIzVAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64.9,-64.9,129.8,129.8);


(lib.play_readymades = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("readymades_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.ready();
	this.instance.setTransform(-62.1,-62.1,0.5544,0.5544);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApsJtIAAzZITZAAIAATZg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApspsITZAAIAATZIzZAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApspsITZAAIAATZIzZAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.1,-65.1,130.2,130.2);


(lib.play_pictures = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("pictures_02wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.starving();
	this.instance.setTransform(-62.7,-62.7,0.1959,0.1959);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,1,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,1,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.play_never = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("never_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.ballots();
	this.instance.setTransform(-62.7,-62.7,0.1959,0.1959);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.play_english = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("english_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.rebel();
	this.instance.setTransform(-62.1,-62.6,0.2094,0.2112);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApsJyIAAzjITZAAIAATjg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_1.setTransform(0,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_2.setTransform(0,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.1,-65.6,130.2,131.3);


(lib.play_boy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("boy_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.theboy();
	this.instance.setTransform(-62.35,-62.35,0.3946,0.3946);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApvJwIAAzfITfAAIAATfg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApvpvITfAAIAATfIzfAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApvpvITfAAIAATfIzfAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.3,-65.3,130.7,130.7);


(lib.play_anarchy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("anarchy_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.anarchy();
	this.instance.setTransform(-62.7,-62.7,0.1959,0.1959);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.play_abcdefg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("abcdefg_01wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.abcdefg();
	this.instance.setTransform(-62.65,-62.65,0.5572,0.5572);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");
	this.shape_1.setTransform(0.025,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");
	this.shape_2.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.6,-65.6,131.3,131.3);


(lib.play = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#810D23").s().p("EhcBA82MAAAh5rMC4DAAAMAAAB5rg");
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-589,-389.4,1178.1,778.8);


(lib.list1_wysiwyg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(-160.8,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-216.9,321.5,444);


(lib.info_wysiwyg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_61();
	this.instance.setTransform(-556.9,-73.1,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_60();
	this.instance_1.setTransform(-191.1,-118.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_59();
	this.instance_2.setTransform(-556.9,-135.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-556.9,-135.3,1114,256.70000000000005);


(lib.info_un = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_57();
	this.instance_1.setTransform(-452.45,-103.85,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_56();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,261.2);


(lib.info_tubthumper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_54();
	this.instance_1.setTransform(-80.5,-105.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_53();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,263.7);


(lib.info_swingin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_51();
	this.instance_1.setTransform(178.2,-107.9,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_50();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,268.7);


(lib.info_slap = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_48();
	this.instance_1.setTransform(-354.5,-110.6,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_47();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,269.2);


(lib.info_singsong = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_45();
	this.instance_1.setTransform(220.5,-105.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_44();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,269.2);


(lib.info_showbusiness = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_42();
	this.instance_1.setTransform(30.05,-107.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_41();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,265.2);


(lib.info_shhh = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_39();
	this.instance_1.setTransform(-362.6,-110.6,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_38();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,233.2);


(lib.info_revengers = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(226.8,-103.65,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_35();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,261.2);


(lib.info_readymades = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_33();
	this.instance_1.setTransform(-51.25,-103.65,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_32();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,261.2);


(lib.info_pictures = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_30();
	this.instance_1.setTransform(266.75,-105.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_29();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,263.2);


(lib.info_never = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(-556.9,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_27();
	this.instance_1.setTransform(190.2,-105.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_26();
	this.instance_2.setTransform(-556.9,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-556.9,-127.6,1114,261.2);


(lib.info_english = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_24();
	this.instance_1.setTransform(98.15,-105.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_23();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,250.7);


(lib.info_boy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_21();
	this.instance_1.setTransform(248.05,-103.65,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_20();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,264.2);


(lib.info_anarchy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_18();
	this.instance_1.setTransform(-218.65,-105.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_17();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,257.2);


(lib.info_abcefg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_16();
	this.instance.setTransform(-559.6,-65.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_15();
	this.instance_1.setTransform(-201.85,-108.65,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_14();
	this.instance_2.setTransform(-559.6,-127.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.6,-127.6,1114,264.2);


(lib.continue_btn_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("scratch1_02wav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(1));

	// Layer_1
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-209.25,-22,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_8();
	this.instance_1.setTransform(-240.15,-35.4,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_11();
	this.instance_2.setTransform(-209.25,-22,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_10();
	this.instance_3.setTransform(-240.15,-35.4,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_13();
	this.instance_4.setTransform(-209.25,-22,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_12();
	this.instance_5.setTransform(-240.15,-35.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-240.1,-35.4,480.5,71);


(lib.Chumbalogo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Logo();
	this.instance.setTransform(-429,-40,0.538,0.538);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-429,-40,863.5,80.7);


(lib.btn_wysiwyg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ab67616d0000b273a274d2a2f9ec1acda0431f84();
	this.instance.setTransform(-62.7,-62.7,0.196,0.196);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.btn_un = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Un();
	this.instance.setTransform(-62.7,-62.7,0.196,0.196);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.btn_tubthumper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.tub();
	this.instance.setTransform(-63.2,-63.2,0.1756,0.1756);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("Ap3J4IAAzvITvAAIAATvg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("Ap3p3ITvAAIAATvIzvAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("Ap3p3ITvAAIAATvIzvAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.2,-66.2,132.4,132.4);


(lib.btn_swingin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.swinging();
	this.instance.setTransform(-63.2,-62.7,0.2612,0.2612);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("Ap3JzIAAzlITvAAIAATlg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("Ap3pyITvAAIAATlIzvAAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("Ap3pyITvAAIAATlIzvAAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.2,-65.7,132.5,131.4);


(lib.btn_slap = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.slap();
	this.instance.setTransform(-61.9,-62.7,0.1385,0.1403);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApqJzIAAzlITVAAIAATlg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApqpyITVAAIAATlIzVAAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApqpyITVAAIAATlIzVAAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64.9,-65.7,129.9,131.4);


(lib.btn_singsong = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.singsong();
	this.instance.setTransform(-63.7,-63.2,0.2124,0.2124);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("Ap8J4IAAzvIT5AAIAATvg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("Ap8p3IT5AAIAATvIz5AAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("Ap8p3IT5AAIAATvIz5AAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.7,-66.2,133.5,132.4);


(lib.btn_showbusiness = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.showb();
	this.instance.setTransform(-62.35,-62.7,0.209,0.209);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApvJzIAAzlITfAAIAATlg");
	this.shape.setTransform(0.025,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApvpyITfAAIAATlIzfAAg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApvpyITfAAIAATlIzfAAg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.3,-65.7,130.7,131.4);


(lib.btn_shhh = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.shhh();
	this.instance.setTransform(-62.1,-62.6,0.1243,0.1298);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApsJyIAAzjITZAAIAATjg");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_1.setTransform(0.025,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_2.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.1,-65.6,130.3,131.3);


(lib.btn_revengers = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.revenge();
	this.instance.setTransform(-61.9,-61.9,0.3918,0.3918);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApqJrIAAzVITVAAIAATVg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApqpqITVAAIAATVIzVAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApqpqITVAAIAATVIzVAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64.9,-64.9,129.8,129.8);


(lib.btn_readymades = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ready();
	this.instance.setTransform(-62.1,-62.1,0.5544,0.5544);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApsJtIAAzZITZAAIAATZg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApspsITZAAIAATZIzZAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApspsITZAAIAATZIzZAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.1,-65.1,130.2,130.2);


(lib.btn_pictures = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.starving();
	this.instance.setTransform(-62.7,-62.7,0.1959,0.1959);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,1,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,1,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.btn_never = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ballots();
	this.instance.setTransform(-62.7,-62.7,0.1959,0.1959);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.btn_english = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.rebel();
	this.instance.setTransform(-62.1,-62.6,0.2094,0.2112);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApsJyIAAzjITZAAIAATjg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_1.setTransform(0,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApspxITZAAIAATjIzZAAg");
	this.shape_2.setTransform(0,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.1,-65.6,130.2,131.3);


(lib.btn_boy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.theboy();
	this.instance.setTransform(-62.35,-62.35,0.3946,0.3946);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApvJwIAAzfITfAAIAATfg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApvpvITfAAIAATfIzfAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApvpvITfAAIAATfIzfAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.3,-65.3,130.7,130.7);


(lib.btn_back = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.back();
	this.instance.setTransform(-60.3,-12.85,0.0593,0.0593);

	this.instance_1 = new lib.CachedBmp_3();
	this.instance_1.setTransform(-37.7,-20.45,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_6();
	this.instance_2.setTransform(-72.7,-23.95,0.5,0.5);

	this.instance_3 = new lib.back_white();
	this.instance_3.setTransform(-60.3,-12.85,0.0593,0.0593);

	this.instance_4 = new lib.CachedBmp_5();
	this.instance_4.setTransform(-37.7,-20.45,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_4();
	this.instance_5.setTransform(-72.7,-23.95,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_7();
	this.instance_6.setTransform(-37.7,-20.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]},1).to({state:[{t:this.instance_2},{t:this.instance_6},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-23.9,142.5,47.5);


(lib.btn_anarchy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.anarchy();
	this.instance.setTransform(-62.7,-62.7,0.1959,0.1959);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.7,-65.7,131.4,131.4);


(lib.btn_abcdefg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.abcdefg();
	this.instance.setTransform(-62.65,-62.65,0.5572,0.5572);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("ApyJzIAAzlITlAAIAATlg");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");
	this.shape_1.setTransform(0.025,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(6,2,0,3).p("ApypyITlAAIAATlIzlAAg");
	this.shape_2.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.shape_1},{t:this.instance}]},1).to({state:[{t:this.shape},{t:this.shape_2},{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.6,-65.6,131.3,131.3);


// stage content:
(lib.chumbawambadiscography = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {wysiwyg:42,un:55,tubthumper:68,swingin:81,pictures:94,never:107,english:120,slap:133,shhh:146,anarchy:159,showbusiness:172,readymades:185,revengers:198,singsong:211,boy:224,abcdefg:237,disco:40};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,39,40,41,42,54,55,67,68,80,81,93,94,106,107,119,120,132,133,145,146,158,159,171,172,184,185,197,198,210,211,223,224,236,237,249];
	this.streamSoundSymbolsList[1] = [{id:"honk",startFrame:1,endFrame:42,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_15.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(2);
		});
	}
	this.frame_1 = function() {
		var soundInstance = playSound("honk",0);
		this.InsertIntoSoundStreamData(soundInstance,1,42,1);
	}
	this.frame_39 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_1.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_40 = function() {
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_2.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('wysiwyg');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_4.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('un');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_5.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('tubthumper');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_6.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('swingin');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_7.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('pictures');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_8.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('never');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_9.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('english');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_10.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('slap');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_11.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('shhh');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_12.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('anarchy');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_13.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('showbusiness');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_14.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('readymades');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_16.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('revengers');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_17.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('singsong');
		});
		
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_18.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('boy');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_19.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('abcdefg');
		});
	}
	this.frame_41 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_42 = function() {
		playSound("wysiwyg_01wav");
	}
	this.frame_54 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_55 = function() {
		playSound("un_01wav");
	}
	this.frame_67 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_68 = function() {
		playSound("tubthumper_01wav");
	}
	this.frame_80 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_81 = function() {
		playSound("swingin_01wav");
	}
	this.frame_93 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_94 = function() {
		playSound("pictures_02wav");
	}
	this.frame_106 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_107 = function() {
		playSound("never_01wav");
	}
	this.frame_119 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_120 = function() {
		playSound("english_01wav");
	}
	this.frame_132 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_133 = function() {
		playSound("slap_01wav");
	}
	this.frame_145 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_146 = function() {
		playSound("shhh_01wav");
	}
	this.frame_158 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_159 = function() {
		playSound("anarchy_01wav");
	}
	this.frame_171 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_172 = function() {
		playSound("showbusiness_01wav");
	}
	this.frame_184 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_185 = function() {
		playSound("readymades_01wav");
	}
	this.frame_197 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_198 = function() {
		playSound("revengers_01wav");
	}
	this.frame_210 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_211 = function() {
		playSound("singsong_01wav");
	}
	this.frame_223 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_224 = function() {
		playSound("boy_01wav");
	}
	this.frame_236 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}
	this.frame_237 = function() {
		playSound("abcdefg_01wav");
	}
	this.frame_249 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.button_3.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('disco');
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(38).call(this.frame_39).wait(1).call(this.frame_40).wait(1).call(this.frame_41).wait(1).call(this.frame_42).wait(12).call(this.frame_54).wait(1).call(this.frame_55).wait(12).call(this.frame_67).wait(1).call(this.frame_68).wait(12).call(this.frame_80).wait(1).call(this.frame_81).wait(12).call(this.frame_93).wait(1).call(this.frame_94).wait(12).call(this.frame_106).wait(1).call(this.frame_107).wait(12).call(this.frame_119).wait(1).call(this.frame_120).wait(12).call(this.frame_132).wait(1).call(this.frame_133).wait(12).call(this.frame_145).wait(1).call(this.frame_146).wait(12).call(this.frame_158).wait(1).call(this.frame_159).wait(12).call(this.frame_171).wait(1).call(this.frame_172).wait(12).call(this.frame_184).wait(1).call(this.frame_185).wait(12).call(this.frame_197).wait(1).call(this.frame_198).wait(12).call(this.frame_210).wait(1).call(this.frame_211).wait(12).call(this.frame_223).wait(1).call(this.frame_224).wait(12).call(this.frame_236).wait(1).call(this.frame_237).wait(12).call(this.frame_249).wait(1));

	// button1
	this.button_15 = new lib.play();
	this.button_15.name = "button_15";
	this.button_15.setTransform(601,402.4);
	new cjs.ButtonHelper(this.button_15, 0, 1, 1);

	this.instance = new lib.continue_btn_1();
	this.instance.setTransform(600.55,621.9);
	this.instance.alpha = 0;
	this.instance._off = true;
	new cjs.ButtonHelper(this.instance, 0, 1, 2);

	this.button_1 = new lib.continue_btn_1();
	this.button_1.name = "button_1";
	this.button_1.setTransform(601.55,621.9);
	new cjs.ButtonHelper(this.button_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.button_15}]}).to({state:[]},1).to({state:[{t:this.instance}]},23).to({state:[{t:this.button_1}]},15).to({state:[]},1).wait(210));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(24).to({_off:false},0).to({_off:true,x:601.55,alpha:1},15).wait(211));

	// return_idn
	this.button_3 = new lib.btn_back();
	this.button_3.name = "button_3";
	this.button_3.setTransform(1091.8,62.65,1,1,0,0,0,-1.5,-0.2);
	this.button_3.alpha = 0;
	this.button_3._off = true;
	new cjs.ButtonHelper(this.button_3, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button_3).wait(42).to({_off:false},0).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).to({alpha:0},1).to({alpha:1},12).wait(1));

	// tracklist1
	this.instance_1 = new lib.list1_wysiwyg("synched",0);
	this.instance_1.setTransform(668.55,-220.05);
	this.instance_1._off = true;

	this.instance_2 = new lib.track1_un("synched",0);
	this.instance_2.setTransform(668.55,-217.05);
	this.instance_2._off = true;

	this.instance_3 = new lib.track1_tubthumper("synched",0);
	this.instance_3.setTransform(668.55,-217.05);
	this.instance_3._off = true;

	this.instance_4 = new lib.track1_swingin("synched",0);
	this.instance_4.setTransform(668.55,-217.05);
	this.instance_4._off = true;

	this.instance_5 = new lib.track1_pictures("synched",0);
	this.instance_5.setTransform(668.55,-217.05);
	this.instance_5._off = true;

	this.instance_6 = new lib.track1_never("synched",0);
	this.instance_6.setTransform(668.55,-217.05);
	this.instance_6._off = true;

	this.instance_7 = new lib.track1_english("synched",0);
	this.instance_7.setTransform(668.55,-217.05);
	this.instance_7._off = true;

	this.instance_8 = new lib.track1_slap("synched",0);
	this.instance_8.setTransform(668.55,-217.05);
	this.instance_8._off = true;

	this.instance_9 = new lib.track1_shhh("synched",0);
	this.instance_9.setTransform(668.55,-217.05);
	this.instance_9._off = true;

	this.instance_10 = new lib.track1_anarchy("synched",0);
	this.instance_10.setTransform(668.55,-217.05);
	this.instance_10._off = true;

	this.instance_11 = new lib.track1_showbusiness("synched",0);
	this.instance_11.setTransform(668.55,-217.05);
	this.instance_11._off = true;

	this.instance_12 = new lib.track1_readymades("synched",0);
	this.instance_12.setTransform(668.55,-217.05);
	this.instance_12._off = true;

	this.instance_13 = new lib.track1_revengers("synched",0);
	this.instance_13.setTransform(668.55,-217.05);
	this.instance_13._off = true;

	this.instance_14 = new lib.track1_singsong("synched",0);
	this.instance_14.setTransform(668.55,-217.05);
	this.instance_14._off = true;

	this.instance_15 = new lib.track1_boy("synched",0);
	this.instance_15.setTransform(668.55,-217.05);
	this.instance_15._off = true;

	this.instance_16 = new lib.track1_abcdefg("synched",0);
	this.instance_16.setTransform(668.55,-217.05);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(42).to({_off:false},0).to({y:533},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(195));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(54).to({_off:false},1).to({y:533},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(182));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(67).to({_off:false},1).to({y:536},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(169));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(80).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(156));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(93).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(143));
	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(106).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(130));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(119).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(117));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(132).to({_off:false},1).to({y:536.6},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(104));
	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(145).to({_off:false},1).to({y:534.2},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(91));
	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(158).to({_off:false},1).to({y:532.2},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(78));
	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(171).to({_off:false},1).to({y:534},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(65));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(184).to({_off:false},1).to({y:536.4},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(52));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(197).to({_off:false},1).to({y:538.8,mode:"independent"},12,cjs.Ease.sineOut).to({_off:true,y:-217.05,mode:"synched",startPosition:0},1).wait(39));
	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(210).to({_off:false},1).to({y:536.6},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(26));
	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(223).to({_off:false},1).to({y:536.8},12,cjs.Ease.sineOut).to({_off:true,y:-217.05},1).wait(13));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(236).to({_off:false},1).to({y:535.6},12,cjs.Ease.sineOut).wait(1));

	// tracklist2
	this.instance_17 = new lib.track2_wysiwyg("synched",0);
	this.instance_17.setTransform(990.2,1015.4);
	this.instance_17._off = true;

	this.instance_18 = new lib.track2_un("synched",0);
	this.instance_18.setTransform(990.2,1018.4);
	this.instance_18._off = true;

	this.instance_19 = new lib.track2_tubthumper("synched",0);
	this.instance_19.setTransform(990.2,1018.4);
	this.instance_19._off = true;

	this.instance_20 = new lib.track2_swingin("synched",0);
	this.instance_20.setTransform(990.2,1018.4);
	this.instance_20._off = true;

	this.instance_21 = new lib.track2_pictures("synched",0);
	this.instance_21.setTransform(990.2,1018.4);
	this.instance_21._off = true;

	this.instance_22 = new lib.track2_never("synched",0);
	this.instance_22.setTransform(990.2,1018.4);
	this.instance_22._off = true;

	this.instance_23 = new lib.track2_english("synched",0);
	this.instance_23.setTransform(990.2,1018.4);
	this.instance_23._off = true;

	this.instance_24 = new lib.track2_slap("synched",0);
	this.instance_24.setTransform(990.2,1018.4);
	this.instance_24._off = true;

	this.instance_25 = new lib.track2_shhh("synched",0);
	this.instance_25.setTransform(990.2,1018.4);
	this.instance_25._off = true;

	this.instance_26 = new lib.track2_anarchy("synched",0);
	this.instance_26.setTransform(990.2,1018.4);
	this.instance_26._off = true;

	this.instance_27 = new lib.track2_showbusiness("synched",0);
	this.instance_27.setTransform(990.2,1018.4);
	this.instance_27._off = true;

	this.instance_28 = new lib.track2_readymades("synched",0);
	this.instance_28.setTransform(990.2,1018.4);
	this.instance_28._off = true;

	this.instance_29 = new lib.track2_revengers("synched",0);
	this.instance_29.setTransform(990.2,1018.4);
	this.instance_29._off = true;

	this.instance_30 = new lib.track2_singsong("synched",0);
	this.instance_30.setTransform(990.2,1018.4);
	this.instance_30._off = true;

	this.instance_31 = new lib.track2_boy("synched",0);
	this.instance_31.setTransform(990.2,1018.4);
	this.instance_31._off = true;

	this.instance_32 = new lib.track2_abcdefg("synched",0);
	this.instance_32.setTransform(990.2,1018.4);
	this.instance_32._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(42).to({_off:false},0).to({y:533},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(195));
	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(54).to({_off:false},1).to({y:533},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(182));
	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(67).to({_off:false},1).to({y:536},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(169));
	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(80).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(156));
	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(93).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(143));
	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(106).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(130));
	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(119).to({_off:false},1).to({y:539},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(117));
	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(132).to({_off:false},1).to({y:536.6},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(104));
	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(145).to({_off:false},1).to({y:483.8},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(91));
	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(158).to({_off:false},1).to({y:492.05},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(78));
	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(171).to({_off:false},1).to({y:504.5},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(65));
	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(184).to({_off:false},1).to({y:501.3},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(52));
	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(197).to({_off:false},1).to({y:500,mode:"independent"},12,cjs.Ease.sineOut).to({_off:true,y:1018.4,mode:"synched",startPosition:0},1).wait(39));
	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(210).to({_off:false},1).to({y:536.6},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(26));
	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(223).to({_off:false},1).to({y:496.15},12,cjs.Ease.sineOut).to({_off:true,y:1018.4},1).wait(13));
	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(236).to({_off:false},1).to({x:995.2,y:515.55},12,cjs.Ease.sineOut).wait(1));

	// album_info
	this.instance_33 = new lib.info_wysiwyg("synched",0);
	this.instance_33.setTransform(607.25,170.95);
	this.instance_33.alpha = 0;
	this.instance_33._off = true;

	this.instance_34 = new lib.info_un("synched",0);
	this.instance_34.setTransform(607.25,162.25);
	this.instance_34.alpha = 0;
	this.instance_34._off = true;

	this.instance_35 = new lib.info_tubthumper("synched",0);
	this.instance_35.setTransform(607.25,162.25);
	this.instance_35.alpha = 0;
	this.instance_35._off = true;

	this.instance_36 = new lib.info_swingin("synched",0);
	this.instance_36.setTransform(607.25,162.25);
	this.instance_36.alpha = 0;
	this.instance_36._off = true;

	this.instance_37 = new lib.info_pictures("synched",0);
	this.instance_37.setTransform(607.25,166.45);
	this.instance_37.alpha = 0;
	this.instance_37._off = true;

	this.instance_38 = new lib.info_never("synched",0);
	this.instance_38.setTransform(607.25,162.25);
	this.instance_38.alpha = 0;
	this.instance_38._off = true;

	this.instance_39 = new lib.info_english("synched",0);
	this.instance_39.setTransform(607.25,162.25);
	this.instance_39.alpha = 0;
	this.instance_39._off = true;

	this.instance_40 = new lib.info_slap("synched",0);
	this.instance_40.setTransform(607.25,170.55);
	this.instance_40.alpha = 0;
	this.instance_40._off = true;

	this.instance_41 = new lib.info_shhh("synched",0);
	this.instance_41.setTransform(607.25,170.55);
	this.instance_41.alpha = 0;
	this.instance_41._off = true;

	this.instance_42 = new lib.info_anarchy("synched",0);
	this.instance_42.setTransform(607.25,170.55);
	this.instance_42.alpha = 0;
	this.instance_42._off = true;

	this.instance_43 = new lib.info_showbusiness("synched",0);
	this.instance_43.setTransform(607.25,170.55);
	this.instance_43.alpha = 0;
	this.instance_43._off = true;

	this.instance_44 = new lib.info_readymades("synched",0);
	this.instance_44.setTransform(607.25,170.55);
	this.instance_44.alpha = 0;
	this.instance_44._off = true;

	this.instance_45 = new lib.info_revengers("synched",0);
	this.instance_45.setTransform(607.25,170.55);
	this.instance_45.alpha = 0;
	this.instance_45._off = true;

	this.instance_46 = new lib.info_singsong("synched",0);
	this.instance_46.setTransform(607.25,170.55);
	this.instance_46.alpha = 0;
	this.instance_46._off = true;

	this.instance_47 = new lib.info_boy("synched",0);
	this.instance_47.setTransform(607.25,170.55);
	this.instance_47.alpha = 0;
	this.instance_47._off = true;

	this.instance_48 = new lib.info_abcefg("synched",0);
	this.instance_48.setTransform(607.25,170.55);
	this.instance_48.alpha = 0;
	this.instance_48._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(42).to({_off:false},0).to({alpha:1},12).to({_off:true,y:162.25,alpha:0},1).wait(195));
	this.timeline.addTween(cjs.Tween.get(this.instance_34).wait(54).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(182));
	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(67).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(169));
	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(80).to({_off:false},1).to({alpha:1},12).to({_off:true,y:166.45,alpha:0},1).wait(156));
	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(93).to({_off:false},1).to({alpha:1},12).to({_off:true,y:162.25,alpha:0},1).wait(143));
	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(106).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(130));
	this.timeline.addTween(cjs.Tween.get(this.instance_39).wait(119).to({_off:false},1).to({alpha:1},12).to({_off:true,y:170.55,alpha:0},1).wait(117));
	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(132).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(104));
	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(145).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(91));
	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(158).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(78));
	this.timeline.addTween(cjs.Tween.get(this.instance_43).wait(171).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(65));
	this.timeline.addTween(cjs.Tween.get(this.instance_44).wait(184).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(52));
	this.timeline.addTween(cjs.Tween.get(this.instance_45).wait(197).to({_off:false},1).to({alpha:1,mode:"independent"},12).to({_off:true,alpha:0,mode:"synched",startPosition:0},1).wait(39));
	this.timeline.addTween(cjs.Tween.get(this.instance_46).wait(210).to({_off:false},1).to({alpha:1,mode:"independent"},12).to({_off:true,alpha:0,mode:"synched",startPosition:0},1).wait(26));
	this.timeline.addTween(cjs.Tween.get(this.instance_47).wait(223).to({_off:false},1).to({alpha:1},12).to({_off:true,alpha:0},1).wait(13));
	this.timeline.addTween(cjs.Tween.get(this.instance_48).wait(236).to({_off:false},1).to({alpha:1},12).wait(1));

	// albums
	this.button_19 = new lib.btn_abcdefg();
	this.button_19.name = "button_19";
	this.button_19.setTransform(1096.65,504.65);
	new cjs.ButtonHelper(this.button_19, 0, 1, 2);

	this.button_18 = new lib.btn_boy();
	this.button_18.name = "button_18";
	this.button_18.setTransform(955.35,504.35);
	new cjs.ButtonHelper(this.button_18, 0, 1, 2);

	this.button_17 = new lib.btn_singsong();
	this.button_17.name = "button_17";
	this.button_17.setTransform(815.7,504.2);
	new cjs.ButtonHelper(this.button_17, 0, 1, 2);

	this.button_4 = new lib.btn_un();
	this.button_4.name = "button_4";
	this.button_4.setTransform(673.7,503.7);
	new cjs.ButtonHelper(this.button_4, 0, 1, 2);

	this.button_16 = new lib.btn_revengers();
	this.button_16.name = "button_16";
	this.button_16.setTransform(531.9,502.9);
	new cjs.ButtonHelper(this.button_16, 0, 1, 2);

	this.button_14 = new lib.btn_readymades();
	this.button_14.name = "button_14";
	this.button_14.setTransform(391.1,503.1);
	new cjs.ButtonHelper(this.button_14, 0, 1, 2);

	this.button_2 = new lib.btn_wysiwyg();
	this.button_2.name = "button_2";
	this.button_2.setTransform(250.7,503.7);
	new cjs.ButtonHelper(this.button_2, 0, 1, 2);

	this.button_5 = new lib.btn_tubthumper();
	this.button_5.name = "button_5";
	this.button_5.setTransform(109.2,504.2);
	new cjs.ButtonHelper(this.button_5, 0, 1, 2);

	this.button_6 = new lib.btn_swingin();
	this.button_6.name = "button_6";
	this.button_6.setTransform(1097.2,340.7);
	new cjs.ButtonHelper(this.button_6, 0, 1, 2);

	this.button_13 = new lib.btn_showbusiness();
	this.button_13.name = "button_13";
	this.button_13.setTransform(955.35,340.7);
	new cjs.ButtonHelper(this.button_13, 0, 1, 2);

	this.button_12 = new lib.btn_anarchy();
	this.button_12.name = "button_12";
	this.button_12.setTransform(814.7,340.7);
	new cjs.ButtonHelper(this.button_12, 0, 1, 2);

	this.button_11 = new lib.btn_shhh();
	this.button_11.name = "button_11";
	this.button_11.setTransform(673.1,340.6);
	new cjs.ButtonHelper(this.button_11, 0, 1, 2);

	this.button_10 = new lib.btn_slap();
	this.button_10.name = "button_10";
	this.button_10.setTransform(531.9,340.7);
	new cjs.ButtonHelper(this.button_10, 0, 1, 2);

	this.button_9 = new lib.btn_english();
	this.button_9.name = "button_9";
	this.button_9.setTransform(391.1,340.6);
	new cjs.ButtonHelper(this.button_9, 0, 1, 2);

	this.button_8 = new lib.btn_never();
	this.button_8.name = "button_8";
	this.button_8.setTransform(250.7,340.7);
	new cjs.ButtonHelper(this.button_8, 0, 1, 2);

	this.button_7 = new lib.btn_pictures();
	this.button_7.name = "button_7";
	this.button_7.setTransform(109.7,340.7);
	new cjs.ButtonHelper(this.button_7, 0, 1, 2);

	this.instance_49 = new lib.play_wysiwyg();
	this.instance_49.setTransform(250.7,503.7);
	this.instance_49._off = true;
	new cjs.ButtonHelper(this.instance_49, 0, 1, 2);

	this.instance_50 = new lib.play_un();
	this.instance_50.setTransform(673.7,503.7);
	this.instance_50._off = true;
	new cjs.ButtonHelper(this.instance_50, 0, 1, 2);

	this.instance_51 = new lib.play_tubthumper();
	this.instance_51.setTransform(109.2,504.2);
	this.instance_51._off = true;
	new cjs.ButtonHelper(this.instance_51, 0, 1, 2);

	this.instance_52 = new lib.play_swingin();
	this.instance_52.setTransform(1097.2,340.7);
	this.instance_52._off = true;
	new cjs.ButtonHelper(this.instance_52, 0, 1, 2);

	this.instance_53 = new lib.play_pictures();
	this.instance_53.setTransform(109.7,340.7);
	this.instance_53._off = true;
	new cjs.ButtonHelper(this.instance_53, 0, 1, 2);

	this.instance_54 = new lib.play_never();
	this.instance_54.setTransform(250.7,340.7);
	this.instance_54._off = true;
	new cjs.ButtonHelper(this.instance_54, 0, 1, 2);

	this.instance_55 = new lib.play_english();
	this.instance_55.setTransform(391.1,340.6);
	this.instance_55._off = true;
	new cjs.ButtonHelper(this.instance_55, 0, 1, 2);

	this.instance_56 = new lib.play_slap();
	this.instance_56.setTransform(531.9,340.7);
	this.instance_56._off = true;
	new cjs.ButtonHelper(this.instance_56, 0, 1, 2);

	this.instance_57 = new lib.play_shhh();
	this.instance_57.setTransform(673.1,340.6);
	this.instance_57._off = true;
	new cjs.ButtonHelper(this.instance_57, 0, 1, 2);

	this.instance_58 = new lib.play_anarchy();
	this.instance_58.setTransform(814.7,340.7);
	this.instance_58._off = true;
	new cjs.ButtonHelper(this.instance_58, 0, 1, 2);

	this.instance_59 = new lib.play_showbusiness();
	this.instance_59.setTransform(955.35,340.7);
	this.instance_59._off = true;
	new cjs.ButtonHelper(this.instance_59, 0, 1, 2);

	this.instance_60 = new lib.play_readymades();
	this.instance_60.setTransform(391.1,503.1);
	this.instance_60._off = true;
	new cjs.ButtonHelper(this.instance_60, 0, 1, 2);

	this.instance_61 = new lib.play_revengers();
	this.instance_61.setTransform(531.9,502.9);
	this.instance_61._off = true;
	new cjs.ButtonHelper(this.instance_61, 0, 1, 2);

	this.instance_62 = new lib.play_singsong();
	this.instance_62.setTransform(815.7,504.2);
	this.instance_62._off = true;
	new cjs.ButtonHelper(this.instance_62, 0, 1, 2);

	this.instance_63 = new lib.play_boy();
	this.instance_63.setTransform(955.35,504.35);
	this.instance_63._off = true;
	new cjs.ButtonHelper(this.instance_63, 0, 1, 2);

	this.instance_64 = new lib.play_abcdefg();
	this.instance_64.setTransform(1096.65,504.65);
	this.instance_64._off = true;
	new cjs.ButtonHelper(this.instance_64, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.button_7},{t:this.button_8},{t:this.button_9},{t:this.button_10},{t:this.button_11},{t:this.button_12},{t:this.button_13},{t:this.button_6},{t:this.button_5},{t:this.button_2},{t:this.button_14},{t:this.button_16},{t:this.button_4},{t:this.button_17},{t:this.button_18},{t:this.button_19}]},40).to({state:[{t:this.instance_49}]},2).to({state:[{t:this.instance_49}]},12).to({state:[{t:this.instance_50}]},1).to({state:[{t:this.instance_50}]},12).to({state:[{t:this.instance_51}]},1).to({state:[{t:this.instance_51}]},12).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_52}]},12).to({state:[{t:this.instance_53}]},1).to({state:[{t:this.instance_53}]},12).to({state:[{t:this.instance_54}]},1).to({state:[{t:this.instance_54}]},12).to({state:[{t:this.instance_55}]},1).to({state:[{t:this.instance_55}]},12).to({state:[{t:this.instance_56}]},1).to({state:[{t:this.instance_56}]},12).to({state:[{t:this.instance_57}]},1).to({state:[{t:this.instance_57}]},12).to({state:[{t:this.instance_58}]},1).to({state:[{t:this.instance_58}]},12).to({state:[{t:this.instance_59}]},1).to({state:[{t:this.instance_59}]},12).to({state:[{t:this.instance_60}]},1).to({state:[{t:this.instance_60}]},12).to({state:[{t:this.instance_61}]},1).to({state:[{t:this.instance_61}]},12).to({state:[{t:this.instance_62}]},1).to({state:[{t:this.instance_62}]},12).to({state:[{t:this.instance_63}]},1).to({state:[{t:this.instance_63}]},12).to({state:[{t:this.instance_64}]},1).to({state:[{t:this.instance_64}]},12).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_49).wait(42).to({_off:false},0).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:673.7,y:503.7},1).wait(195));
	this.timeline.addTween(cjs.Tween.get(this.instance_50).wait(54).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:109.2,y:504.2},1).wait(182));
	this.timeline.addTween(cjs.Tween.get(this.instance_51).wait(67).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:1097.2,y:340.7},1).wait(169));
	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(80).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:109.7,y:340.7},1).wait(156));
	this.timeline.addTween(cjs.Tween.get(this.instance_53).wait(93).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:250.7,y:340.7},1).wait(143));
	this.timeline.addTween(cjs.Tween.get(this.instance_54).wait(106).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:391.1,y:340.6},1).wait(130));
	this.timeline.addTween(cjs.Tween.get(this.instance_55).wait(119).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:531.9,y:340.7},1).wait(117));
	this.timeline.addTween(cjs.Tween.get(this.instance_56).wait(132).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:673.1,y:340.6},1).wait(104));
	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(145).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:814.7,y:340.7},1).wait(91));
	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(158).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:955.35,y:340.7},1).wait(78));
	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(171).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:391.1,y:503.1},1).wait(65));
	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(184).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:531.9,y:502.9},1).wait(52));
	this.timeline.addTween(cjs.Tween.get(this.instance_61).wait(197).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:815.7,y:504.2},1).wait(39));
	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(210).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:955.35,y:504.35},1).wait(26));
	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(223).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).to({_off:true,scaleX:1,scaleY:1,x:1096.65,y:504.65},1).wait(13));
	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(236).to({_off:false},1).to({scaleX:3.5023,scaleY:3.5023,x:269.8,y:535.7},12,cjs.Ease.sineOut).wait(1));

	// logo
	this.instance_65 = new lib.Chumbalogo("synched",0);
	this.instance_65.setTransform(597.4,405.2,1,9.5853);
	this.instance_65._off = true;
	var instance_65Filter_1 = new cjs.ColorFilter(1,1,1,1,0,0,0,0);
	this.instance_65.filters = [instance_65Filter_1];
	this.instance_65.cache(-431,-42,868,85);

	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(1).to({_off:false},0).to({scaleY:1},23,cjs.Ease.sineOut).wait(16).to({y:83.6},0).to({_off:true},2).wait(208));
	this.timeline.addTween(cjs.Tween.get(instance_65Filter_1).wait(1).to(new cjs.ColorFilter(0,0,0,1,255,0,0,0), 0).to(new cjs.ColorFilter(1,1,1,1,0,0,0,0), 23,cjs.Ease.sineOut).wait(224));

	// title
	this.instance_66 = new lib.CachedBmp_1();
	this.instance_66.setTransform(200.4,142.8,0.5,0.5);
	this.instance_66._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_66).wait(40).to({_off:false},0).to({_off:true},2).wait(208));

	this.filterCacheList = [];
	this.filterCacheList.push({instance: this.instance_65, startFrame:1, endFrame:1, x:-431, y:-42, w:868, h:85});
	this.filterCacheList.push({instance: this.instance_65, startFrame:0, endFrame:0, x:-431, y:-42, w:868, h:85});
	this.filterCacheList.push({instance: this.instance_65, startFrame:2, endFrame:24, x:-431, y:-42, w:868, h:85});
	this.filterCacheList.push({instance: this.instance_65, startFrame:40, endFrame:40, x:-431, y:-42, w:868, h:85});
	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(612,-36.9,578.0999999999999,1282.9);
// library properties:
lib.properties = {
	id: '9D2FF2DD75C5BE4C801053827D53EF2C',
	width: 1200,
	height: 800,
	fps: 25,
	color: "#810D23",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_61.png", id:"CachedBmp_61"},
		{src:"images/CachedBmp_59.png", id:"CachedBmp_59"},
		{src:"images/CachedBmp_58.png", id:"CachedBmp_58"},
		{src:"images/CachedBmp_56.png", id:"CachedBmp_56"},
		{src:"images/CachedBmp_55.png", id:"CachedBmp_55"},
		{src:"images/CachedBmp_53.png", id:"CachedBmp_53"},
		{src:"images/CachedBmp_52.png", id:"CachedBmp_52"},
		{src:"images/CachedBmp_50.png", id:"CachedBmp_50"},
		{src:"images/CachedBmp_49.png", id:"CachedBmp_49"},
		{src:"images/CachedBmp_47.png", id:"CachedBmp_47"},
		{src:"images/CachedBmp_46.png", id:"CachedBmp_46"},
		{src:"images/CachedBmp_44.png", id:"CachedBmp_44"},
		{src:"images/CachedBmp_43.png", id:"CachedBmp_43"},
		{src:"images/CachedBmp_41.png", id:"CachedBmp_41"},
		{src:"images/CachedBmp_40.png", id:"CachedBmp_40"},
		{src:"images/CachedBmp_38.png", id:"CachedBmp_38"},
		{src:"images/CachedBmp_37.png", id:"CachedBmp_37"},
		{src:"images/CachedBmp_35.png", id:"CachedBmp_35"},
		{src:"images/CachedBmp_34.png", id:"CachedBmp_34"},
		{src:"images/CachedBmp_32.png", id:"CachedBmp_32"},
		{src:"images/CachedBmp_31.png", id:"CachedBmp_31"},
		{src:"images/CachedBmp_29.png", id:"CachedBmp_29"},
		{src:"images/CachedBmp_28.png", id:"CachedBmp_28"},
		{src:"images/CachedBmp_26.png", id:"CachedBmp_26"},
		{src:"images/CachedBmp_25.png", id:"CachedBmp_25"},
		{src:"images/CachedBmp_23.png", id:"CachedBmp_23"},
		{src:"images/CachedBmp_22.png", id:"CachedBmp_22"},
		{src:"images/CachedBmp_20.png", id:"CachedBmp_20"},
		{src:"images/CachedBmp_19.png", id:"CachedBmp_19"},
		{src:"images/CachedBmp_17.png", id:"CachedBmp_17"},
		{src:"images/CachedBmp_16.png", id:"CachedBmp_16"},
		{src:"images/CachedBmp_14.png", id:"CachedBmp_14"},
		{src:"images/chumbawamba_discography_atlas_1.png", id:"chumbawamba_discography_atlas_1"},
		{src:"images/chumbawamba_discography_atlas_2.png", id:"chumbawamba_discography_atlas_2"},
		{src:"images/chumbawamba_discography_atlas_3.png", id:"chumbawamba_discography_atlas_3"},
		{src:"images/chumbawamba_discography_atlas_4.png", id:"chumbawamba_discography_atlas_4"},
		{src:"images/chumbawamba_discography_atlas_5.png", id:"chumbawamba_discography_atlas_5"},
		{src:"images/chumbawamba_discography_atlas_6.png", id:"chumbawamba_discography_atlas_6"},
		{src:"images/chumbawamba_discography_atlas_7.png", id:"chumbawamba_discography_atlas_7"},
		{src:"images/chumbawamba_discography_atlas_8.png", id:"chumbawamba_discography_atlas_8"},
		{src:"sounds/abcdefg_01wav.mp3", id:"abcdefg_01wav"},
		{src:"sounds/anarchy_01wav.mp3", id:"anarchy_01wav"},
		{src:"sounds/boy_01wav.mp3", id:"boy_01wav"},
		{src:"sounds/english_01wav.mp3", id:"english_01wav"},
		{src:"sounds/honk.mp3", id:"honk"},
		{src:"sounds/never_01wav.mp3", id:"never_01wav"},
		{src:"sounds/pictures_02wav.mp3", id:"pictures_02wav"},
		{src:"sounds/readymades_01wav.mp3", id:"readymades_01wav"},
		{src:"sounds/revengers_01wav.mp3", id:"revengers_01wav"},
		{src:"sounds/scratch1_02wav.mp3", id:"scratch1_02wav"},
		{src:"sounds/shhh_01wav.mp3", id:"shhh_01wav"},
		{src:"sounds/showbusiness_01wav.mp3", id:"showbusiness_01wav"},
		{src:"sounds/singsong_01wav.mp3", id:"singsong_01wav"},
		{src:"sounds/slap_01wav.mp3", id:"slap_01wav"},
		{src:"sounds/swingin_01wav.mp3", id:"swingin_01wav"},
		{src:"sounds/tubthumper_01wav.mp3", id:"tubthumper_01wav"},
		{src:"sounds/un_01wav.mp3", id:"un_01wav"},
		{src:"sounds/wysiwyg_01wav.mp3", id:"wysiwyg_01wav"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['9D2FF2DD75C5BE4C801053827D53EF2C'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;