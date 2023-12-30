import type { App } from './app-select/app';

export type AppID = 'pass' | 'projects' | 'sessions';

export const APPS: App<AppID>[] = [
  {
    id: 'pass',
    name: 'LUNA Pass',
    path: '/pass/',
  },
  {
    id: 'projects',
    name: 'LUNA Projects',
    path: '/projects/',
    devOnly: true,
  },
  {
    id: 'sessions',
    name: 'Session',
    path: '/session/',
    devOnly: true,
  },
];
