<script>
  import { onMount } from "svelte";

  import { Deck, OrthographicView } from "@deck.gl/core";
  import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";

  import { instance, solution } from "../../stores";
  import MapPanel from "./MapPanel.svelte";

  let mapPanel;

  let deck;
  let mapCanvas;
  let mapWidth;
  let mapHeight;
  let mapPadding = 50;
  let panelHeight = 50;
  let zoom = 0;
  let depot;
  let nodes = [];
  let depotLines = [];
  let routes = [];
  let depotLayer;
  let nodeLayer;
  let routeLayer;
  let depotLinesLayer;

  export function reset() {
    mapPanel.reset();
  }

  let bounds = {
    minX: undefined,
    maxX: undefined,
    minY: undefined,
    maxY: undefined,
    update: function (x, y) {
      this.minX = this.minX === undefined ? x : Math.min(this.minX, x);
      this.minY = this.minY === undefined ? y : Math.min(this.minY, y);
      this.maxX = this.maxX === undefined ? x : Math.max(this.maxX, x);
      this.maxY = this.maxY === undefined ? y : Math.max(this.maxY, y);
    },
    getCenter: function () {
      return [
        (this.maxX - this.minX) / 2 + this.minX,
        (this.maxY - this.minY) / 2 + this.minY + panelHeight,
      ];
    },
    width: function () {
      return this.maxX - this.minX;
    },
    height: function () {
      return this.maxY - this.minY;
    },
  };

  function calculateZoom() {
    let scale = Math.min(
      (mapWidth - mapPadding) / bounds.width(),
      (mapHeight - panelHeight - mapPadding) / bounds.height()
    );
    zoom = Math.log2(scale);
  }

  // Reactive update when instance changes
  $: {
    nodes = $instance.nodes.map((node) => {
      bounds.update(node.x, node.y);
      return node;
    });
    if (nodes.length > 0) {
      depot = nodes[0];
      nodes = nodes.slice(1);
    }

    createDepotLayer();
    createNodeLayer();
    resetZoom();
    redraw();
  }

  // Reactive update when solution changes

  $: {
    depotLines = [];
    routes = $solution.routes.map((route) => {
      // Create route
      let routePositions = [];
      route.forEach((nodeIndex) => {
        const node = nodes[nodeIndex - 1];
        routePositions.push([node.x, node.y]);
      });

      // Create depotLines
      if (route.length > 0) {
        const firstNode = nodes[route[0] - 1];
        const lastNode = nodes[route[route.length - 1] - 1];
        depotLines.push([
          [depot.x, depot.y],
          [firstNode.x, firstNode.y],
        ]);
        depotLines.push([
          [lastNode.x, lastNode.y],
          [depot.x, depot.y],
        ]);
      }
      return routePositions;
    });
    createDepotLinesLayer();
    createRouteLayer();
    redraw();
  }

  let INITIAL_VIEW_STATE = {
    target: [0, 0],
    minZoom: -20,
    maxZoom: 20,
    zoom,
  };

  function resetZoom() {
    calculateZoom();
    if (deck) {
      deck.setProps({
        initialViewState: {
          ...INITIAL_VIEW_STATE,
          zoom,
          target: bounds.getCenter(),
        },
      });
    }
  }

  function onChange({ viewState }) {
    deck.setProps({
      initialViewState: viewState,
    });
    return viewState;
  }

  function createNodeLayer() {
    nodeLayer = new ScatterplotLayer({
      id: "nodeLayer",
      data: nodes,
      radiusMinPixels: 2,
      radiusMaxPixels: 64,
      getFillColor: [250, 250, 250],
      getPosition: (d) => [d.x, d.y],
      getRadius: 5,
      pickable: true,
    });
  }

  function createRouteLayer() {
    routeLayer = new PathLayer({
      id: "routeLayer",
      data: routes,
      jointRounded: true,
      getPath: (d) => d,
      getColor: [200, 200, 200],
      getWidth: 3,
      widthMinPixels: 2,
      widthMaxPixels: 32,
    });
  }

  function createDepotLayer() {
    depotLayer = new ScatterplotLayer({
      id: "depotLayer",
      data: depot === undefined ? [] : [depot],
      radiusMinPixels: 4,
      radiusMaxPixels: 128,
      getFillColor: [255, 0, 0],
      getPosition: (d) => [d.x, d.y],
      getRadius: 8,
      pickable: true,
    });
  }

  function createDepotLinesLayer() {
    depotLinesLayer = new PathLayer({
      id: "depotLinesLayer",
      data: depotLines,
      jointRounded: true,
      getPath: (d) => d,
      getColor: [200, 200, 200, 64],
      getWidth: 3,
      widthMinPixels: 2,
      widthMaxPixels: 32,
    });
  }

  function setupDeck() {
    deck = new Deck({
      canvas: mapCanvas,
      views: new OrthographicView({
        flipY: false,
      }),
      onViewStateChange: onChange,
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      layers: [depotLinesLayer, routeLayer, nodeLayer, depotLayer],
      getTooltip: ({ object }) =>
        object && {
          html: `
            <p style="margin-bottom: 0px;">Node: ${object.id}</p>
            <p style="margin-bottom: 0px;">Demand: ${object.demand}</p>
            <p style="margin-bottom: 0px;">Position: (${object.x}, ${object.y})</p>
          `,
          style: {
            backgroundColor: "#f0f6fc",
            fontSize: "1em",
            color: "#161b22",
            borderRadius: "5px",
          },
        },
    });
    window.map = deck;
  }

  function redraw() {
    if (deck) {
      deck.setProps({
        layers: [depotLinesLayer, routeLayer, nodeLayer, depotLayer],
      });
    }
  }

  onMount(async () => {
    setupDeck();
  });
</script>

<div>
  <div
    bind:clientWidth={mapWidth}
    bind:clientHeight={mapHeight}
    id="map-container"
  >
    <canvas bind:this={mapCanvas} />
    <MapPanel bind:this={mapPanel} resetZoomHandler={resetZoom} />
  </div>
</div>

<style>
  #map-container {
    position: relative;
    margin: 0 auto;
    width: 100%;
    height: calc(100vh - 200px);
    border-radius: 10px;
    background-color: var(--secondary-color);
  }
</style>
