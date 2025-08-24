<script lang="ts">
  import { setContext } from 'svelte';
  import { type Writable, writable } from 'svelte/store';
  import { page } from '$app/stores';

  const fragmentParamStores: Partial<Record<string, Writable<string | undefined>>> = {};

  $: for (const param of $page.url.hash.slice(1).split('&')) {
    if (!param) continue;
    const [key, value] = param.split('=');
    (fragmentParamStores[key] ??= writable()).set(value);
  }

  function writeFragment() {
    let hash = '';
    let once = false;
    for (const [key, store] of Object.entries(fragmentParamStores)) {
      if (key && store) {
        store.subscribe((value) => {
          if (value) {
            if (once) hash += '&';
            hash += `${key}=${value}`;
            once = true;
          }
        })();
      }
    }
    window.location.hash = hash;
  }

  function fragmentParam(key: string): Writable<string | undefined> {
    const { subscribe, set, update } = (fragmentParamStores[key] ??= writable());
    return {
      subscribe,
      set(value) {
        set(value);
        writeFragment();
      },
      update(updater) {
        update(updater);
        writeFragment();
      },
    };
  }

  setContext('fragmentParam', fragmentParam);
</script>

<slot />
