function generate_stimulus(stimuli, distribution_size) {

    let rows = 36;
    let columns = 36;

    let target = stimuli[0];
    let distractor = stimuli[1];

    let target_number = distribution_size[0];
    let distractor_number = distribution_size[1];

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

    let distractor_coordinates = [];

    let target_coordinates = generate_coordinates(rows, columns, target_number, null);
    if (distractor_number != 0) {
        distractor_coordinates = generate_coordinates(rows, columns, distractor_number, target_coordinates);
    }

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