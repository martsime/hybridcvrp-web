# HybridCVRP-web

Website with a demo of the [HybridCVRP](https://github.com/martsime/hybridcvrp) solver, running at: [https://martsime.github.io/hybridcvrp](https://martsime.github.io/hybridcvrp)

![HybridCVRP](https://user-images.githubusercontent.com/14152372/131352611-e7944cd0-3634-473d-a44e-02cbbca15009.gif)

## Introduction

Unless you are familiar with the [Vehicle Routing Problem](https://en.wikipedia.org/wiki/Vehicle_routing_problem) (VRP), the demo may not make much sense.

VRP is a combinatorial optimization problem where you have a set of customers expecting a delivery, and the goal is to find the best set of delivery routes for these customers.
In general, a VRP can have many different constraints and requirements.
However, the solver used in this demo is specialized for the Capacitated Vehicle Routing Problem (CVRP).
It considers a single depot (red node in the visualization), and there is an unlimited number of vehicles, all with the same capacity.
The solver tries to find the set of routes such that the total distance driven by the vehicles is minimized, while taking into account their capacity.

In the GIF above, the total distance driven is represented as "Cost", while the "% from BKS" represents how much worse the current solution is compared to the "Best Known Solution".
The problem instances used in the demo are from a standard benchmark dataset, and the website [CVRPLIB](http://vrp.atd-lab.inf.puc-rio.br/index.php/en/) constains information about the best solutions obtained for the different problem instances.

## Usage

1. In order to test the solver, you must first choose a problem instance to be solved from the dropdown. 
It contains information about the customers to serve, like their demands and positions, in addition to the capacity of the vehicles.
2. Once the problem instance is loaded, you can start the solver by pressing the "play" button.
3. When running, you can either pause the solver by pressing the "pause" button, or reset it by pressing the "x" button

#### Configuration

You can configure the solver parameters by clicking the "wheel" button.
For an explanation of the different parameters, it is recommended to read the [config.yml](https://github.com/martsime/hybridcvrp/blob/main/config.yml) file provided in the repository of the solver, or to read the paper proposing the algorithm implemented in the solver.

## Installation

Running the website locally requires Node.js (v14.17.5) and npm to be installed.

Start by installing the dependencies:

```
npm install
```

and run the dev server with:
```
npm run dev
```




