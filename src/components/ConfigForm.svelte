<script>
  import { config, state } from "../stores";

  let show = false;
  let currentConfig = { ...$config };
  let isInvalid = {};

  export function toggle() {
    show = !show;
  }

  export function hide() {
    show = false;
  }

  function onSave() {
    // Check if all config values are valid
    let invalid = false;
    for (const prop in isInvalid) {
      if (isInvalid[prop]) {
        invalid = true;
      }
    }

    if (!invalid) {
      $config = { ...currentConfig };
      hide();
      dispatchReset();
    }
  }

  function dispatchReset() {
    state.set({
      ...$state,
      updateConfig: true,
      reset: true,
    });
  }

  function onCancel() {
    // Reset current config
    currentConfig = { ...$config };
    hide();
  }

  $: {
    // Validate initialIndividuals
    isInvalid.initialIndividuals =
      typeof currentConfig.initialIndividuals != "number" ||
      !Number.isInteger(currentConfig.initialIndividuals) ||
      currentConfig.initialIndividuals <= 0;

    // Validate minimumPopulationSize
    isInvalid.minimumPopulationSize =
      typeof currentConfig.minimumPopulationSize != "number" ||
      !Number.isInteger(currentConfig.minimumPopulationSize) ||
      currentConfig.minimumPopulationSize <= 0;

    // Validate generationSize
    isInvalid.generationSize =
      typeof currentConfig.generationSize != "number" ||
      !Number.isInteger(currentConfig.generationSize) ||
      currentConfig.generationSize <= 0;

    // Validate localSearchGranularity
    isInvalid.localSearchGranularity =
      typeof currentConfig.localSearchGranularity != "number" ||
      !Number.isInteger(currentConfig.localSearchGranularity) ||
      currentConfig.localSearchGranularity <= 0;

    // Validate numberOfElites
    isInvalid.numberOfElites =
      typeof currentConfig.numberOfElites != "number" ||
      !Number.isInteger(currentConfig.numberOfElites) ||
      currentConfig.numberOfElites <= 0;

    // Validate feasibilityProportionTarget
    isInvalid.feasibilityProportionTarget =
      typeof currentConfig.feasibilityProportionTarget != "number" ||
      currentConfig.feasibilityProportionTarget < 0.0 ||
      currentConfig.feasibilityProportionTarget > 1.0;

    // Validate RRStartTemp
    isInvalid.RRStartTemp =
      typeof currentConfig.RRStartTemp != "number" ||
      currentConfig.RRStartTemp < 1.0;

    // Validate RRGamma
    isInvalid.RRGamma =
      typeof currentConfig.RRGamma != "number" || currentConfig.RRGamma < 0.0;

    // Validate eliteStartTemp
    isInvalid.eliteStartTemp =
      typeof currentConfig.eliteStartTemp != "number" ||
      currentConfig.eliteStartTemp < 1.0;

    // Validate eliteGamma
    isInvalid.eliteGamma =
      typeof currentConfig.eliteGamma != "number" ||
      currentConfig.eliteGamma < 0.0;
  }
</script>

<div class="collapse content" class:show>
  <h3>Config</h3>
  <form>
    <div class="form-row row">
      <div class="form-group col-md-6">
        <label class="form-label" for="initial-individual-input">
          Initial Individuals
        </label>
        <input
          type="number"
          class="form-control"
          id="initial-individuals-input"
          bind:value={currentConfig.initialIndividuals}
          class:is-invalid={isInvalid.initialIndividuals}
        />
        <div class="invalid-feedback">Value must be positive integer.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="minimum-population-size-input"
          >Minimum Population Size</label
        >
        <input
          type="number"
          class="form-control"
          id="minimum-population-size-input"
          bind:value={currentConfig.minimumPopulationSize}
          class:is-invalid={isInvalid.minimumPopulationSize}
        />
        <div class="invalid-feedback">Value must be positive integer.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="generation-size-input">
          Generation Size
        </label>
        <input
          type="number"
          class="form-control"
          id="generation-size-input"
          bind:value={currentConfig.generationSize}
          class:is-invalid={isInvalid.generationSize}
        />
        <div class="invalid-feedback">Value must be positive integer.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="local-search-granularity-input">
          Local Search Granularity
        </label>
        <input
          type="number"
          class="form-control"
          id="local-search-granularity-input"
          bind:value={currentConfig.localSearchGranularity}
          class:is-invalid={isInvalid.localSearchGranularity}
        />
        <div class="invalid-feedback">Value must be positive integer.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="number-elites-input">
          Number of Elites
        </label>
        <input
          type="number"
          class="form-control"
          id="number-of-elites-input"
          bind:value={currentConfig.numberOfElites}
          class:is-invalid={isInvalid.numberOfElites}
        />
        <div class="invalid-feedback">Value must be positive integer.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="feasibility-proportion-target-input">
          Feasibility Proportion Target
        </label>
        <input
          type="number"
          step="0.01"
          max="1.0"
          min="0.0"
          class="form-control"
          id="feasibility-proportion-target-input"
          bind:value={currentConfig.feasibilityProportionTarget}
          class:is-invalid={isInvalid.feasibilityProportionTarget}
        />
        <div class="invalid-feedback">
          Value must be float between 0.0 and 1.0.
        </div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="rr-start-temp-input">
          R&R Start Temperature
        </label>
        <input
          type="number"
          class="form-control"
          id="rr-start-temp-input"
          bind:value={currentConfig.RRStartTemp}
          class:is-invalid={isInvalid.RRStartTemp}
        />
        <div class="invalid-feedback">Value must be number >= 1.0.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="rr-gamma-input"> R&R Gamma </label>
        <input
          type="number"
          class="form-control"
          step="0.1"
          min="0.0"
          id="rr-gamma-input"
          bind:value={currentConfig.RRGamma}
          class:is-invalid={isInvalid.RRGamma}
        />
        <div class="invalid-feedback">Value must be non-negative number.</div>
      </div>
      <div class="form-group extra-top-margin">
        <div class="form-check form-switch">
          <label class="form-check-label" for="elite-education-input"
            >Elite Education</label
          >
          <input
            class="form-check-input"
            type="checkbox"
            id="elite-education-input"
            bind:checked={currentConfig.eliteEducation}
          />
        </div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="elite-start-temp-input">
          Elite Education Start Temperature
        </label>
        <input
          type="number"
          class="form-control"
          id="elite-start-temp-input"
          bind:value={currentConfig.eliteStartTemp}
          class:is-invalid={isInvalid.eliteStartTemp}
        />
        <div class="invalid-feedback">Value must be number >= 1.0.</div>
      </div>
      <div class="form-group col-md-6">
        <label class="form-label" for="elite-gamma-input">Elite Gamma </label>
        <input
          type="number"
          class="form-control"
          id="elite-gamma-input"
          bind:value={currentConfig.eliteGamma}
          class:is-invalid={isInvalid.eliteGamma}
        />
        <div class="invalid-feedback">Value must be non-negative number.</div>
      </div>
    </div>
    <div class="form-buttons">
      <button type="button" class="btn btn-light" on:click={onCancel}
        >Cancel
      </button>
      <button type="button" class="btn btn-light" on:click={onSave}>Save</button
      >
    </div>
  </form>
</div>

<style>
  .form-group label {
    color: var(--text-color);
    padding-top: 10px;
  }

  h3 {
    color: var(--text-color);
    margin-bottom: 0;
  }

  .collapse.content {
    margin-top: 10px;
  }

  .form-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .form-buttons button {
    margin-top: 20px;
    margin-left: 10px;
  }

  .form-check-input {
    margin-top: 16px;
    margin-left: 5px;
    float: none;
  }
  .form-check {
    padding-left: 0;
  }

  .extra-top-margin {
    margin-top: 20px;
  }
</style>
