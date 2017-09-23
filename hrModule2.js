exports.result = function (input){

	res = {};
// 	obj = {
// 		"horse": "MR STUNNING(V153)",
// 		"jockey": "J Moreira",
//         "trainer": "J Size"
// 	}

// 	res["q1"] = obj;

// 	obj = {
// 		"horse": "LUCKY BUBBLES(T211)",
//         "jockey": "B Prebble",
//         "trainer": "K W Lui"
// 	}

// 	res["q2"] = obj;

// 	res["q3"] = [
//         {
//             "jockeys": [
//                 "C Williams",
//                 "K C Leung",
//                 "C Murray"
//             ],
//             "races": [
//                 "2017-06-04:3",
//                 "2017-06-04:4",
//                 "2017-06-04:5"
//             ]
//         }
//     ];

//     return res;
// }
	
	q1Storage = {
		horse_G: {},
		jockey_G: {},
		trainer_G: {}
	};

	q2Storage = {};

	q3Storage = {
		jockey_G: {},
		raceno_G: {}
	};

	storage = {};

	jockeyDict = {};
	jockeyRevDict = {};

	msg = ""
	// msg2 = ""
	maxPlacing = 0;
	minPlacing = 200;

	data = input.data;
	console.log (data.length);
	// data = input;

	//  ------------------ PreProcessing Part 3 -------------------

	for (var i in data){
		entry = data [i];
		raceno = entry.racedate + ":" + entry.raceno;

		var rank = parseInt (entry.Placing);

		if (rank > maxPlacing){
			maxPlacing = rank;
		}
		if (rank < minPlacing){
			minPlacing = rank;
		}

		var obj = {
			"jockey": entry.jockeycode,
			"trainer": entry.Trainer,
			"horse": entry.Horse
		};

		// if (parseInt (entry.racedate.substring (0,4)) > 2016 && parseInt (entry.racedate.substring (5, 7)) > 11){
		// 	console.log (entry.racedate + ":" + entry.Placing);
		// }

		if (! (raceno in storage)){
			storage [raceno] = {};
		}

		if (! (rank in storage [raceno]))
		{
			storage [raceno][rank] = [];
		}
		
		storage [raceno][rank].push (obj);
			
	}

	var counter = 0;
	for (var raceno in storage){
		for (var rank in storage[raceno]){
			counter += storage[raceno][rank].length;
		}
	}
	console.log ("118: " + counter);

	for (var raceno in storage){
		if (-1 in storage [raceno]){
			delete storage [raceno][-1];
		}

		tempArr = []
		for (var rank in storage [raceno]){ 
			tempArr.push (rank);

		}

		tempArr.sort ();
		counter = 1;
		for (var i in tempArr){
			key = tempArr [i];
			storage [raceno][counter] = storage [raceno][key];
			counter ++;
		}
		for (var i = counter; i <= maxPlacing; i++){
			if (i in storage [raceno]){
				delete storage [raceno][i];
			}
		}
	}

//  ------------------ Q1/2 Pre Processing -------------------

	for (var raceno in storage){
		for (var rank in storage [raceno]){
			for (var i in storage [raceno][rank]){

				rankInt = parseInt (rank)
				entry = storage [raceno][rank][i];
				horse = entry.horse;
				trainer = entry.trainer;
				jockey = entry.jockey;
				combo = horse + "," + jockey + "," + trainer;

				switch (rankInt){

					case 1:
						q1Storage.horse_G [horse] = (horse in q1Storage.horse_G ? q1Storage.horse_G [horse] + 1 : 1);
						q1Storage.jockey_G [jockey] = (jockey in q1Storage.jockey_G ? q1Storage.jockey_G [jockey] + 1 : 1);
						q1Storage.trainer_G [trainer] = (trainer in q1Storage.trainer_G ? q1Storage.trainer_G [trainer] + 1 : 1);
						q2Storage [combo] = (combo in q2Storage ? q2Storage [combo] + 7 : 7);
						break;

					case 2:
						q2Storage [combo] = (combo in q2Storage ? q2Storage [combo] + 3 : 3);
						break;

					case 3:
						q2Storage [combo] = (combo in q2Storage ? q2Storage [combo] + 1 : 1);
						break;
				}
			
			}
		}
	}

//  ------------------ Q1/2 Post Processing -------------------


	var bestHorse = "";
	var bestHorseScore = 0;
	for (var i in q1Storage.horse_G){
		let score = q1Storage.horse_G [i]
		if (score > bestHorseScore){
			bestHorseScore = score;
			bestHorse = i;
		}
	}

	console.log (bestHorseScore);

	var bestJockey = "";
	var bestJockeyScore = 0;
	for (var i in q1Storage.jockey_G){
		let score = q1Storage.jockey_G [i]
		if (score > bestJockeyScore){
			bestJockeyScore = score;
			bestJockey = i;
		}
	}

	console.log (bestJockeyScore);

	var bestTrainer = "";
	var bestTrainerScore = 0;
	for (var i in q1Storage.trainer_G){
		let score = q1Storage.trainer_G [i]
		if (score > bestTrainerScore){
			bestTrainerScore = score;
			bestTrainer = i;
		}
	}

	console.log (bestTrainerScore);

	res ["q1"] = {
		horse: bestHorse,
		jockey: bestJockey,
		trainer: bestTrainer
	};


//  ------------------ Q2 Post Processing -------------------

	var bestCombo = "";
	var bestComboScore = 0;
	for (var i in q2Storage){
		let score = q2Storage [i]
		if (score > bestComboScore){
			bestComboScore = score;
			bestCombo = i;
		}
	}

	bestComboArr = bestCombo.split (",");
	res ["q2"] = {
		horse: bestComboArr [0],
		jockey: bestComboArr [1],
		trainer: bestComboArr [2]
	};

	res ["q3"] = {};

	return res;

//  ------------------ Q3 Pre Processing -------------------

	// for (var i in jockeyDict)
	// {
	// 	console.log (i + ":" + jockeyDict[i] + ";");
	// }


	// for (var i in jockeyRevDict)
	// {
	// 	console.log (i + ":" + jockeyRevDict[i] + ";");
	// }

	var keys = []
	for (var raceno in q3Storage.raceno_G){
		keys.push (raceno);
	}

	function compareItem (a, b){
		let a_year = parseInt(a.substring (0, 4));
		let b_year = parseInt(b.substring (0, 4));
		if (a_year != b_year){
			return a_year - b_year;
		}

		let a_month = parseInt(a.substring (5, 7));
		let b_month = parseInt(b.substring (5, 7));
		if (a_month != b_month){
			return a_month - b_month;
		}

		let a_day = parseInt(a.substring (8, 10));
		let b_day = parseInt(b.substring (8, 10));
		if (a_day != b_day){
			return a_day - b_day;
		}

		let a_matchno = parseInt (a.substring (11));
		let b_matchno = parseInt (b.substring (11));
		return a_matchno - b_matchno;
	}

	keys.sort (compareItem);
	// for (var i in keys){
	// 	console.log (i + ":" + keys[i]);
	// }

	// console.log (data.length);
	// console.log (keys.length);

	// for (var i in keys)
	// {
	// 	raceno = keys [i];
	// 	q3Storage.raceno_G [raceno];
	// 	for (var rank in q3Storage.raceno_G [raceno]){
	// 		console.log (raceno + "/" + rank + "/" + q3Storage.raceno_G [raceno][rank]);
	// 	}
	// 	// console.log (i + ":" + s + ";");
	// }

	var counter = 0;
	var candidates = {};
	for (var i = 0; i < keys.length; i++){
		raceno = keys [i];
		candidates [raceno] = [];
		for (var j = minPlacing; j <= maxPlacing; j++){
			if (j in q3Storage.raceno_G [raceno]){
				candidates[raceno].push (j + ":" + q3Storage.raceno_G [raceno][j]);
				counter ++;
			}
		}
	}
	console.log (minPlacing);
	console.log (maxPlacing);
	console.log ("235" + ":" + counter);




//  ------------------ Q3 Post Processing -------------------

	// console.log (keys.length);
	var candidates = {};
	// var counter = 0;
	for (var i = 0; i < keys.length; i++){
		// counter ++;
		raceno = keys [i];
		candidates [raceno] = [];
		for (var j = minPlacing; j < maxPlacing - 2; j++){
			if (j in q3Storage.raceno_G [raceno] && j+1 in q3Storage.raceno_G [raceno] && j+2 in q3Storage.raceno_G [raceno]){
				
				for (var counter1 in q3Storage.raceno_G [raceno][j]){
					for (var counter2 in q3Storage.raceno_G [raceno][j + 1]){
						for (var counter3 in q3Storage.raceno_G [raceno][j + 2]){
							var cand = q3Storage.raceno_G [raceno][j][counter1] + "," + q3Storage.raceno_G [raceno][j + 1][counter2] + "," +q3Storage.raceno_G [raceno][j + 2][counter3];
							candidates [raceno].push (cand);
						}
					}
				}
			}
		}
	}

	var counter = 0;
	for (var i in candidates){
		for (var j in candidates [i]){
			counter ++;

		}
	}


	console.log ("289: ", counter);

	// console.log (counter);
	// var counter = 0;
	// for (var i in candidates){
	// 	counter ++;
	// } 
	// console.log (counter);

	// return candidates;

	// tempk = "2017-12-06:1";
	// for (var i in q3Storage.raceno_G [tempk]){
	// 	console.log (q3Storage.raceno_G [tempk][i]);
	// }

	// tempk = "2018-12-06:2";
	// for (var i in q3Storage.raceno_G [tempk]){
	// 	console.log (q3Storage.raceno_G [tempk][i]);
	// }
	
	// tempk = "2019-12-06:1";
	// for (var i in q3Storage.raceno_G [tempk]){
	// 	console.log (q3Storage.raceno_G [tempk][i]);
	// }

	//stage 1 completed

	for (var i = 0; i < keys.length-1; i++){
		raceno = keys [i];
		var cand1 = candidates [raceno];
		var cand2 = candidates [keys [i + 1]];
		var tempCand = []

		for (var j = 0; j < cand1.length; j++){
			for (var k = 0; k < cand2.length; k++){
				if (cand1 [j] ==  cand2[k]) {
					tempCand.push (cand1 [j]);
				}
			}
		}

		candidates [raceno] = tempCand;
	}

	delete candidates [keys [keys.length-1]];

	// return candidates;
	//stage 2 completed

	for (var i = 0; i < keys.length-2; i++){
		raceno = keys [i];
		var cand1 = candidates [raceno];
		var cand2 = candidates [keys [i + 1]];
		var tempCand = []

		for (var j = 0; j < cand1.length; j++){
			for (var k = 0; k < cand2.length; k++){
				if (cand1 [j] ==  cand2[k]) {
					tempCand.push (cand1 [j]);
				}
			}
		}

		candidates [raceno] = tempCand;
	}

	delete candidates [keys [keys.length-2]];
	console.log (keys [keys.length-2]);

	// stage 3 completed

	res ["q3"] = [];
	for (var i = 0; i < keys.length - 2; i++){
		raceno = keys[i];
		var obj = {};
		if (candidates [raceno].length != 0){
			for (var j = 0; j < candidates [raceno].length; j++){

				var s = candidates [raceno][j];
				console.log (s);
				var arr = s.split (",");
				console.log (arr.toString ());
				var temparr = [];

				for (k in arr){
					temparr.push (jockeyRevDict [arr[k]]);
				}
				console.log (temparr.toString ());

				obj ["jockeys"] = temparr;

				temparr = [];
				temparr.push (raceno);
				console.log ("325" + keys [i+1]);
				temparr.push (keys [i+1]);
				console.log ("327" + keys [i+2]);
				temparr.push (keys [i+2]);

				obj ["races"] = temparr;
			}

			res ["q3"].push (obj);
		}
	}

	for (var i in res["q3"]){
		var obj = res["q3"][i];
		console.log ("jockeys");
		console.log (obj["jockeys"].toString());
		console.log ("races");
		console.log (obj["races"].toString());

	}

	return res;
};