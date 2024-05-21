<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { APPS } from '$lib/client/components/header/apps';

  if (browser) {
    goto(APPS.find(({ id }) => id === 'projects').path, {
      replaceState: true,
    });
  }
</script>
