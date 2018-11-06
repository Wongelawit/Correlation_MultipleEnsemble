const PATH = "stimuli/";
const COLORS = ["BLUE", "GREEN", "RED", "YELLOW"];
const DIMENSIONS = ["LUM", "CHR", "HUE"];
const OPPOSITE_COLORS = {"BLUE":"YELLOW", "YELLOW":"BLUE", "GREEN":"RED", "RED":"GREEN"};
const DISTANCES = ["-2", "-1", "+1", "+2"];
const SET_SIZES = [8, 16, 32];

/* Returns array of all subconditions for a given color. 
 * Length 234 in total (78 x 3).
 *	
 * @ param color 			{string} "BLUE", "GREEN", "RED", "YELLOW"
 *
 * @ return 				{array}  array contain assoc array of subcondition constants
 */
function get_subconditions(color) {

	let subconditions = [];

	for (let dimension of DIMENSIONS){
        subconditions = subconditions.concat(get_subcondition_set(color, dimension));  
    }
    
    return subconditions;
}

/* Returns array of all subconditions for a given color and dimension.
 * For example, get_subcondition_set("BLUE", "LUM") will subconditions for:
 * - opposite target of same dimension: YELLOW_LUM
 * - all possible targets from other dimensions: BLUE_LUM_-2, BLUE_LUM_-1 ... BLUE_HUE+1, BLUE_HUE+2
 * That gives 13 possible subconditions. X 3 for each set size, gives 39. 
 * To take into account target present/not present, X 2 for boolean, gives 78.
 *	
 * @ param color 			{string} "BLUE", "GREEN", "RED", "YELLOW"
 * @ param dimension 		{string} "LUM", "CHR", "HUE"
 *
 * @ return 				{array}  array contain assoc array of subcondition constants
 */
function get_subcondition_set(color, dimension){

	let subconditions = [];

	if (!COLORS.includes(color)){
		throw Error(color + " is not supported.")
	} else if (!DIMENSIONS.includes(dimension)){
		throw Error(dimension + " is not supported.")
	}

	// Get target path
	let target_path = construct_path(color, dimension, null);
	
	// Get opposite color w/ same dimension
	let opposite_path = get_opposite_target(color, dimension);

	// Push for each set size
	for (let size of SET_SIZES){
		subconditions = subconditions.concat(construct_subcondition(target_path, opposite_path, size));
	}

	// Push all other targets
	for (let size of SET_SIZES){
		for (let dimension of DIMENSIONS){
			for (let distance of DISTANCES){
				let distractor_path = construct_path(color, dimension, distance);
				subconditions = subconditions.concat(construct_subcondition(target_path, distractor_path, size));
			}
		}
	}	

	return subconditions;
}

/* Constructs path of opposite color but same dimension.
 *	
 * @ param color 			{string} "BLUE", "GREEN", "RED", "YELLOW"
 * @ param dimension 		{string} "LUM", "CHR", "HUE"
 *
 * @ return 				{string}  path to opposite color of same dimension
 */
function get_opposite_target(color, dimension){

	let opposite_color = OPPOSITE_COLORS[color];

	return construct_path(opposite_color, dimension, null);
}

/* Constructs subcondition assoc array containing target path, distractor path,
 * distractor size and whether target is present/not present.
 *	
 * @ param target 			{string} Path to target
 * @ param distractor 		{string} Path to distractor
 * @ param size 			{int}	 Size of set
 *
 * @ return 				{array}  containing 2 assoc arrays, one for target present, one for target false
 */
function construct_subcondition(target, distractor, size){
	return [ {"target": target, "distractor": distractor, "size": size, "target_present": true},
			 {"target": target, "distractor": distractor, "size": size, "target_present": false}];
}

/* Constructs path to the svg.
 *	
 * @ param color 			{string} "BLUE", "GREEN", "RED", "YELLOW"
 * @ param dimension 		{string} "LUM", "CHR", "HUE"
 * @ param distance			{string} "-2", "-1", "+1", "+2"
 *
 * @ return 				{string}  path to the svg
 */
function construct_path(color, dimension, distance){

	let path = "stimuli/" + color + "/" + color + "_" + dimension;

	if (distance){
		return path + distance + ".svg";
	}

	return path + ".svg";
}
