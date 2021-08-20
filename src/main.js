import App from './App.svelte';

import wasm from '../../hybridcvrp/Cargo.toml';


const init = async () => {
  const hybridcvrp = await wasm();

  new App({
    target: document.body,
    props: {
      hybridcvrp,
    }
  });

};

init();