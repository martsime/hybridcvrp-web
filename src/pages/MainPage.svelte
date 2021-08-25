<script>
  import { config, instance, solution, state, time } from "../stores";

  import Map from "./components/map/Map.svelte";
  import Navbar from "./components/Navbar.svelte";
  import GearIcon from "./components/icons/GearIcon.svelte";
  import InstanceSelector from "./components/InstanceSelector.svelte";
  import ConfigForm from "./components/ConfigForm.svelte";

  import { onMount } from "svelte";

  let worker;
  let configForm;
  let map;

  onMount(() => {
    worker = new Worker("./worker.js");
    worker.onmessage = function (msg) {
      if (msg.data.type === "LOAD_COMPLETE") {
        $state.loaded = true;
      } else if (msg.data.type === "ITERATION_COMPLETE") {
        const value = msg.data.value;
        if (value !== null) {
          $solution = value;
        }
        if ($state.running) {
          worker.postMessage({ type: "ITERATE" });
        }
      } else if (msg.data.type === "CONFIG_UPDATED") {
      }
    };
    worker.postMessage({ type: "UPDATE_CONFIG", value: $config });
  });

  $: {
    if (worker && $instance.nodes.length > 0) {
      worker.postMessage({ type: "LOAD_INSTANCE", value: $instance });
    }
  }

  $: {
    if (worker && $state.running) {
      worker.postMessage({ type: "ITERATE" });
    }
  }

  // Reset
  $: {
    if (worker && $state.reset) {
      solution.set({
        routes: [],
        cost: null,
      });
      state.set({
        ...$state,
        reset: false,
        running: false,
        loaded: false,
      });
      time.set(0.0);
      configForm.hide();
      map.reset();
      $instance = $instance;
    }
  }

  $: {
    if (worker && $state.updateConfig) {
      state.set({
        ...$state,
        updateConfig: false,
        running: false,
      });
      worker.postMessage({ type: "UPDATE_CONFIG", value: $config });
    }
  }
</script>

<main>
  <Navbar />
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <div class="content">
          <div class="flex-row">
            <InstanceSelector />
            <button
              class="btn btn-light small-btn"
              type="button"
              on:click={configForm.toggle}
            >
              <GearIcon />
            </button>
          </div>
          <ConfigForm bind:this={configForm} />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="content">
        <Map bind:this={map} />
      </div>
    </div>
  </div>
</main>

<style>
  .container {
    margin-top: 10px;
  }
  @media (min-width: 576px) {
    .container {
      margin-top: 20px;
    }
  }

  .col-lg-6 {
    padding: 0;
  }

  button {
    padding: 6px;
    display: flex;
    align-items: center;
  }
  .flex-row {
    display: flex;
    align-items: flex-end;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
