// prettier-ignore
import { ContentIdentifier, File, getContent, putImmutable, type ContentIdentifierLike } from '@astrobase/core';
// prettier-ignore
import { array, instance, integer, literal, number, object, optional, parse, pipe, string, type InferOutput } from 'valibot';

const entitySchema = object({
  name: optional(string()),
  children: optional(array(instance(ContentIdentifier))),
  parent: optional(instance(ContentIdentifier)),
  previous: optional(instance(ContentIdentifier)),
  deps: optional(array(instance(ContentIdentifier))),
  start: optional(pipe(number(), integer())),
  end: optional(pipe(number(), integer())),
  updated: optional(pipe(number(), integer())),
  version: literal(1),
});

type EntityContent = InferOutput<typeof entitySchema>;

const toD = (ts?: number) => (ts ? new Date(ts * 1e3) : undefined);
const toTS = (d?: Date) => (d ? Math.floor(d.getTime() / 1e3) : undefined);

export class Entity {
  name = $state<string>();
  children = $state<ContentIdentifier[]>([]);
  childrenEnt = $derived<Entity[]>(this.children.map((cid) => new Entity(cid)));
  parent = $state<ContentIdentifier>();
  dependencies = $state<ContentIdentifier[]>([]);
  start = $state<Date>();
  end = $state<Date>();
  created = $state<Date>();
  updated = $state<Date>();

  protected _cid = $state<ContentIdentifier>();
  protected _previous = $state<ContentIdentifier>();

  readonly selfLoaded;

  constructor(cid?: ContentIdentifierLike) {
    if (cid) {
      this.selfLoaded = this.pull(cid);
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
    this._previous = this._cid;
    return (this._cid = cid);
  }
}
