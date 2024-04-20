import { writable } from 'svelte/store';
import { dev } from '$app/environment';

export const debugMode = writable(dev);
