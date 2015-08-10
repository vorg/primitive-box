var Window       = require('pex-sys/Window');
var Mat4         = require('pex-math/Mat4');
var Vec3         = require('pex-math/Vec3');
var glslify      = require('glslify-promise');
var triangulate  = require('geom-triangulate');
var computeEdges = require('geom-edges');
var createBox    = require('../index.js');

Window.create({
    settings: {
        width: 1024,
        height: 576
    },
    resources: {
        vert: { glsl: glslify(__dirname + '/Material.vert') },
        frag: { glsl: glslify(__dirname + '/Material.frag') }
    },
    init: function() {
        var ctx = this.getContext();

        this.model = Mat4.create();

        this.projection = Mat4.perspective(
            Mat4.create(),
            45,
            this.getAspectRatio(),
            0.001,
            10.0
        );

        this.view = Mat4.create();

        Mat4.lookAt(this.view, [0, 1, 3], [0, 0, 0], [0, 1, 0]);

        ctx.setProjectionMatrix(this.projection);
        ctx.setViewMatrix(this.view);
        ctx.setModelMatrix(this.model);

        var res = this.getResources();

        this.program = ctx.createProgram(res.vert, res.frag);

        var g = createBox();
        var attributes = [
            { data: g.positions, location: ctx.ATTRIB_POSITION },
        ];
        var indices = { data: triangulate(g.cells) };
        this.mesh = ctx.createMesh(attributes, indices, ctx.TRIANGLES);

        var edgeIndices = { data: computeEdges(g.cells) };

        this.meshEdges = ctx.createMesh(attributes, edgeIndices, ctx.LINES);
    },

    draw: function() {
        var ctx = this.getContext();
        ctx.setClearColor(1, 1, 1, 1);
        ctx.clear(ctx.COLOR_BIT | ctx.DEPTH_BIT);
        ctx.setDepthTest(true);

        ctx.setCullFace(true);

        ctx.bindTexture(this.tex, 0);
        ctx.bindProgram(this.program);

        Mat4.rotate(this.model, Math.PI/100, [0, 1, 0]);
        ctx.setModelMatrix(this.model);

        this.program.setUniform('uColor', [0.8, 0.8, 0.8, 1.0]);
        ctx.bindMesh(this.mesh);
        ctx.drawMesh();

        ctx.setLineWidth(2);
        this.program.setUniform('uColor', [0.0, 0.0, 0.0, 1.0]);
        ctx.bindMesh(this.meshEdges);
        ctx.drawMesh();
    }
})
