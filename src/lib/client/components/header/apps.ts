import type { App } from './app-select/app';

export type AppName = 'pass' | 'projects' | 'sessions';

export const APPS: App<AppName>[] = [
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
    name: 'My Sessions',
    path: '/session/',
    devOnly: true,
  },
];
