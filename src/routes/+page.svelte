<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  if (browser) {
    goto(`board${$page.url.hash}`, {
      replaceState: true,
    });
  }
</script>
