<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  if (browser) {
    goto(`pass/${$page.url.hash}`, {
      replaceState: true,
    });
  }
</script>
