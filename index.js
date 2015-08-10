function createBox(sx, sy, sz) {
    if (sx === undefined) sx = 1.0;
    if (sy === undefined) sy = sx;
    if (sz === undefined) sz = sx;

    var x = sx / 2;
    var y = sy / 2;
    var z = sz / 2;

    var positions = [
        //+z
        [-x, y, z],
        [-x,-y, z],
        [ x,-y, z],
        [ x, y, z],

        //-z
        [ x, y,-z],
        [ x,-y,-z],
        [-x,-y,-z],
        [-x, y,-z]

    ];

    var cells = [
        [ 0, 1, 2, 3], //+z
        [ 3, 2, 5, 4], //+x
        [ 4, 5, 6, 7], //-z
        [ 7, 6, 1, 0], //-x
        [ 7, 0, 3, 4], //+y
        [ 1, 6, 5, 2]  //-y
    ]

    return {
        positions: positions,
        cells: cells
    }
}

module.exports = createBox;
