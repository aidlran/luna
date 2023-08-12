<script>
  import '../styles.css';
  import { initServices } from '$lib/client/utils/services';

  // Make services available for DI
  initServices();
</script>

<slot />
