/**
 * jsPsych plugin for generating a grid of specified size, stimuli, and 
 * distractor number.
 *
 *
 * Caitlin Coyiuto
 */

jsPsych.plugins['multiple-ensembles-grid'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('multiple-ensembles-grid', 'stimuli', 'image');

  plugin.info = {
    name: 'multiple-ensembles-grid',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimuli',
        array: true,
        default: undefined,
        description: 'An array that defines the stimuli.'
      },
      grid_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Grid size',
        array: true,
        default: [10,10],
        description: 'Array specifying the row and columns of the grid.'
      },
      distractor_number: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Distractor number',
        array: true,
        default: 10,
        description: 'Number specifying number of distractors in grid.'
      },
        target_number: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Target number',
            array: true,
            default: 10,
            description: 'Number specifying number of targets in grid.'
        },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 1000,
        description: 'How long to show the stimulus for in milliseconds.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = plugin.generate_stimulus(trial.stimuli, trial.grid_size, trial.distractor_number);

    jsPsych.pluginAPI.setTimeout(function() {
      //endTrial();                               // !!! Uncomment this to enable trial_duration
    }, trial.trial_duration);

    function endTrial() {

      display_element.innerHTML = '';

      var trial_data = {
        "stimulus": JSON.stringify(trial.stimuli)
      };

      jsPsych.finishTrial(trial_data);
    }
  };


  plugin.generate_stimulus = function(stimuli, grid_size, distractor_number,target_number) {

    let rows = grid_size[0];
    let columns = grid_size[1];

    let distractor = stimuli[0];
    let target = stimuli[1];

    let item_height = window.innerWidth/100;
    let item_width = window.innerHeight/100;

    let distractor_html = '<div class="grid-item" style="height: 100%; width: 100%""><img src = "' + distractor + '"</img></div>';
    let target_html     = '<div class="grid-item" style="height: 100%; width: 100%""><img src = "' + target + '"</img></div>';
    let empty_item_html = `<div class="grid-item" style="height: ${item_height}px; width: ${item_width}px""></div>`;

    let html = 
    `<div class='grid-container' style = 'grid-template-columns: repeat(${columns}, minMax(10px, 1fr));` +
    ` grid-template-rows: repeat("${rows}"}, minMax(10px, 1fr));'>`;

    let target_coordinate = generate_target_coordinates(rows, columns, target_number)
    let distractor_coordinates = generate_coordinates(rows, columns, distractor_number, target_coordinate);

    for (let r = 0; r < rows; r++){
      for (let c = 0; c < columns; c++){

        let curr_coord = JSON.stringify([r, c]);

        if (distractor_coordinates.includes(curr_coord)) {
          html += distractor_html;
        } else if (curr_coord == target_coordinate) {
          html += target_html;
        } else {
          html += empty_item_html;
        }

      }
    }

    return html;

  };

  // /**
  //  * Generates random coordinate given row and column values.
  //  *
  //  * @param  row                  {int}
  //  *         col                  {int}
  //  *
  //  * @return [row, col] (JSON stringified so can do object comparisons)
  //  */
  // function generate_random_coordinate(row, col) {
  //
  //   let x = get_random_int(row);
  //   let y = get_random_int(col);
  //
  //   return JSON.stringify([x, y]);
  // }

  /**
   * Generates a random population that excludes a coordinate.
   *
   * @param  row                  {int}
   *         col                  {int}
   *         size                 {int}
   *         excluding_coordinate [row, col]
   *
   * @return coordinates          [ [x1, y1], [x2, y2] ... ]
   */
  function generate_coordinates(row, col, size, excluding_coordinate) {

    let coordinates = [];

    while (coordinates.length < size) {
      let coord = generate_random_coordinate(row, col);

      if (!coordinates.includes(coord) && !excluding_coordinate.includes(coord)){
        coordinates.push(coord);
      }
    }

    return coordinates;
  }

    function generate_target_coordinates(row, col, size) {

        let coordinates = [];

        while (coordinates.length < size) {
            let coord = generate_random_coordinate(row, col);

            if (!coordinates.includes(coord)){
                coordinates.push(coord);
            }
        }

        return coordinates;
    }

  /**
   * Generates random integer given max value.
   *
   * @param  max                   {int}
   * @return integer     
   */ 
  function get_random_int(max) {
      return Math.floor(Math.random() * Math.floor(max));
  }

  return plugin;
})();
