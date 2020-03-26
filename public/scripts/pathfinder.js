/*
    Jacky Tea
    Gridlock Pathfinder
    pathfinder.js
    
    A pathfinding algorithm visualization.
*/

//global coordinates initialization
let startPoint = 0;
let endPoint = 0;
let prevStartPoint = 0;
let prevEndPoint = 0;
let startOrEnd = 1; //1 is start, 2 is end
let obstacleMode = false;
let intervalTracker = [];

//onload
window.onload = function () {
    obstacleMode = false;
    let obstacleCheckBox = document.getElementById("obstacle-checkbox");
    obstacleCheckBox.checked = false;
}

//set start and end coordinates
function setStartOrEnd(id) {
    if (!obstacleMode) {
        if (startOrEnd === 1) {

            let prevStartPointDiv = document.getElementById(prevStartPoint.toString());
            prevStartPointDiv.innerHTML = "";
            prevStartPointDiv.style.background = "grey";
            prevStartPoint = id;
            startPoint = id;

            let startText = document.createTextNode("S");
            let startSpan = document.createElement("span");
            startSpan.style.fontWeight = "bold";
            startSpan.style.padding = "0";
            startSpan.style.margin = "0";
            startSpan.style.position = "absolute";
            startSpan.style.fontSize = "24px";
            startSpan.style.top = "50%";
            startSpan.style.left = "50%";
            startSpan.style.transform = "translate(-50%, -50%)";
            startSpan.appendChild(startText);

            let currentStartPointDiv = document.getElementById(id.toString());
            currentStartPointDiv.innerHTML = "";
            if (currentStartPointDiv.getAttribute("isObstacle") === "true") {
                currentStartPointDiv.setAttribute("isObstacle", "false");
            }
            currentStartPointDiv.style.background = "green";
            currentStartPointDiv.style.color = "white";
            currentStartPointDiv.style.position = "relative";
            currentStartPointDiv.appendChild(startSpan);

            startOrEnd = 2;

        } else {

            let prevEndPointDiv = document.getElementById(prevEndPoint.toString());
            prevEndPointDiv.innerHTML = "";
            prevEndPointDiv.style.background = "grey";
            prevEndPoint = id;
            endPoint = id;

            let endText = document.createTextNode("E");
            let endSpan = document.createElement("span");
            endSpan.style.fontWeight = "bold";
            endSpan.style.padding = "0";
            endSpan.style.margin = "0";
            endSpan.style.position = "absolute";
            endSpan.style.fontSize = "24px";
            endSpan.style.top = "50%";
            endSpan.style.left = "50%";
            endSpan.style.transform = "translate(-50%, -50%)";
            endSpan.appendChild(endText);

            let currentEndPointDiv = document.getElementById(id.toString());
            currentEndPointDiv.innerHTML = "";
            if (currentEndPointDiv.getAttribute("isObstacle") === "true") {
                currentEndPointDiv.setAttribute("isObstacle", "false");
            }
            currentEndPointDiv.style.background = "orange";
            currentEndPointDiv.style.color = "white";
            currentEndPointDiv.style.position = "relative";
            currentEndPointDiv.appendChild(endSpan);

            startOrEnd = 1;
        }
    } else {
        let obstacleDiv = document.getElementById(id.toString());
        obstacleDiv.innerHTML = "";
        obstacleDiv.setAttribute("isObstacle", "true");
        obstacleDiv.style.background = "black";
        obstacleDiv.style.color = "white";
        obstacleDiv.style.position = "relative";
        obstacleDiv.addEventListener("click", function () {
            if (obstacleMode) {
                if (obstacleDiv.getAttribute("isObstacle") === "true") {
                    obstacleDiv.style.background = "grey";
                    obstacleDiv.setAttribute("isObstacle", "false");
                } else {
                    obstacleDiv.style.background = "black";
                    obstacleDiv.setAttribute("isObstacle", "true");
                }
            } else {
                obstacleDiv.setAttribute("isObstacle", "false");
            }
        });
    }
}

//toggle obstacle setting mode
function toggleObstacleMode() {
    obstacleMode = !obstacleMode;
    let obstacleCheckBox = document.getElementById("obstacle-checkbox");
    if (obstacleCheckBox.checked === true) {
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("(Obstacle mode on) Click on any point to set an obstacle, click again to un set it.");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "green";
        instructionsDiv.appendChild(instructions);
    } else {
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("(Obstacle mode off) Click on any 2 points to set a start and end point.");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "darkorange";
        instructionsDiv.appendChild(instructions);
    }
}

//set / get number of rows and columns
function dimensions() {
    let rows = 0;
    let cols = 0;
    return {
        setDimensions(r, c) {
            rows = r;
            cols = c;
        },
        getDimensions() {
            return { rows: rows, cols: cols };
        }
    }
}
let rc = dimensions();

//generate a matrix of row * col dimension
function genGrid(e) {

    //remove prompt and append instructions
    let emptyMessageDiv = document.getElementById("empty-message");
    emptyMessageDiv.innerHTML = "";
    let instructionsDiv = document.getElementById("instructions");
    instructionsDiv.style.color = "black";
    let instructions = document.createTextNode("Great! Now click on any two points on the grid and make a path with the buttons below.");
    instructionsDiv.innerHTML = "";
    instructionsDiv.appendChild(instructions);

    //reset points
    startPoint = 0;
    endPoint = 0;
    prevStartPoint = 0;
    prevEndPoint = 0;
    startOrEnd = 1;

    //parse form and restrictions
    e.preventDefault();
    let grid = document.getElementById("theGrid");
    grid.innerHTML = "";
    rc.setDimensions(e.target["rows"].value, e.target["columns"].value);
    let rows = rc.getDimensions().rows;
    let cols = rc.getDimensions().cols;
    if (rows > 10 || cols > 26 || rows <= 0 || cols <= 0) {
        let instructionsDiv = document.getElementById("instructions");
        instructionsDiv.innerHTML = "";
        let emptyMessageDiv = document.getElementById("empty-message");
        emptyMessageDiv.innerHTML = "";
        emptyMessageDiv.style.color = "darkorange";
        let error = document.createTextNode("Woops! Max rows is 10 and max columns is 26.");
        emptyMessageDiv.appendChild(error);
        return;
    }

    //append divs to the DOM
    let uid = 0;
    for (let i = 0; i < rows; i++) {

        //rows
        let theRow = document.createElement("div");
        theRow.id = "row" + i.toString();
        theRow.style.width = "100%";
        theRow.style.height = "50px";
        theRow.style.marginTop = "10px";
        grid.appendChild(theRow);

        //columns
        for (let j = 0; j < cols; j++) {
            let currentRow = document.getElementById("row" + i.toString());
            let theCol = document.createElement("div");
            theCol.id = uid.toString();
            theCol.style.display = "inline-block";
            theCol.style.width = "45px";
            theCol.style.height = "45px";
            theCol.style.background = "grey";
            theCol.style.marginLeft = "10px";
            theCol.setAttribute("coordinates", i.toString() + "," + j.toString());
            theCol.setAttribute("isObstacle", "false");
            theCol.addEventListener("click", function () {
                setStartOrEnd(parseInt(theCol.id));
            });
            theCol.onmouseover = function () {
                theCol.style.transform = "scale(1.1)";
                theCol.style.filter = "brightness(75%)";
            };
            theCol.onmouseout = function () {
                theCol.style.transform = "scale(1)";
                theCol.style.filter = "brightness(100%)";
            };
            ++uid;
            currentRow.appendChild(theCol);
        }
    }
}


//clear grid, reset intervals and resets points
function clearGrid() {
    //reset points
    startPoint = 0;
    endPoint = 0;
    prevStartPoint = 0;
    prevEndPoint = 0;
    startOrEnd = 1;

    //reset grid and running intervals
    let limits = rc.getDimensions().rows * rc.getDimensions().cols;
    for (let i = 0; i < limits; i++) {
        let currentDiv = document.getElementById(i.toString());
        currentDiv.innerHTML = "";
        currentDiv.style.background = "grey";
        currentDiv.setAttribute("isObstacle", "false");
    }
    for (let i = 0; i < intervalTracker.length; i++) {
        clearInterval(intervalTracker[i]);
    }
}

//brute force path find
function linearScanHelper() {
    //clear any current paths
    let limits = rc.getDimensions().rows * rc.getDimensions().cols;
    for (let i = 0; i < limits; i++) {
        if (i != startPoint && i != endPoint && document.getElementById(i.toString()).getAttribute("isObstacle") === "false") {
            document.getElementById(i.toString()).style.background = "grey";
        }
        if (document.getElementById(i.toString()).style.background === "red" && document.getElementById(i.toString()).getAttribute("isObstacle") === "true") {
            document.getElementById(i.toString()).style.background = "grey";
            document.getElementById(i.toString()).setAttribute("isObstacle", "false");
        }
    }

    //clear running intervals
    for (let i = 0; i < intervalTracker.length; i++) {
        clearInterval(intervalTracker[i]);
    }

    //check where start and end is
    if (startPoint > endPoint) {

        let uid = startPoint - 1;
        let cell = document.getElementById(uid.toString());
        let run = setInterval(traverse, 50);
        intervalTracker.push(run);
        function traverse() {
            if (uid === endPoint || uid < 0 || uid > limits) {
                clearInterval(run);
            } else {
                if (!cell) {
                    clearInterval(run);
                }
                if (cell.getAttribute("isObstacle") === "true") {
                    clearInterval(run);
                    //not found
                    let instructionsDiv = document.getElementById("instructions");
                    let instructions = document.createTextNode("Unable to find path via linear scan!");
                    instructionsDiv.innerHTML = "";
                    instructionsDiv.style.color = "red";
                    instructionsDiv.appendChild(instructions);
                    return;
                }
                cell.style.background = "red";
                uid--;
                cell = document.getElementById(uid.toString());
            }
        }

        //amount of steps
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("Shortest path via linear scan is " + Math.abs(startPoint - endPoint) + " steps.");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "green";
        instructionsDiv.appendChild(instructions);

    } else {

        let uid = startPoint + 1;
        let cell = document.getElementById(uid.toString());
        let run = setInterval(traverse, 50);
        intervalTracker.push(run);
        function traverse() {
            if (uid === endPoint || uid < 0 || uid > limits) {
                clearInterval(run);
            } else {
                if (!cell) {
                    clearInterval(run);
                }
                if (cell.getAttribute("isObstacle") === "true") {
                    clearInterval(run);
                    //not found
                    let instructionsDiv = document.getElementById("instructions");
                    let instructions = document.createTextNode("Unable to find path via linear scan!");
                    instructionsDiv.innerHTML = "";
                    instructionsDiv.style.color = "red";
                    instructionsDiv.appendChild(instructions);
                    return;
                }
                cell.style.background = "red";
                uid++;
                cell = document.getElementById(uid.toString());
            }
        }

        //amount of steps
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("Shortest path via linear scan is " + Math.abs(startPoint - endPoint) + " steps.");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "green";
        instructionsDiv.appendChild(instructions);
    }
}

//brute force path find
function linearScan() {
    linearScanHelper();
}

//check if index is valid
function checkBounds(matrix, i, j) {
    return i < rc.getDimensions().rows && i >= 0 && j < rc.getDimensions().cols && j >= 0
        && document.getElementById(matrix[i][j].toString()).getAttribute("isObstacle") === "false";
}

//make an graph from 2d array (adjacency list) - 4 connectivity
function convertToAdjacencyList(matrix) {
    let nodeMap = {};
    for (let i = 0; i < rc.getDimensions().rows; i++) {
        for (let j = 0; j < rc.getDimensions().cols; j++) {
            let neighborsList = [];

            //check up
            if (checkBounds(matrix, i - 1, j)) {
                neighborsList.push(matrix[i - 1][j]);
            }

            //check down
            if (checkBounds(matrix, i + 1, j)) {
                neighborsList.push(matrix[i + 1][j]);
            }

            //check left 
            if (checkBounds(matrix, i, j - 1)) {
                neighborsList.push(matrix[i][j - 1]);
            }

            //check right
            if (checkBounds(matrix, i, j + 1)) {
                neighborsList.push(matrix[i][j + 1]);
            }

            nodeMap[matrix[i][j]] = neighborsList;
        }
    }
    return nodeMap;
}

//make an graph from 2d array (adjacency list) - 8 connectivity
function convertToAdjacencyList8Directions(matrix) {
    let nodeMap = {};
    for (let i = 0; i < rc.getDimensions().rows; i++) {
        for (let j = 0; j < rc.getDimensions().cols; j++) {
            let neighborsList = [];

            //check up
            if (checkBounds(matrix, i - 1, j)) {
                neighborsList.push(matrix[i - 1][j]);
            }

            //check down
            if (checkBounds(matrix, i + 1, j)) {
                neighborsList.push(matrix[i + 1][j]);
            }

            //check left 
            if (checkBounds(matrix, i, j - 1)) {
                neighborsList.push(matrix[i][j - 1]);
            }

            //check right
            if (checkBounds(matrix, i, j + 1)) {
                neighborsList.push(matrix[i][j + 1]);
            }

            //check top left
            if (checkBounds(matrix, i - 1, j - 1)) {
                neighborsList.push(matrix[i - 1][j - 1]);
            }

            //check top right
            if (checkBounds(matrix, i - 1, j + 1)) {
                neighborsList.push(matrix[i - 1][j + 1]);
            }

            //check bottom left
            if (checkBounds(matrix, i + 1, j - 1)) {
                neighborsList.push(matrix[i + 1][j - 1]);
            }

            //check bottom right
            if (checkBounds(matrix, i + 1, j + 1)) {
                neighborsList.push(matrix[i + 1][j + 1]);
            }

            nodeMap[matrix[i][j]] = neighborsList;
        }
    }
    return nodeMap;
}

//perform a breadth first search on a graph
function breadthFirstSearchHelper(graph, start, end) {
    let queue = [];
    queue.push([start]);
    let visited = new Set();
    while (queue.length > 0) {
        let path = queue.shift();
        let vertex = path[path.length - 1];
        if (vertex === end) {
            return path;
        }
        else if (!visited.has(vertex)) {
            for (adj in graph[vertex]) {
                let newPath = Array.from(path);
                newPath.push(graph[vertex][adj]);
                queue.push(newPath);
            }
            visited.add(vertex);
        }
    }
}


//setup matrixes and trace BFS path for a 4 connectivity traversal
function breadthFirstSearch() {

    for (let i = 0; i < intervalTracker.length; i++) {
        clearInterval(intervalTracker[i]);
    }

    //init 2d array
    let matrix = [];
    let n = 0;
    for (let i = 0; i < rc.getDimensions().rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < rc.getDimensions().cols; j++) {
            matrix[i][j] = n;
            n++;
        }
    }

    //get shortest path
    let adjacencyList = convertToAdjacencyList(matrix);
    let shortestPath = breadthFirstSearchHelper(adjacencyList, startPoint, endPoint);

    //clear any current paths
    let limits = rc.getDimensions().rows * rc.getDimensions().cols;
    for (let i = 0; i < limits; i++) {
        if (i != startPoint && i != endPoint && document.getElementById(i.toString()).getAttribute("isObstacle") === "false") {
            document.getElementById(i.toString()).style.background = "grey";
        }
        if (document.getElementById(i.toString()).style.background === "red" && document.getElementById(i.toString()).getAttribute("isObstacle") === "true") {
            document.getElementById(i.toString()).style.background = "grey";
            document.getElementById(i.toString()).setAttribute("isObstacle", "false");
        }
    }

    //amount of steps
    if (shortestPath !== undefined) {

        //don't count end and start
        shortestPath.shift();
        shortestPath.pop();

        //highlight path
        let run = setInterval(traverse, 50);
        intervalTracker.push(run);
        let i = 0;
        function traverse() {
            if (i === shortestPath.length) {
                clearInterval(run);
            }
            else {
                document.getElementById(shortestPath[i].toString()).style.background = "red";
                i++;
            }
        }
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("Shortest path via quad-directional breadth first search is " + (shortestPath.length + 1) + " steps.");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "green";
        instructionsDiv.appendChild(instructions);
    } else {
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("Unable to find path via quad-directional breadth first search!");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "red";
        instructionsDiv.appendChild(instructions);
    }
}

//setup matrixes and trace BFS path for a 8 connectivity traversal
function breadthFirstSearch8Directions() {

    for (let i = 0; i < intervalTracker.length; i++) {
        clearInterval(intervalTracker[i]);
    }

    //init 2d array
    let matrix = [];
    let n = 0;
    for (let i = 0; i < rc.getDimensions().rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < rc.getDimensions().cols; j++) {
            matrix[i][j] = n;
            n++;
        }
    }

    //get shortest path
    let adjacencyList = convertToAdjacencyList8Directions(matrix);
    let shortestPath = breadthFirstSearchHelper(adjacencyList, startPoint, endPoint);

    //clear any current paths
    let limits = rc.getDimensions().rows * rc.getDimensions().cols;
    for (let i = 0; i < limits; i++) {
        if (i != startPoint && i != endPoint && document.getElementById(i.toString()).getAttribute("isObstacle") === "false") {
            document.getElementById(i.toString()).style.background = "grey";
        }
        if (document.getElementById(i.toString()).style.background === "red" && document.getElementById(i.toString()).getAttribute("isObstacle") === "true") {
            document.getElementById(i.toString()).style.background = "grey";
            document.getElementById(i.toString()).setAttribute("isObstacle", "false");
        }
    }

    //amount of steps
    if (shortestPath !== undefined) {

        //don't count end and start
        shortestPath.shift();
        shortestPath.pop();

        //highlight path
        let run = setInterval(traverse, 50);
        intervalTracker.push(run);
        let i = 0;
        function traverse() {
            if (i === shortestPath.length) {
                clearInterval(run);
            }
            else {
                document.getElementById(shortestPath[i].toString()).style.background = "red";
                i++;
            }
        }

        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("Shortest path via octal-directional breadth first search is " + (shortestPath.length + 1) + " steps.");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "green";
        instructionsDiv.appendChild(instructions);
    } else {
        let instructionsDiv = document.getElementById("instructions");
        let instructions = document.createTextNode("Unable to find path via octal-directional breadth first search!");
        instructionsDiv.innerHTML = "";
        instructionsDiv.style.color = "red";
        instructionsDiv.appendChild(instructions);
    }
}