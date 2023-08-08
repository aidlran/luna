export type OptionalID<T extends { id: string }> = Omit<T, 'id'> & { id?: string };
