<script>
  import { inject } from '@vercel/analytics';
  import { dev } from '$app/environment';
  import { initServices } from '$lib/client';
  initServices();
  inject({ mode: dev ? 'development' : 'production' });
</script>

<slot />
