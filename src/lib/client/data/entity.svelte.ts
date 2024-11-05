import { ContentIdentifier } from '@astrobase/core';

export interface Entity {
  name?: string;
  parent?: ContentIdentifier;
  children?: ContentIdentifier[];
}
