exports.result = function (input){
	
	res = {};
	
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

	msg = ""

	data = input.data;
	// data = input;

	for (var i in data){
		entry = data[i];

		place = parseInt (entry.Placing);
		horse = entry.Horse;
		jockey = entry.jockeycode;
		trainer = entry.Trainer;
		raceno = entry.raceno;
		combo = horse + "," + jockey + "," + trainer;

		switch (place){

			case 1:
				q1Storage.horse_G [horse] = (horse in q1Storage.horse_G ? q1Storage.horse_G [horse] + 1 : 1);
				q1Storage.jockey_G [jockey] = (jockey in q1Storage.jockey_G ? q1Storage.jockey_G [jockey] + 1 : 1);
				q1Storage.trainer_G [trainer] = (trainer in q1Storage.trainer_G ? q1Storage.trainer_G [trainer] + 1 : 1);

				q2Storage [combo] = (combo in q2Storage ? q2Storage [combo] + 7 : 7);
				break;

			case 2:
				q2Storage [combo] = combo in q2Storage ? q2Storage [combo] + 3 : 3;
				break;

			case 3:
				q2Storage [combo] = (combo in q2Storage ? q2Storage [combo] + 1 : 1);
				break;

		}

		q3Storage.raceno_G [raceno] = (horse in q3Storage.raceno_G ? q3Storage.raceno_G [raceno] + 1 : 1);	
		q3Storage.jockey_G [jockey] = (horse in q3Storage.jockey_G ? q3Storage.jockey_G [jockey] + 1 : 1);	
	}

//  ------------------ Q1 Post Processing -------------------

	var bestHorse = "";
	var bestHorseScore = 0;
	for (var i in q1Storage.horse_G){
		let score = q1Storage.horse_G [i]
		if (score > bestHorseScore){
			bestHorseScore = score;
			bestHorse = i;
		}
	}

	var bestJockey = "";
	var bestJockeyScore = 0;
	for (var i in q1Storage.jockey_G){
		let score = q1Storage.jockey_G [i]
		if (score > bestJockeyScore){
			bestJockeyScore = score;
			bestJockey = i;
		}
	}

	var bestTrainer = "";
	var bestTrainerScore = 0;
	for (var i in q1Storage.trainer_G){
		let score = q1Storage.trainer_G [i]
		if (score > bestTrainerScore){
			bestTrainerScore = score;
			bestTrainer = i;
		}
	}

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

//  ------------------ Q3 Post Processing -------------------

	jockeyCount = 0;
	raceCount = 0;

	for (var i in q3Storage.jockey_G){
		jockeyCount ++;
	}
	for (var i in q3Storage.raceno_G){
		raceCount ++;
	}

	console.log (jockeyCount + " " + raceCount);
	console.log (q3Storage.jockey_G.toString());

	res ["msg"] = msg;

	return res;
};