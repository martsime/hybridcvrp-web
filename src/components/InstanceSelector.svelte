<script>
  import { instances, fetchInstance, fetchSolution } from "../instances";
  import { instance, solution, state, time } from "../stores";

  let selectedInstanceName;

  export async function loadInstance() {
    const fetchedInstance = await fetchInstance(selectedInstanceName);
    state.set({
      loaded: false,
      reset: true,
    });
    instance.set(fetchedInstance);
  }
</script>

<select
  bind:value={selectedInstanceName}
  on:change={loadInstance}
  class="form-select"
  id="problemInstance"
>
  <option selected disabled>Please select instance</option>
  {#each instances as instance}
    <option value={instance}>{instance}</option>
  {/each}
</select>

<style>
  select {
    flex-grow: 1;
  }
  .form-select {
    width: auto;
    margin-right: 10px;
  }
</style>
