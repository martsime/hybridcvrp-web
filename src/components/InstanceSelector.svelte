<script>
  import { instances, fetchInstance } from "../instances";

  let selectedInstanceName;

  async function onChange() {
    let instance = await fetchInstance(selectedInstanceName);
  }
</script>

<select
  bind:value={selectedInstanceName}
  on:change={onChange}
  class="form-select"
>
  <option selected disabled>Please select instance</option>
  {#each instances as instance}
    <option value={instance}>{instance}</option>
  {/each}
</select>
