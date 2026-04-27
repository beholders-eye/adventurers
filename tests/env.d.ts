export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_USER: string;
      API_PWD: string;
    }
  }
}
