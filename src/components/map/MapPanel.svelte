<script>
  import { instance, solution, state, time } from "../../stores";

  import ResetZoomIcon from "../icons/ResetZoomIcon.svelte";
  import StartIcon from "../icons/StartIcon.svelte";
  import ResetIcon from "../icons/ResetIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";

  export let resetZoomHandler;

  let startButtonDisabled = true;
  let pauseButtonDisabled = true;
  let resetButtonDisabled = true;
  let resetZoomButtonDisabled = true;

  let startTime;
  let pauseTime;
  let timer;

  let timeLabel = 0.0;
  let costLabel = undefined;

  function startTimer() {
    if (startTime === undefined) {
      startTime = new Date();
    }
    if (pauseTime !== undefined) {
      const elapsed = new Date() - pauseTime;
      startTime = new Date(startTime.getTime() + elapsed);
      pauseTime = undefined;
    }
    timer = setInterval(() => {
      const elapsed = (new Date() - startTime) / 1000;
      $time = elapsed;
    }, 50);
  }

  function stopTimer() {
    pauseTime = new Date();
    clearInterval(timer);
  }

  $: {
    if ($state.running || !$state.loaded) {
      startButtonDisabled = true;
    } else {
      startButtonDisabled = false;
    }

    if ($state.running) {
      pauseButtonDisabled = false;
    } else {
      pauseButtonDisabled = true;
    }
  }

  $: {
    if ($solution.routes.length === 0) {
      resetButtonDisabled = true;
    } else {
      resetButtonDisabled = false;
      updateCostLabel();
    }
  }

  $: {
    if ($state.loaded) {
      resetZoomButtonDisabled = false;
    } else {
      resetZoomButtonDisabled = true;
    }
  }

  $: {
    if ($time !== undefined) {
      updateTimeLabel();
    }
  }

  function updateTimeLabel() {
    timeLabel = $time.toFixed(1);
  }

  function updateCostLabel() {
    if ($solution.cost) {
      const bks = $instance.bks;
      const gap = (($solution.cost - bks) / bks) * 100;
      costLabel = `${$solution.cost} (${gap.toFixed(2)}% from BKS)`;
    } else {
      costLabel = undefined;
    }
  }

  function startPauseClicked() {
    $state.running = !$state.running;
    if ($state.running) {
      startTimer();
    } else {
      stopTimer();
    }
  }

  export function reset() {
    stopTimer();
    startButtonDisabled = true;
    pauseButtonDisabled = true;
    resetButtonDisabled = true;
    startTime = undefined;
    pauseTime = undefined;
    updateCostLabel();
    updateTimeLabel();
  }

  function dispatchReset() {
    $state.reset = true;
  }
</script>

<div class="map-panel panel-top-right">
  <button
    class="btn btn-light"
    on:click={resetZoomHandler}
    class:disabled={resetZoomButtonDisabled}
  >
    <ResetZoomIcon />
  </button>
</div>

<div class="map-panel panel-top-left">
  <button
    class="btn btn-light small-btn"
    class:disabled={startButtonDisabled}
    on:click={startPauseClicked}
  >
    <StartIcon />
  </button>
  <button
    class="btn btn-light small-btn"
    class:disabled={pauseButtonDisabled}
    on:click={startPauseClicked}
  >
    <PauseIcon />
  </button>
  <button
    class="btn btn-light small-btn"
    class:disabled={resetButtonDisabled}
    on:click={dispatchReset}
  >
    <ResetIcon />
  </button>
  <p class="timer">Time: {timeLabel}s</p>
  <p class="cost">Cost: {costLabel ? costLabel : "----- (--% from BKS)"}</p>
</div>

<style>
  .map-panel {
    position: absolute;
    margin: 10px;
  }
  .panel-top-right {
    top: 0px;
    right: 0px;
  }

  .panel-top-left {
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .panel-top-left button:not(:first-child) {
    margin-left: 10px;
  }

  button {
    padding: 8px;
    display: flex;
    align-items: center;
  }

  .small-btn {
    padding: 4px 4px;
  }

  p {
    color: var(--text-color);
    padding: 0 10px 2px;
    margin-bottom: 0;
    font-size: 1.2rem;
  }

  .timer {
    padding-left: 20px;
  }

  @media only screen and (max-width: 768px) {
    p {
      font-size: 16px;
      padding: 10px 5px 12px;
    }

    .timer {
      padding-left: 10px;
    }
  }
</style>
