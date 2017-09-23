
  var express = require('express');
  var router = express.Router();

  router.post('/trainPlanner', function(req, res, next) {
  	// Input variables
  	var stations = req.body.stations;
  	var destination = req.body.destination;

  	// Error checking

  	// TODO: Return the shortest path from source to destination
  	stations.pathSearch = (source, destination) => {
  		return [];
  	}

  	stations.getStationByName = (name) => stations.find((station) => (station.name == name));

  	// Initialize passengers on train count
  	stations.forEach((station) => {
  		station.totalNumOfPassengers = 0;
  	});

  	// Accumulate passengers on train
  	stations.forEach((station) => {
  		if(station.name != req.body.destination) {
  			stations.pathSearch(station, destination).forEach((stop) => {
  				stop.totalNumOfPassengers += station.passengers;
  			});
  		}
  	})

  	// Look up the connections in destination
  	var busiestConnection = undefined;

  	stations.getStationByName(destination).connections.forEach((connection) => {
  		const previousStation = stations.getStationByName(connection.station);
  		if(busiestConnection == undefined || previousStation.totalNumOfPassengers > busiestConnection.totalNumOfPassengers) {
  			busiestConnection = connection;
  			busiestConnection.totalNumOfPassengers = previousStation.totalNumOfPassengers;
  		}
  	});

  	// Return the result
  	var response = {
  		line: busiestConnection.line,
  		totalNumOfPassengers: busiestConnection.totalNumOfPassengers,
  		reachingVia: busiestConnection.station
  	};

  	res.send(response);

  });

  module.exports = router;