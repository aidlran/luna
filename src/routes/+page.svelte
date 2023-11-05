<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  goto(`board${$page.url.hash}`);
</script>
