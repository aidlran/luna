import type { App } from './app-select/app';

export type AppID = 'pass' | 'projects' | 'sessions';

export const APPS: App<AppID>[] = [
  {
    id: 'pass',
    name: 'Pass',
    path: '/pass/',
    devOnly: true,
  },
  {
    id: 'projects',
    name: 'TODOs',
    path: '/projects/',
  },
  {
    id: 'sessions',
    name: 'Sessions',
    path: '/session/',
  },
];
