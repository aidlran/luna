<script>
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';
  import { initServices } from '$lib/client';
  initServices();
  inject({ mode: dev ? 'development' : 'production' });
</script>

<slot />
