import {
  ContentIdentifier,
  File,
  getContent,
  putImmutable,
  type ContentIdentifierLike,
} from '@astrobase/core';

export interface EntityContent {
  name?: string;
  children?: ContentIdentifier[];
  parent?: ContentIdentifier;
}

export abstract class Entity {
  name = $state<string>();
  parent = $state<ContentIdentifier>();
  children = $state<ContentIdentifier[]>();
  created = $state<Date>();

  protected get file() {
    return new File()
      .setMediaType('application/json')
      .setTimestamp(this.created ? Math.floor(this.created.getTime() / 1e3) : undefined)
      .setValue({ name: this.name, children: this.children, parent: this.parent, version: 1 });
  }

  protected async parse(file?: File<EntityContent>) {
    const ent = (await file?.getValue()) as EntityContent | undefined;
    if (ent) {
      this.name = ent.name;
      this.children = ent.children;
      this.parent = ent.parent;
      const ts = file?.timestamp;
      if (ts) {
        this.created = new Date(ts * 1e3);
      }
    }
  }
}

export class ImmutableEntity extends Entity {
  private _cid = $state<ContentIdentifier>();

  constructor(cid?: ContentIdentifierLike) {
    super();
    if (cid) {
      this.pull(cid);
    }
  }

  private async pull(cid: ContentIdentifierLike) {
    const file = (await getContent(cid)) as File<EntityContent> | undefined;
    await this.parse(file);
    this._cid = new ContentIdentifier(cid);
  }

  /**
   * The entity's content identifier. The entity needs to be successfully saved before this value is
   * defined.
   */
  get cid() {
    return this._cid;
  }

  async save() {
    return (this._cid = await putImmutable(await this.file));
  }
}
