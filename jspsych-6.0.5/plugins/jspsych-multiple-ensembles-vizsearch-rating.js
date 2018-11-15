/**
 * jsPsych plugin for generating a grid of specified size, stimuli, and 
 * distractor number.
 *
 *
 * Caitlin Coyiuto
 */

jsPsych.plugins['multiple-ensembles-vizsearch-rating'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('multiple-ensembles-vizsearch-rating', 'stimuli', 'image');

  plugin.info = {
    name: 'multiple-ensembles-vizsearch-rating',
    description: '',
    parameters: {
      letter_mapping: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Letter Mapping',
        default: [],
        description: 'Array of {letter : color_path}.'
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

    var new_html = plugin.generate_stimulus(trial.letter_mapping);

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

  plugin.generate_stimulus = function(letter_mapping) {

    const ROWS = 7;
    const COLUMNS = 7;
    const ITEM_SIZE = 40;

    const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
    const CIRCLE_COORDINATES = [[0,2], [1,1], [2,0], [3,0], [4,1], [5,2], [6,3], [5,4], [4,5], [3,6], [2,6], [1,5], [0,4]];
    let JSONFIED_CIRCLE_COORDINATES = [];
    let LETTER_TO_COORDINATE_MAPPING = {};

    for (let letter of LETTERS) {
      let coord = JSON.stringify(CIRCLE_COORDINATES.pop());

      LETTER_TO_COORDINATE_MAPPING[letter] = coord;
      JSONFIED_CIRCLE_COORDINATES.push(coord);
    }

    let empty_item_html = `<div class="grid-item" style="margin: 10px; height: ${ITEM_SIZE}px; width: ${ITEM_SIZE}px""></div>`;

    let html = 
    `<div class='grid-container' style = 'grid-template-columns: repeat(${COLUMNS}, minMax(10px, 1fr));` +
    ` grid-template-rows: repeat("${ROWS}"}, minMax(10px, 1fr));'>`;

    for (let r = 0; r < ROWS; r++){
      for (let c = 0; c < COLUMNS; c++){

        let curr_coord = JSON.stringify([r, c]);

        if (JSONFIED_CIRCLE_COORDINATES.includes(curr_coord)) {
          let letter = get_key_by_value(LETTER_TO_COORDINATE_MAPPING, curr_coord);
          let path = letter_mapping[letter];

          html += get_target_html(ITEM_SIZE, letter, path);
        } else {
          html += empty_item_html;
        }

      }
    }

    return html;

  };

  function get_target_html (item_size, letter, target_path) {
    return `<div class="grid-item"">`+ letter + `<img style="margin-bottom:10px; height: ${item_size}px; width: ${item_size}px" src = "` + target_path + '"</img></div>';
  }

  function get_key_by_value(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  return plugin;
})();
