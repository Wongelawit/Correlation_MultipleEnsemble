const PATH = "stimuli/";
const COLORS = ["BLUE", "GREEN", "RED", "YELLOW"];
const DIMENSIONS = ["LUM", "CHR", "HUE"];
const OPPOSITE_COLORS = {"BLUE":"YELLOW", "YELLOW":"BLUE", "GREEN":"RED", "RED":"GREEN"};
const DISTANCES = ["-2", "-1", "+1", "+2"];

/* Returns object containing target path and array of paths for all possible distractors given a color and dimension.
 * For example, get_subconditions("BLUE", "LUM") will return paths to:
 * - opposite target of same dimension: YELLOW_LUM
 * - all possible targets from other dimensions: BLUE_LUM_-2, BLUE_LUM_-1 ... BLUE_HUE+1, BLUE_HUE+2
 *	
 * @ param color 			{string} "BLUE", "GREEN", "RED", "YELLOW"
 * @ param dimension 		{string} "LUM", "CHR", "HUE"
 *
 * @ return 				{ {"target": "target path", "distractors": ["distractor path 1", "distractor path 2" ... ]} }
 */
function get_subconditions(color, dimension){

	if (!COLORS.includes(color)){
		throw Error(color + " is not supported.")
	} else if (!DIMENSIONS.includes(dimension)){
		throw Error(dimension + " is not supported.")
	}

	// Get target path
	let target_path = construct_path(color, dimension, null);

	let paths = [];
	
	// Push opposite color w/ same dimension
	paths.push(get_opposite_target(color, dimension));
	
	// Push all other targets
	for (let dimension of DIMENSIONS){
		for (let distance of DISTANCES){
			paths.push(construct_path(color, dimension, distance));
		}
	}

	return {"target": target_path, "distractors": paths};
	
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