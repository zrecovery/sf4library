export type PostMessage = {
  type: string;
  messageId?: string;
  dbId?: string;
  args: OpenPostType | ExecPostType;
};

export type OpenPostType = {
  filename: string;
  vfs: string;
};

export type ExecPostType = {
  sql: string;
  rowMode?: string;
  returnValue?: string;
  bind?: Array<string | number>;
};

export type OpenResultType = {
  filename: string;
  dbId: string;
  persistent: boolean;
  vfs: string;
};

export type ExecResultType = {
  sql: string;
  resultRows: Array<unknown>;
  callback: string;
  columnNames: string;
  rowMode: string;
  returnValue: string;
};

export type MsgType<T> = {
  type: "string";
  messageId?: string;
  result: T;
};

export type ErrType = {
  type: string;
  messageId?: string;
  dbId?: string;
  result: {
    operation: string;

    message: string;

    errorClass: string;

    input: string;

    stack: Array<string>;
  };
};
