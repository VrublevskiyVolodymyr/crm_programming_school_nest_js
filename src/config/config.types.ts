export type Config = {
  app: AppConfig;
  mysql: MysqlConfig;
  jwt: JwtConfig;
  action: ActionConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type MysqlConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};

export type ActionConfig = {
  actionSetPasswordSecret: string;
  actionSetPasswordExpiration: number;
};
