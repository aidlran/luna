// prettier-ignore
import { ContentIdentifier, File, getContent, putImmutable, type ContentIdentifierLike } from '@astrobase/core';
import { SvelteMap } from 'svelte/reactivity';
// prettier-ignore
import { array, boolean, instance, integer, literal, number, object, optional, parse, pipe, string, type InferOutput } from 'valibot';

const cidSchema = instance(ContentIdentifier);
const optCidSchema = optional(cidSchema);
const optCidArrSchema = optional(array(cidSchema));
const optIntSchema = optional(pipe(number(), integer()));

const entitySchema = object({
  name: optional(string()),
  completed: boolean(),
  children: optCidArrSchema,
  parent: optCidSchema,
  previous: optCidSchema,
  deps: optCidArrSchema,
  start: optIntSchema,
  end: optIntSchema,
  updated: optIntSchema,
  version: literal(1),
});

type EntityContent = InferOutput<typeof entitySchema>;

const toD = (ts?: number) => (ts ? new Date(ts * 1e3) : undefined);
const toTS = (d?: Date) => (d ? Math.floor(d.getTime() / 1e3) : undefined);

export const entities = new SvelteMap<string, Entity>();

export class Entity {
  name = $state<string>();
  completed = $state<boolean>(false);
  children = $state<ContentIdentifier[]>([]);
  childrenEnt = $derived<Entity[]>(this.children.map(getEntity));
  parent = $state<ContentIdentifier>();
  dependencies = $state<ContentIdentifier[]>([]);
  dependenciesEnt = $derived<Entity[]>(this.dependencies.map(getEntity));
  blocked = $derived<boolean>(
    // TODO: fix async issues
    !!this.dependencies.length && !!this.dependenciesEnt.find((ent) => !ent.completed),
  );
  start = $state<Date>();
  end = $state<Date>();
  created = $state<Date>();
  updated = $state<Date>();

  protected _cid = $state<ContentIdentifier>();
  protected _previous = $state<ContentIdentifier>();

  readonly loaded;

  constructor(cid?: ContentIdentifierLike) {
    if (cid) {
      this.loaded = this.pull(cid);
    }
  }

  /**
   * The entity's content identifier. The entity needs to be successfully saved before this value is
   * defined.
   */
  get cid() {
    return this._cid;
  }

  get previous() {
    return this._previous;
  }

  get version() {
    return 1 as const;
  }

  protected async pull(cid: ContentIdentifierLike) {
    this._cid = cid = new ContentIdentifier(cid);
    const file = await getContent<File<EntityContent>>(cid);
    const ent = parse(entitySchema, await file?.getValue());
    if (ent) {
      this.name = ent.name;
      this.completed = ent.completed;
      this.children = ent.children ?? [];
      this.parent = ent.parent;
      this._previous = ent.previous;
      this.dependencies = ent.deps ?? [];
      this.start = toD(ent.start);
      this.end = toD(ent.end);
      this.created = toD(file?.timestamp);
      this.updated = toD(ent.updated);
    }
  }

  async save() {
    const file = await new File<EntityContent>()
      .setMediaType('application/json')
      .setTimestamp(toTS(this.created))
      .setValue({
        name: this.name,
        completed: this.completed,
        children: this.children,
        parent: this.parent,
        previous: this._cid,
        deps: this.dependencies,
        start: toTS(this.start),
        end: toTS(this.end),
        updated: toTS(new Date()),
        version: this.version,
      });
    const cid = await putImmutable(file);
    entities.set(cid.toString(), this);
    if ((this._previous = this._cid)) {
      entities.delete(this._cid.toString());
    }
    return (this._cid = cid);
  }
}

export function getEntity(cid: ContentIdentifierLike) {
  cid = new ContentIdentifier(cid).toString();
  let ent = entities.get(cid);
  if (!ent) {
    ent = new Entity(cid);
    // because updating state inside a derived or a template expression is forbidden...
    queueMicrotask(() => {
      if (ent) {
        entities.set(cid, ent);
      }
    });
  }
  return ent;
}
