export type Options = {
  cloudflareAccountId: string;
  deployHookUrl: string;
};

export type DeployHookResponse = {
  success: boolean;
  errors: string[];
  messages: string[];
  result: {
    build_uuid: string;
    status: string;
    created_on: string;
    already_exists: boolean;
  };
};

export type BuildStatusResponse = {
  success: boolean;
  errors: string[];
  messages: string[];
  result: {
    id: string;
    status: string;
    created_on: string;
  };
};

export type BuildLogsResponse = {
  success: boolean;
  errors: string[];
  messages: string[];
  result: {
    data: string;
  };
};

export type Logger = {
  info(message: string): void;
  error(message: string): void;
};
