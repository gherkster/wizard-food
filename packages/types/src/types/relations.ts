export type UUID = string;

export type RelationBlockAttrs = {
  id: UUID;
  junction: string;
  collection: string;
};

/** The tiptap editor extension addAttributes type */
export type EditorDefaultAttributes<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    default: null;
  };
};
