/*This file contains helper functions
*/
// weightedRand: return random number based on input distribution
// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function weightedRand(spec) {
	var i, j, table = [];
	// creating a table(array) of numbers of a distribution list
	// e.g. [1, 1, 2, 3] : 1 has 50%, 2 and 3 each has 25% of being chosen
	for (i in spec) {
		// constant 100(or 10) is used here to compute the correct table size out of 100(or 10)
		for (j = 0; j < spec[i] * 10; j++) {
			table.push(i);
		}
	}
	//console.log("logging table");
	//console.log(table);

	return function() {
		return table[Math.floor(Math.random() * table.length)];
	}
}


// get2DSubarray: return the subarray from data based on input params
// data: 2D array
// start_h, end_h: start and end height location of the subarray
// start_w, end_w: start and end width location of the subarray
function get2DSubarray(data, start_h, end_h, start_w, end_w) {
    var result = [];
    // takes in a 2D array, return the subarray of it based on the input params
    // start_... : inclusive
    // end_ ... : exclusive
    for (var y = start_h; y < end_h; y++) {
        result.push([])
        for (var x = start_w; x < end_w; x++) {
            result[y-start_h].push(data[y][x])
        }
    }
    return result;
}