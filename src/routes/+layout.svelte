<script>
  import '$lib/client/styles/global.styles.css';
  import { inject } from '@vercel/analytics';
  import { dev } from '$app/environment';
  import { initServices } from '$lib/client/utils/services';
  initServices();
  inject({ mode: dev ? 'development' : 'production' });
</script>

<slot />
