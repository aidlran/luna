import type { ContentIdentifier } from '@astrobase/sdk/cid';
import { CryptOptions } from '@astrobase/sdk/crypt';
import { deleteImmutable } from '@astrobase/sdk/immutable';
import { createEffect, createSignal, type Accessor, type Signal } from 'solid-js';
import { get, getIndex, put, saveIndex } from '../../../../lib/luna/content.mjs';
import { instance, keyringUnlocked, selectedKeyring } from './astrobase';

export interface Entity {
  name: Signal<string>;
  completed: Signal<boolean>;
  start: Signal<string | undefined>;
  end: Signal<string | undefined>;
  created: number;
  updated: Signal<number>;

  cid: Signal<ContentIdentifier | undefined>;

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
  cid: ContentIdentifier;
}

export type EntityDependency = [dependent: Entity, dependee: Entity];

const identityID = 'luna-projects';

export const cryptOverrides: Partial<CryptOptions> = {
  encAlg: 'XChaCha20-Poly1305',
  nonce: crypto.getRandomValues(new Uint8Array(24)),
};

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

    cid: createSignal(entityPojo.cid),

    dependencies: () => entityDependencies().filter(([dependent]) => dependent === entity),

    blocked: () =>
      entity.dependencies().some(([, dependee]) => !dependee.completed[0]() || dependee.blocked()),
  };

  return entity;
}

export const saveRoot = async () =>
  saveIndex(
    instance()!,
    identityID,
    {
      entities: await Promise.all(entities().map(({ cid }) => cid[0]())),
      dependencies: await Promise.all(
        entityDependencies().map(([a, b]) => Promise.all([a.cid[0](), b.cid[0]()])),
      ),
    },
    cryptOverrides,
  );

async function saveEntity(entity: Entity) {
  const config = instance()!;

  const cid = await put(
    config,
    identityID,
    {
      name: entity.name[0](),
      completed: entity.completed[0](),
      start: entity.start[0](),
      end: entity.end[0](),
      created: entity.created,
      updated: entity.updated[0](),
    },
    undefined,
    cryptOverrides,
  );

  entity.cid[1](cid);

  saveRoot();
}

export async function createEntity(entityPojo: Partial<EntityPojo>) {
  const entity = objectToEntity(entityPojo);
  setEntities((entities) => [entity, ...entities]);
  saveEntity(entity);
}

export async function updateEntity(entity: Entity, update?: () => unknown, force?: boolean) {
  const originalCID = entity.cid[0]();

  update?.();

  const newCID = entity.cid[0]();

  if (force !== true && originalCID && newCID && newCID.toString() === originalCID.toString()) {
    return;
  }

  entity.updated[1](Date.now());

  const config = instance()!;

  saveEntity(entity);

  if (originalCID) {
    deleteImmutable(config, originalCID.value);
  }
}

createEffect(async () => {
  const config = instance();

  if (!config || !keyringUnlocked() || selectedKeyring() === undefined) {
    return;
  }

  let root: {
    entities: ContentIdentifier[];
    dependencies: [ContentIdentifier, ContentIdentifier][];
  };

  try {
    root = (await getIndex(config, identityID)) as {
      entities: ContentIdentifier[];
      dependencies: [ContentIdentifier, ContentIdentifier][];
    };
  } catch (e) {
    if (e instanceof RangeError && e.message === 'Identity not found') {
      return saveRoot();
    }
    throw e;
  }

  if (root) {
    const entityMap: Record<string, Promise<Entity>> = {};

    const loadEntity = async (cid: ContentIdentifier) =>
      (entityMap[cid.toString()] ??= (get(config, cid) as Promise<EntityPojo>).then((pojo) =>
        objectToEntity({ ...pojo, cid }),
      ));

    await Promise.all([
      Promise.all(root.entities.map(loadEntity)).then(setEntities),

      Promise.all(
        root.dependencies.map(([a, b]) => Promise.all([loadEntity(a), loadEntity(b)])),
      ).then(setEntityDependencies),
    ]);
  }
});
