<script>
  import { onMount } from "svelte";

  export let hybridcvrp;

  import Navbar from "./components/Navbar.svelte";
  import InstanceSelector from "./components/InstanceSelector.svelte";
</script>

<main>
  <Navbar />
  <InstanceSelector />
</main>
