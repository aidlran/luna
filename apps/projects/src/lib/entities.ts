import { createSignal, type Accessor, type Signal } from 'solid-js';

export interface Entity {
  name: Signal<string>;
  completed: Signal<boolean>;
  start: Signal<string | undefined>;
  end: Signal<string | undefined>;
  created: number;
  updated: Signal<number>;
  blocked: Accessor<boolean>;
}

export interface EntityPojo {
  name: string;
  completed: boolean;
  start?: string;
  end?: string;
  created: number;
  updated: number;
}

export type EntityDependency = [dependent: Entity, dependee: Entity];

export const [entities, setEntities] = createSignal<Entity[]>([]);

export const [entityDependencies, setEntityDependencies] = createSignal<EntityDependency[]>([]);

export function objectToEntity(entityPojo: Partial<EntityPojo>): Entity {
  const entity: Entity = {
    name: createSignal(entityPojo.name ?? ''),
    completed: createSignal(entityPojo.completed ?? false),
    start: createSignal(entityPojo.start),
    end: createSignal(entityPojo.end),
    created: entityPojo.created ?? Date.now(),
    updated: createSignal(entityPojo.updated ?? Date.now()),
    blocked: () =>
      entityDependencies().some(
        ([dependent, dependee]) =>
          dependent === entity && (!dependee.completed[0]() || dependee.blocked()),
      ),
  };

  return entity;
}
