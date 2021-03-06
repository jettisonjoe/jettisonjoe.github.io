var sketch = function (p) {
    var scale,
        seed,
        scroll = 0,
        mid = 0,
        gradient,
        stars,
        caps,
        textures,
        distributors,
        data = {},
        gui;

    p.setup = function () {
        // P5 prep.
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.imageMode(p.CORNER);
        seed = (p.random() * 4294967296)  >>> 0;
        scale = setScale();
        gradient = makeGradient();
        stars = makeStars();
        stars.rotation = 0;
        // GUI prep.
        gui = new dat.GUI( { autoPlace: false } );
        var guiElt = gui.domElement;
        // document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        data.palette = function() {
            scale = setScale();
            gradient = makeGradient();
        };
        gui.add(data,'palette').name('Change palette');
        data.city = function() {
            seed = (p.random() * 4294967296)  >>> 0;
        };
        gui.add(data,'city').name('Change city');

    };

    p.draw = function () {
        // Gradient background
        p.image(gradient, 0, 0, gradient.width, gradient.height, 0, -scroll, p.width, p.height * 4);
        p.image(gradient, 0, 0, gradient.width, gradient.height, 0, p.height * 4 - scroll, p.width, p.height * 4);
        // Set color for city maker.
        if (scroll < gradient.height/8) { mid = 0; }
        else if (scroll > gradient.height/8 && scroll < gradient.height * (3/8)) {
            mid = p.map(scroll, gradient.height/8, gradient.height * (3/8), 0, 1);
        }
        else if (scroll > gradient.height * (3/8) && scroll < gradient.height * (5/8)) { mid = 1; }
        else if (scroll > gradient.height * (5/8) && scroll < gradient.height* (7/8)) {
            mid = p.map(scroll, gradient.height * (5/8), gradient.height * (7/8), 1, 0);
        }
        else if (scroll > gradient.height * (7/8)) { mid = 0; }
        // Increment and wrap background scroll.
        scroll += 2;
        if (scroll > gradient.height) { scroll = 0; }
        // Update and draw stars.
        p.push();
        p.rotate(stars.rotation);
        p.stroke(255);
        for (var i = 0; i < stars.length; i++) {
            var v = stars[i];
            p.strokeWeight(v.size + Math.random() - 0.5);
            p.point(v.x, v.y);
        }
        stars.rotation -= 0.0003;
        p.pop();
        // Update and draw city.
        makeCity(p, seed);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        gradient = makeGradient();
        stars = makeStars();
        stars.rotation = 0;
        makeCity(p, seed);
    };

    // Returns gradient graphic.
    function makeGradient() {
        var graphic = p.createGraphics(p.width, p.height * 4),
            c = scale(0).rgb(),
            count = 0;
        for (var y = 0; y < graphic.height/4; y++) {
            graphic.stroke(c);
            graphic.line(0, y, graphic.width, y);
        }
        for (var y = graphic.height/4; y < graphic.height/2; y++) {
            c = scale( p.map(y, graphic.height/4, graphic.height/2, 0, 1) ).rgb() ;
            graphic.stroke(c);
            graphic.line(0, y, graphic.width, y);
        }
        c = scale(1).rgb();
        for (var y = graphic.height/2; y < graphic.height * (3/4); y++) {
            graphic.stroke(c);
            graphic.line(0, y, graphic.width, y);
        }
        for (var y = graphic.height * (3/4); y <= graphic.height; y++) {
            c = scale((y - graphic.height * (3/4))/(graphic.height/4)).rgb();
            graphic.stroke(c);
            graphic.line(0, graphic.height - count, graphic.width, graphic.height - count);
            count++;
        }
        return graphic;
    }

    // Draws city.
    function makeCity(graphic, randSeed) {
        p.randomSeed(seed)
        var bgDistributor = distributors.makeThirds(graphic.width),
            fgDistributor = distributors.makeHalves(graphic.width),
            bgProb = p.random(0.5, 0.85),
            fgProb = p.random(0.5, 0.85),
            bgCount= 0,
            fgCount = 0;
        graphic.push();
        // Draw distant buildings.
        graphic.fill(scale(mid + 0.15).darken(2).rgb());
        graphic.noStroke(0);
        while (bgCount < 15) {
            var x = bgDistributor();
            if (p.random() < bgProb) {
                var width = p.random(50, 100),
                    height = p.random(graphic.height/6, graphic.height * 0.4)
                    loc = p.createVector(x - width/2, graphic.height);
                graphic.rect(loc.x, loc.y - height, width, height);
                bgCount++;
            }
        }
        // Set foreground styles.
        graphic.fill(0);
        graphic.stroke(scale(mid).brighten().rgb());
        graphic.strokeWeight(2);
        textures.color = p.color(scale(mid).rgb());
        caps.stroke = p.color(scale(mid).brighten().rgb());
        caps.fill = p.color(scale(mid).rgb());
        // Draw foreground buildings.
        while (fgCount < 20) {
            var x = fgDistributor();
            if (p.random() < fgProb) {
                var width = p.random(50, 125),
                    height = p.random(graphic.height/6, graphic.height * 0.4)
                    loc = p.createVector(x - width/2, graphic.height),
                    capH = p.random() > 0.3 ? p.ceil(height * (p.random(5, 10)/100)) : 0;
                    bodyH = height - capH,
                    bodyTx = textures.index[p.floor(p.random(textures.index.length))];
                graphic.rect(loc.x, loc.y - bodyH, width, bodyH);
                bodyTx(p.createVector(loc.x, loc.y - bodyH), width, bodyH, graphic);
                if (capH > 0) {
                    capTx = caps.index[p.floor(p.random(caps.index.length))];
                    capTx(p.createVector(loc.x, loc.y - bodyH), width, capH, graphic);
                }
                fgCount++;
            }
        }
        graphic.pop();
        return graphic;
    }

    // Returns array of points within a radius.
    function makeStars() {
        var result = [],
            radius = p.max(p.width, p.height) * 2;
        for (var i = 0; i < 10000; i++) {
            var v = p.createVector(p.random(-radius, radius), p.random(-radius, radius));
            v.size = p.random(1, 5);
            result.push(v);
        }
        return result;
    }

    // Returns a chroma scale.
    function setScale() {
        var l = [chroma.random(), chroma.random(), chroma.random(), chroma.random()],
            bezInterpolator = null
            chance = p.random();
        if (chance > 0.5) {
            l.sort(function(a, b) {
              return b.get('hcl.l') - a.get('hcl.l');
            });
        } else {
            l.sort(function(a, b) {
                return a.get('hcl.l') - b.get('hcl.l');
            });
        }
        bezInterpolator = chroma.bezier([l[0], l[1], l[2], l[3]]);
        return chroma.scale(bezInterpolator).correctLightness(true).padding(0.15);
    }

    // 1-dimensional distributor module
    distributors = function() {
        var module = {};
        module.index = [];

        module.makeHalves = function(w) {
            var divisor = 2,
                xDivs = [],
                start = 0,
                sign = -1,
                j = 0,
                end = 0;
            return function () {
                var x;
                if (xDivs.length === 0) {
                    x = w/2;
                    xDivs.push(x);
                    divisor *= 2;
                } else {
                    var prev = xDivs[j],
                        space = w/divisor * sign;
                    x = prev + space;
                    xDivs.push(x);
                    if (sign > 0) { j--; }
                    sign *= -1;
                }
                if (j < end) {
                    end = xDivs.length - divisor/2;
                    start = xDivs.length - 1;
                    divisor *= 2;
                    j = start;
                }
                return x;
            };
        };
        module.index.push(module.halves);

        module.makeThirds = function(w) {
            var divisor = 3,
                xDivs = [],
                start = 0,
                end = -1,
                j = 0;
            return function() {
                var x;
                if (xDivs.length === 0) { x = w/divisor; }
                else if (j == end) { x = w - w/divisor; }
                else { x = xDivs[j] - w/divisor; }
                xDivs.push(x);
                j--;
                if (j < end) {
                    end = -1;
                    start = xDivs.length - 1;
                    j = start;
                    divisor *= 2;
                }
                return x;
            };
        };
        module.index.push(module.thirds);

        return module;
    }();

    // Cap drawing module
    caps = function() {
        var module = {};
        module.index = [];
        module.stroke = null;
        module.fill = null;

        module.rectangle = function(loc, w, h, graphic) {
            graphic.push();
            p.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.MITER);
            graphic.translate(loc.x, loc.y - h);
            graphic.rect(0, 0, w, h);
            graphic.pop();
        };
        module.index.push(module.rectangle);

        module.trapezoid = function(loc, w, h, graphic) {
            graphic.push();
            var incline = p.random(w * 0.05, w * 0.4),
                // points counterclockwise
                // left base
                x1 = loc.x,
                y1 = loc.y,
                // right base
                x2 = x1 + w,
                y2 = y1,
                // top right
                x3 = x2 - incline,
                y3 = y1 - h,
                // top left
                x4 = x1 + incline,
                y4 = y3;
            p.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            graphic.quad(x1, y1, x2, y2, x3, y3, x4, y4);
            graphic.pop();
        };
        module.index.push(module.trapezoid);

        module.triangle = function(loc, w, h, graphic) {
            graphic.push();
            p.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            var chance = p.random(),
                x1 = loc.x,
                y1 = loc.y,
                x2 = x1 + w,
                y2 = y1,
                x3 = x2, // default left corner 90
                y3 = y1 - h;
            // isos
            if (chance < 1/3) { x3 = x1 + w/2; }
            // right corner 90
            if (chance > 2/3) { x3 = x1; }
            graphic.triangle(x1, y1, x2, y2, x3, y3);
            graphic.pop();
        };
        module.index.push(module.triangle);

        module.dome = function(loc, w, h, graphic) {
            graphic.push();
            p.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            var x = loc.x + w/2,
                y = loc.y;
            graphic.arc(x, y, w, h, p.PI, 0, p.CHORD);
            graphic.pop();
        };
        module.index.push(module.dome);

        return module;
    }();

    // Texture drawing module
    textures = function(){
        var module = {};
        module.index = [];
        module.color = null;

        function makeGrid(rows, cols, width, height) {
            var grid = {
                grid: [],
                rows: rows,
                cols: cols,
                width: width,
                height: height,
                cellWidth: width/cols,
                cellHeight: height/rows,
                },
                y = 0;
            for (var r = 0; r < rows; r++) {
                var x = 0;
                for (var c = 0; c < cols; c++) {
                    grid.grid.push(p.createVector(x, y));
                    x += width/cols;
                }
            y += height/rows;
            }
            return grid;
        }

        module.colsOfHLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = p.round(p.random(25, 50)),
                cols = p.round(p.random(3, 8));
            var margin = p.createVector(2, 2),
                padding = p.createVector(
                        p.random(2, (w - 2 * margin.x)/cols * 0.25), 0);
            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2*margin.x - 2*padding.x,
                                h - 2*margin.y - 2*padding.y);
            var offset = p5.Vector.add(loc, margin);
            offset.add(padding);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x + padding.x,
                             cell.y + grid.cellHeight/2,
                             cell.x + grid.cellWidth - padding.x,
                             cell.y + grid.cellHeight/2);
            }
            graphic.pop();
        };
        module.index.push(module.colsOfHLines);

        module.rowsOfVLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = p.round(p.random(3, 10)),
                cols = p.round(p.random(10, 30));
            var margin = p.createVector(2, 2),
                padding = p.createVector(
                        0, p.random(2, (h - 2 * margin.y)/rows * 0.25));
            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2*margin.x - 2*padding.x,
                                h - 2*margin.y - 2*padding.y);
            var offset = p5.Vector.add(loc, margin);
            offset.add(padding);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x + grid.cellWidth/2,
                             cell.y + padding.y,
                             cell.x + grid.cellWidth/2,
                             cell.y + grid.cellHeight - padding.y);
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfVLines);

        module.hLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = p.round(p.random(10, h/5)),
                cols = 1,
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y);
            graphic.strokeJoin(p.BEVEL);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x,
                             cell.y + grid.cellHeight/2,
                             cell.x + grid.cellWidth,
                             cell.y + grid.cellHeight/2);
            }
            graphic.pop();
        };
        module.index.push(module.hLines);

        module.vLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = 1,
                cols = p.round(p.random(10, w/5)),
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y);
            graphic.strokeJoin(p.BEVEL);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x + grid.cellWidth/2,
                             cell.y,
                             cell.x + grid.cellWidth/2,
                             cell.y + grid.cellHeight);
            }
            graphic.pop();
        };
        module.index.push(module.vLines);

        module.hStripes = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = p.round(p.random(h/60, h/50)),
                cols = 1,
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                thins = [0, 1, 2, 3, 4, 5],
                fixed = p.floor(p.random(thins.length)),
                pattern = [fixed],
                weight = 2;
            thins.splice(fixed, 1);
            for (var i = 0; i < 3; i++) {
                var index = p.floor(p.random(thins.length));
                if ( p.random() > 0.5) {
                    pattern.push(thins[index]);
                    thins.splice(index, 1);
                }
            }
            pattern.push(2.5);
            pattern.sort();
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i],
                    yoff = grid.cellHeight/(pattern.length + 1);
                graphic.stroke(module.color);
                for (var j = 0; j < pattern.length; j++) {
                    if (pattern[j] === 2.5) {
                        graphic.strokeWeight(8);
                        graphic.strokeCap(p.SQUARE);
                        graphic.line(cell.x, cell.y + yoff * (j + 1),
                                 cell.x + grid.cellWidth, cell.y + yoff * (j + 1));
                    } else {
                        graphic.strokeCap(p.ROUND);
                        graphic.strokeWeight(2);
                        graphic.line(cell.x + 2, cell.y + yoff * (j + 1),
                                 cell.x - 2 + grid.cellWidth, cell.y + yoff * (j + 1));
                    }
                }
            }
            graphic.pop();
        };
        module.index.push(module.hStripes);


        module.rects = function(loc, w, h, graphic) {
            graphic.push();
            graphic.fill(module.color);
            graphic.noStroke();
            var rows = p.round(p.random(3, 10)),
                cols = p.round(p.random(3, 10)),
                margin = p.createVector(p.random(0, w * 0.15),
                                        p.random(0, h * 0.05)),
                padding = p.createVector(
                        p.random(5, (w - 2 * margin.x)/cols * 0.25),
                        p.random(5, (h - 2 * margin.y)/rows * 0.25)),
                dark = chroma(p.red(module.color), p.green(module.color), p.blue(module.color)).darken(2).rgb();

            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2 * margin.x,
                                h - 2 * margin.y);
            var offset = p5.Vector.add(loc, margin);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i],
                    tOff = p.floor(p.random(0, 60*60*3)),
                    limit = p.floor(p.random(60*60, 60*60*3));
                graphic.push();
                if ( (p.frameCount + tOff) % limit > limit * 0.75) {
                    graphic.fill(dark);
                }
                graphic.rect(cell.x + padding.x,
                             cell.y + padding.y,
                             grid.cellWidth - 2 * padding.x,
                             grid.cellHeight - 2 * padding.y);
                graphic.pop();
            }
            graphic.pop();
        };
        module.index.push(module.rects);

        module.rowsOfRects = function(loc, w, h, graphic) {
            graphic.push();
            graphic.fill(module.color);
            graphic.noStroke();
            var rows = p.round(p.random(h/60, h/45)),
                cols = 1,
                margin = p.createVector(8, 8),
                padding = p.createVector(0, 6),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                innerRows = p.round(p.random(2, 4)),
                innerCols = p.round(p.random(3, 5)),
                innerPadding = p.createVector(2, 2),
                innerGrid = makeGrid(innerRows, innerCols,
                                     grid.cellWidth - 2*padding.x,
                                     grid.cellHeight - 2*padding.y),
                dark = chroma(p.red(module.color), p.green(module.color), p.blue(module.color)).darken(2).rgb();
            graphic.translate(loc.x, loc.y);
            graphic.translate(margin.x, margin.y);
            for (var i = 0; i < grid.grid.length; i++) {
                graphic.push();
                var cell = grid.grid[i];
                graphic.translate(cell.x, cell.y);
                graphic.translate(padding.x, padding.y);
                for (var j = 0; j < innerGrid.grid.length; j++) {
                    var innerCell = innerGrid.grid[j],
                        tOff = p.floor(p.random(0, 60*60*3)),
                        limit = p.floor(p.random(60*60, 60*60*3));
                    graphic.push();
                    if ( (p.frameCount + tOff) % limit > limit * 0.75) {
                        graphic.fill(dark);
                    }
                    graphic.rect(innerCell.x + innerPadding.x,
                                 innerCell.y + innerPadding.y,
                                 innerGrid.cellWidth - 2 * innerPadding.x,
                                 innerGrid.cellHeight - 2 * innerPadding.y);
                    graphic.pop();
                }
                graphic.pop();
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfRects);

        module.rowsOfRectsDivided = function(loc, w, h, graphic) {
            graphic.push();
            graphic.fill(module.color);
            graphic.noStroke();
            var rows = p.round(p.random(h/60, h/45)),
                cols = 1,
                margin = p.createVector(8, 8),
                padding = p.createVector(0, 6),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                innerRows = p.round(p.random(2, 4)),
                innerCols = p.round(p.random(3, 5)),
                innerPadding = p.createVector(2, 2),
                innerGrid = makeGrid(innerRows, innerCols,
                                     grid.cellWidth - 2*padding.x,
                                     grid.cellHeight - 2*padding.y),
                dark = chroma(p.red(module.color), p.green(module.color), p.blue(module.color)).darken(2).rgb();
            graphic.translate(loc.x, loc.y);
            graphic.translate(margin.x, margin.y);
            for (var i = 0; i < grid.grid.length; i++) {
                graphic.push();
                var cell = grid.grid[i];
                graphic.translate(cell.x, cell.y);
                if (i !== 0) {
                    graphic.push();
                    graphic.stroke(module.color);
                    graphic.line(-margin.x+2, 0, grid.cellWidth + margin.x-2, 0);
                    graphic.pop();
                }
                graphic.translate(padding.x, padding.y);
                for (var j = 0; j < innerGrid.grid.length; j++) {
                    var innerCell = innerGrid.grid[j],
                        tOff = p.floor(p.random(0, 60*60*3)),
                        limit = p.floor(p.random(60*60, 60*60*3));
                    graphic.push();
                    if ( (p.frameCount + tOff) % limit > limit * 0.75) {
                        graphic.fill(dark);
                    }
                    graphic.rect(innerCell.x + innerPadding.x,
                                 innerCell.y + innerPadding.y,
                                 innerGrid.cellWidth - 2 * innerPadding.x,
                                 innerGrid.cellHeight - 2 * innerPadding.y);
                    graphic.pop();
                }
                graphic.pop();
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfRectsDivided);

        return module;
    }();
}
