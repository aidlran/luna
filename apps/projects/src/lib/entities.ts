import type { ContentIdentifier } from '@astrobase/sdk/cid';
import { getContent } from '@astrobase/sdk/content';
import { FileBuilder } from '@astrobase/sdk/file';
import { hash, SHA_256 } from '@astrobase/sdk/hashing';
import { deleteImmutable, putImmutable, toImmutableCID } from '@astrobase/sdk/immutable';
import { getMutable, putMutable } from '@astrobase/sdk/mutable';
import { createEffect, createSignal, type Accessor, type Signal } from 'solid-js';
import astrobaseMergedConfig from './astrobase-merged-config';

export interface Entity {
  name: Signal<string>;
  completed: Signal<boolean>;
  start: Signal<string | undefined>;
  end: Signal<string | undefined>;
  created: number;
  updated: Signal<number>;

  file: Accessor<Promise<FileBuilder>>;
  cid: Accessor<Promise<ContentIdentifier>>;

  dependencies: Accessor<EntityDependency[]>;
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

    file() {
      const config = astrobaseMergedConfig()!;
      return new FileBuilder().setMediaType('application/json').setValue(
        {
          name: entity.name[0](),
          completed: entity.completed[0](),
          start: entity.start[0](),
          end: entity.end[0](),
          created: entity.created,
          updated: entity.updated[0](),
        },
        config,
      );
    },

    async cid() {
      const config = astrobaseMergedConfig()!;
      const file = entity.file();
      return toImmutableCID(await hash(config, SHA_256, (await file).buffer));
    },

    dependencies: () => entityDependencies().filter(([dependent]) => dependent === entity),

    blocked: () =>
      entity.dependencies().some(([, dependee]) => !dependee.completed[0]() || dependee.blocked()),
  };

  return entity;
}

export async function saveRoot() {
  const instance = astrobaseMergedConfig()!;
  return putMutable(
    'luna-projects',
    await new FileBuilder().setMediaType('application/json').setValue(
      {
        entities: await Promise.all(entities().map(({ cid }) => cid())),
        dependencies: await Promise.all(
          entityDependencies().map(([a, b]) => Promise.all([a.cid(), b.cid()])),
        ),
      },
      instance,
    ),
    { instance },
  );
}

async function saveEntity(entity: Entity) {
  const instance = astrobaseMergedConfig()!;

  const [cid] = await Promise.all([putImmutable(await entity.file(), { instance }), saveRoot()]);

  return cid;
}

export async function createEntity(entityPojo: Partial<EntityPojo>) {
  const entity = objectToEntity(entityPojo);

  setEntities((entities) => [entity, ...entities]);

  return saveEntity(entity);
}

export async function updateEntity(entity: Entity, update?: () => unknown, force?: boolean) {
  const originalCID = await entity.cid();

  update?.();

  if (force !== true && (await entity.cid()).toString() === originalCID.toString()) {
    return;
  }

  entity.updated[1](Date.now());

  const instance = astrobaseMergedConfig()!;

  const [cid] = await Promise.all([
    saveEntity(entity),
    deleteImmutable(instance, originalCID.value),
  ]);

  return cid;
}

createEffect(async () => {
  const instance = astrobaseMergedConfig();

  if (!instance) {
    return;
  }

  const rootFile = await getMutable('luna-projects', instance);

  if (rootFile) {
    const rootValue = (await rootFile.getValue(instance)) as {
      entities: ContentIdentifier[];
      dependencies: [ContentIdentifier, ContentIdentifier][];
    };

    const entityMap: Record<string, Promise<Entity>> = {};

    const loadEntity = async (cid: ContentIdentifier) =>
      (entityMap[cid.toString()] ??= getContent<FileBuilder<EntityPojo>>(cid, instance)
        .then((file) => file?.getValue(instance) as Promise<EntityPojo>)
        .then(objectToEntity));

    Promise.all(rootValue.entities.map(loadEntity)).then(setEntities);

    Promise.all(
      rootValue.dependencies.map(([a, b]) => Promise.all([loadEntity(a), loadEntity(b)])),
    ).then(setEntityDependencies);
  }
});
