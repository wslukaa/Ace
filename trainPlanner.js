module.exports = function(req, res, next) {
	// Input variables
	var stations = req.body.stations;
	var destination = req.body.destination;

	// Error checking

	// Helper functions
	// look up the station in the stations list
	stations.getStationByName = (name) => stations.find((station) => (station.name == name));

	stations.pathSearch = (source, destination, visited = []) => {
		if(source == destination) {
			return visited;
		} else {
			// Only consider unvisited station
			const connections = stations.getStationByName(source).connections.filter((connection) => visited.indexOf(connection.station) == -1);
			const routes = connections.map((connection) => stations.pathSearch(connection.station, destination, [].concat(visited, [source]))).filter((route) => route.length != 0);
			console.log(source, destination, routes);

			// choose the shortest path
			if(routes.length == 0) {
				return [];
			} else {
				return routes.reduce((acc, cur) => cur.length < acc.length ? cur : acc);
			}
		}
	}


	// Initialize passengers on train count
	stations.forEach((station) => {
		station.totalNumOfPassengers = 0;
	});

	// Accumulate passengers on train
	stations.forEach((station) => {
		if(station.name != req.body.destination) {
			stations.pathSearch(station.name, destination).forEach((stop) => {
				stations.getStationByName(stop).totalNumOfPassengers += station.passengers;
			});
		}
	})

	// Look up the connections and find the previous station with the most people on train
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

};

