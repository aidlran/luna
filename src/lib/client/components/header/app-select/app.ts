export interface App<T extends string = string> {
  id: T;
  name: string;
  path: string;
  devOnly?: boolean;
}
