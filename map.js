var canvas = document.getElementById("map");
var context = canvas.getContext("2d");
var hexInfoContainer = document.getElementById("hex-info-container");

var hexInfo = document.createElement("div");
hexInfo.id = "hex-info-container";
hexInfoContainer.appendChild(hexInfo);

var hexRadius = 25; // Define the radius of the hexagons
var numRows = 10; // Define the number of rows in the map
var numCols = 10; // Define the number of columns in the map

var unit = {
  id: "unit-1",
  icon: "INFANTRY", // The name of the NATO icon to use for the unit
  color: "red", // The color of the unit on the map
  hex: {x: 4, y: 6} // The hexagon that the unit is currently located on
};

// Define terrain data
var terrainData = [
  {type: "river", visibility: 0, movement: 0, name: "River", color: "#3BB9FF"},
  {type: "plains", visibility: 1, movement: 1, name: "Plains", color: "#8BC34A"},
  {type: "hills", visibility: 1, movement: 2, name: "Hills", color: "#9E9E9E"},
  {type: "mountains", visibility: 2, movement: 3, name: "Mountains", color: "#757575"},
  {type: "ocean", visibility: 0, movement: 0, name: "Ocean", color: "#2196F3"},
  {type: "village", visibility: 1, movement: 1, name: "Village", color: "#FFC107"},
  {type: "town", visibility: 1, movement: 1, name: "Town", color: "#FF9800"},
  {type: "city", visibility: 1, movement: 1, name: "City", color: "#FF5722"},
  {type: "road", visibility: 1, movement: 1, name: "Road", color: "#795548"},
  {type: "path", visibility: 1, movement: 1, name: "Path", color: "#A1887F"},
  {type: "field", visibility: 1, movement: 1, name: "Field", color: "#4CAF50"},
  {type: "forest", visibility: 1, movement: 2, name: "Forest", color: "#4CAF50"},
  {type: "swamp", visibility: 1, movement: 2, name: "Swamp", color: "#4CAF50"},
  {type: "desert", visibility: 1, movement: 1, name: "Desert", color: "#FFEB3B"},
  {type: "beach", visibility: 1, movement: 1, name: "Beach", color: "#FFEB3B"}

];

// Define the x and y coordinates for each hexagon
var hexCoordinates = [];
for (var row = 0; row < numRows; row++) {
  for (var col = 0; col < numCols; col++) {
    var x = col * hexRadius * Math.sqrt(3);
    var y = row * hexRadius * 1.5;

    // Offset every other row to create a hexagonal pattern
    if (row % 2 === 1) {
      x += hexRadius * Math.sqrt(3) / 2;
    }


    var terrainType = mapLayout[row][col];
    var terrain = terrainData.find(function(element) {
      return element.type === terrainType;
    });

    // Add the x, y, and terrain properties to the hexCoordinates array
    hexCoordinates.push({x: x, y: y, terrain: terrain});
  }
}

// Draw the hexagons on the canvas
for (var i = 0; i < hexCoordinates.length; i++) {
  var x = hexCoordinates[i].x;
  var y = hexCoordinates[i].y;
  var terrain = hexCoordinates[i].terrain;
  var color = terrain.color;

  context.fillStyle = color;
  context.beginPath();
  for (var j = 0; j < 6; j++) {
    var angle = 2 * Math.PI / 6 * (j + 0.5);
    var x_i = x + hexRadius * Math.cos(angle);
    var y_i = y + hexRadius * Math.sin(angle);
    if (j === 0) {
      context.moveTo(x_i, y_i);
    } else {
      context.lineTo(x_i, y_i);
    }
  }
  context.closePath();
  context.fill();
  context.stroke();
}


function getHexAt(x, y) {
  for (var i = 0; i < hexCoordinates.length; i++) {
    var hex = hexCoordinates[i];
    var dx = hex.x - x;
    var dy = hex.y - y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= hexRadius) {
      return hex;
    }
  }

  return null;
}

// Add event listener to display coordinates on mouseover
canvas.addEventListener("mousemove", function(event) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;
  var hex = getHexAt(mouseX, mouseY);

  if (hex) {
    var terrain = hex.terrain;
    var terrainInfo = "Type: " + terrain.type + "<br>" +
                      "Visibility: " + terrain.visibility + "<br>" +
                      "Movement Cost: " + terrain.movement;
    var hexInfoContent = "Coordinates: (" + hex.x + ", " + hex.y + ")<br>" +
                         "Terrain: " + terrain.name + "<br>" +
                         terrainInfo;

    hexInfo.innerHTML = hexInfoContent;
    hexInfo.style.display = "block";
    hexInfo.style.top = (event.clientY + 10) + "px";
    hexInfo.style.left = (event.clientX + 10) + "px";
    hexInfo.style.border = "1px solid " + terrain.color;
  } else {
    hexInfo.style.display = "none";
  }
});



// Check if point is inside a hexagon
function pointInHexagon(x, y, hexX, hexY, hexRadius) {
  var dx = x - hexX;
  var dy = y - hexY;
  return (Math.abs(dy) <= hexRadius * 0.5 && Math.abs(dy) * 2 + Math.abs(dx) <= hexRadius * Math.sqrt(3));
}
