/**
  * Generates jsPsych trial object using multiple-ensembles-grid object.
  * Creates a grid of specified dimension and will display target population
  * among a distractor population. 
  *
  * @param  distractor_path           {string} Path to img of distractor
  *         target_path               {string} Path to img of target
  *         duration                  {int}    Time in ms for grid to display
  *         grid_dimension            {int}    Dimension of the grid
  *         distractor_size           {int}    Size of the distractor population
  *         target_size               {int}    Size of the target population
  *
  * @return jsPsych trial object      
*/ 
function generate_grid_object (distractor_path, target_path, duration, grid_dimension, distractor_size, target_size){

  return {
      type: 'multiple-ensembles-grid',
      trial_duration: duration,
      grid_size: [grid_dimension, grid_dimension],
      distribution_sizes: [distractor_size, target_size],
      stimuli: [distractor_path, target_path]
  };
}
