# Gridlock Pathfinder

## Overview

A pathfinding algorithm visualizer using a 2D matrix.

You check it out [here](https://serene-citadel-76223.herokuapp.com/ "Gridlock Pathfinder").

**Note**: this is a [Heroku](https://www.heroku.com/ "Heroku Main Page") hosted site and may take time to connect to. 

## Algorithms Utilized

### Breadth First Search (8-Connectivity)

- Generates an auxiliary adjacency list to find the shortest path via mapping and queuing. Takes into consideration diagonal directions.

### Breadth First Search (4-Connectivity)

- Generates an auxiliary adjacency list to find the shortest path via mapping and queuing.

### Brute Force Linear Scan

- Traverses the adjacency matrix to find a path from the start node to the end node.

For more reading on the BFS algorithm, click [here.](https://en.wikipedia.org/wiki/Breadth-first_search, "Breadth First Search")

## Demonstration GIFs

#### Breadth First Search (8-Connectivity) Demo

![bfs_8connect](https://user-images.githubusercontent.com/44061647/77489941-e4c67e80-6e0f-11ea-922e-59d46abb48c9.gif)

#### Breadth First Search (4-Connectivity) Demo

![bfs_4connect](https://user-images.githubusercontent.com/44061647/77489937-e3955180-6e0f-11ea-836c-fb0f7597292c.gif)

#### Brute Force Linear Scan Demo

![linear_scan](https://user-images.githubusercontent.com/44061647/77489942-e5f7ab80-6e0f-11ea-84c2-3fde2873b432.gif)
