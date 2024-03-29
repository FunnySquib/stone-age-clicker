function ProceduralGeneration() {}


ProceduralGeneration.perlinNoise = function(size, lowestOctave, highOctaveWeight) { // size and lowestOctave must be multiple of 2, highOctaveWeight must be 0.0 - 1.0

    var octaves = [];

    for(var octaveSize = size; octaveSize >= lowestOctave; octaveSize /= 2) {
        var octave = createMatrix(octaveSize, octaveSize, 0);
        for(var x = 0; x < octaveSize; x++) {
            for(var y = 0; y < octaveSize; y++) {
                octave[x][y] = randFloat(0.0, 1.0);
            }
        }
        octaves.push(octave);
    }

    var noise = createMatrix(size, size, 0);

    for(var i = 0; i < octaves.length; i++) {

        var octave = octaves[i];
        var oS = octave.length;
        var interpolationSpan = size / oS;

        for(var x = 0; x < size; x++) {
            for(var y = 0; y < size; y++) {

                var baseX = Math.floor(x / interpolationSpan);
                var baseY = Math.floor(y / interpolationSpan);

                var offsetX = (x - (baseX * interpolationSpan)) / interpolationSpan;
                var offsetY = (y - (baseY * interpolationSpan)) / interpolationSpan;

                var x0y0 = octave[baseX][baseY];
                var x1y0 = octave[(baseX + 1) % oS][baseY];
                var x0y1 = octave[baseX][(baseY + 1) % oS];
                var x1y1 = octave[(baseX + 1) % oS][(baseY + 1) % oS];

                var interpolateX = limit(Interpolate.quad(offsetX), 0.0, 1.0);
                var interpolateY = limit(Interpolate.quad(offsetY), 0.0, 1.0);

                var value = x0y0 * (1.0 - interpolateX) * (1.0 - interpolateY);
                value += x1y0 * interpolateX * (1.0 - interpolateY);
                value += x0y1 * (1.0 - interpolateX) * interpolateY;
                value += x1y1 * interpolateX * interpolateY;
                noise[x][y] = (noise[x][y] * highOctaveWeight) + (value * (1.0 - highOctaveWeight));
            }
        }

    }

    return noise;
};


ProceduralGeneration.scaleMatrixZeroToOne = function(m) {

    var sizeX = m.length;
    var sizeY = m[0].length;

    var minVal = m[0][0];
    var maxVal = m[0][0];

    for(var x = 0; x < sizeX; x++) {
        for(var y = 0; y < sizeY; y++) {
            if(minVal > m[x][y]) {
                minVal = m[x][y];
            }
            if(maxVal < m[x][y]) {
                maxVal = m[x][y];
            }
        }
    }

    var mid = (minVal + maxVal) / 2.0;
    var scale = 1.0 / (maxVal - minVal);

    for(var x = 0; x < sizeX; x++) {
        for(var y = 0; y < sizeY; y++) {
            m[x][y] = limit(0.5 + ((m[x][y] - mid) * scale), 0.0, 1.0);
        }
    }

};


ProceduralGeneration.createIsland = function(map, mapSizeX, mapSizeY, posX, posY, radius, amplitude, callback) {

    var startX = limit(posX - (radius + amplitude), 0, mapSizeX - 1);
    var endX = limit(posX + (radius + amplitude), 0, mapSizeX - 1);
    var startY = limit(posY - (radius + amplitude), 0, mapSizeY - 1);
    var endY = limit(posY + (radius + amplitude), 0, mapSizeY - 1);

    var possibleFrequencies = [3, 5, 7, 9, 11];
    var frequency = possibleFrequencies[rand(0, Math.ceil(radius / 3.0))];
    var offset = randFloat(0.1, 2.5);

    for(var x = startX; x <= endX; x++) {
        for(var y = startY; y <= endY; y++) {
            var angle1 = offset + (Math.atan2(posX - x, posY - y) * frequency);
            var angle2 = (offset * 3) + (Math.atan2(posX - x, posY - y) * 3);
            var maxDist = radius + (0.5 * amplitude * Math.sin(angle1)) + (0.5 * amplitude * Math.sin(angle2));
            if(distance(x, y, posX, posY) < maxDist) {
                callback(map, x, y);
            }
        }
    }

};