import { redirect } from '@sveltejs/kit';
import { sessionService } from '$lib/server/utils/context.js';

export function load({ cookies }) {
  sessionService.delete(cookies);
  throw redirect(303, '/login');
}
