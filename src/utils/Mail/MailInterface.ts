export interface MailModuleOptions {
  API_KEY: string;
  DOMAIN: string;
  FROM_EMAIL: string;
}

export interface EmailVariables {
  code: string;
  email: string;
}
