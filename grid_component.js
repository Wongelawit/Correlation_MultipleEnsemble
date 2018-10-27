/**
  * Generates jsPsych trial object using multiple-ensembles-grid object.
  * Creates a grid of specified dimension and will display one target
  * among a distractor population. 
  *
  * @param  distractor           {string} Path to img of distractor
  *     target                   {string} Path to img of target
  *     duration                 {int}    Time in ms for grid to display
  *     grid_dimension           {int}    Dimension of the grid
  *     distractor_size          {int}    Size of the distractor population
  *
  * @return jsPsych trial object      
*/ 
function generate_grid_object (distractor, target, duration, grid_dimension, distractor_size){

  let stimuli_set = [distractor, target];

  return {
      type: 'multiple-ensembles-grid',
        trial_duration: duration,
        grid_size: [grid_dimension, grid_dimension],
        distractor_number: distractor_size,
      stimuli: stimuli_set
  };
}
