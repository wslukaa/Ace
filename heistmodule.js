exports.grab = function (loot){

	var totalWeight = loot.maxWeight;
	var vault = loot.vault;
	var totalValue = 0.0;

	function compareItem (a, b){
		return b.value/b.weight - a.value/a.weight;
	}

	vault.sort (compareItem);
	for (var i in vault){

		var item = vault[i];

		if (totalWeight > item.weight){
			totalValue += item.value;
			totalWeight -= item.weight;
		}
		else {
			totalValue += item.value * totalWeight / item.weight;
			break;
		}
	}

	return ({
		heist: totalValue
	});
};