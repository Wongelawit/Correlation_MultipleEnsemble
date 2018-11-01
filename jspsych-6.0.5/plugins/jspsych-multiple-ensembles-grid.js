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
      distribution_sizes: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Distractor number',
        array: true,
        default: [10, 1],
        description: 'Array specifying target and distractor distribution sizes.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = plugin.generate_stimulus(trial.stimuli, trial.grid_size, trial.distribution_sizes);

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.innerHTML = '';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  plugin.generate_stimulus = function(stimuli, grid_size, distribution_size) {

    let rows = grid_size[0];
    let columns = grid_size[1];

    let distractor = stimuli[0];
    let target = stimuli[1];

    let distractor_number = distribution_size[0];
    let target_number = distribution_size[1];

    // Extract img dimensions so can force empty boxes to be of same height/width
    let img = new Image();
    img.src = distractor;
    let item_width = img.width;
    let item_height = img.height;

    let distractor_html = '<div class="grid-item"><img src = "' + distractor + '"</img></div>';
    let target_html     = '<div class="grid-item""><img src = "' + target + '"</img></div>';
    let empty_item_html = `<div class="grid-item" style="height: ${item_height}px; width: ${item_width}px""></div>`;

    let html = 
    `<div class='grid-container' style = 'grid-template-columns: repeat(${columns}, minMax(10px, 1fr));` +
    ` grid-template-rows: repeat("${rows}"}, minMax(10px, 1fr));'>`;

    let target_coordinates = generate_coordinates(rows, columns, target_number, null);
    let distractor_coordinates = generate_coordinates(rows, columns, distractor_number, target_coordinates);

    for (let r = 0; r < rows; r++){
      for (let c = 0; c < columns; c++){

        let curr_coord = JSON.stringify([r, c]);

        if (distractor_coordinates.includes(curr_coord)) {
          html += distractor_html;
        } else if (target_coordinates.includes(curr_coord)) {
          html += target_html;
        } else {
          html += empty_item_html;
        }

      }
    }

    return html;

  };

  /**
   * Generates random coordinate given row and column values.
   *
   * @param  row                  {int}
   *         col                  {int}
   *
   * @return [row, col] (JSON stringified so can do object comparisons)        
   */ 
  function generate_random_coordinate(row, col) {

    let x = get_random_int(row);
    let y = get_random_int(col);

    return JSON.stringify([x, y]);
  }

  /**
   * Generates a random population, that can exclude a coordinate set if desired.
   *
   * @param  row                   {int}
   *         col                   {int}
   *         size                  {int}
   *         excluding_coordinates {array of coordinates to exclude}
   *                               Set this to null if do not want to exclude anything
   *
   * @return coordinates          [ [x1, y1], [x2, y2] ... ]         
   */ 
  function generate_coordinates(row, col, size, excluding_coordinates) {

    let coordinates = [];

    while (coordinates.length < size) {
      let coord = generate_random_coordinate(row, col);

      if (!coordinates.includes(coord)){
        if (excluding_coordinates === null){
          coordinates.push(coord);
        } else if (!excluding_coordinates.includes(coord)) {
          coordinates.push(coord);
        }
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
