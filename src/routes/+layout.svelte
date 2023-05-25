<script>
  import '../styles.css';
  import { inject } from '@vercel/analytics';
  import { dev } from '$app/environment';
  import { initServices } from '$lib/client/utils/services';

  // Make services available for DI
  initServices();

  // Inject @vercel/analytics
  inject({ mode: dev ? 'development' : 'production' });
</script>

<slot />
