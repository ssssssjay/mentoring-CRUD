/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ADDRESS: string;
  // 다른 환경 변수들에 대한 타입 정의...
}

interface ImportMeta extends ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
