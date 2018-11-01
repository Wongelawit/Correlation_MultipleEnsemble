# Correlation: Multiple Ensemble

## Plugin: multiple-ensembles-grid

### Parameters
- *choices:* {array of valid keyboard input} i.e ['m', 'z']
- *trial_duration:* {int or null}
   - if null, trial will never end unless response_ends_trial = true
   - otherwise duration is {x} ms
- *grid_size:* {array of grid dimensions, in order of row, col} i.e [72, 72]
- *distribution_sizes:* {array of size of distributions, in order of distractor size, then target size} i.e [20, 15]
- *stimuli:* {array of img path to distractor and target images} i.e ['stimuli/blue.svg', 'stimuli/red.svg']
- *response_ends_trial* {boolean}
   - if true, keyboard response will end trial 
   - if false, trial ends depending on what was specified in trial_duration
   
### Example
This example will display a 72 x 72 grid, with 20 blue distractors and 15 red targets.
It will ONLY end when there is keyboard input, otherwise trial duration is indefinite.

```javascript
    let stimuli_with_keyboard_input = {
      type: 'multiple-ensembles-grid',
      choices: ['z', 'm'],
      trial_duration: null,
      grid_size: [72, 72],
      distribution_sizes: [20, 15],
      stimuli: ['stimuli/blue.svg', 'stimuli/red.svg'],
      response_ends_trial: true
    }
```    
    
    

