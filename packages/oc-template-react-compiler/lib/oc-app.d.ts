interface OC {
  conf: {
    templates: Array<{
      type: string;
      externals: string[];
    }>;
  };
  cmd: {
    push: (cb: (oc: OC) => void) => void;
  };
  events: {
    on: (eventName: string, fn: (...data: any[]) => void) => void;
    off: (eventName: string, fn?: (...data: any[]) => void) => void;
    fire: (eventName: string, data?: any) => void;
    reset: () => void;
  };
  renderNestedComponent: (ocElement: HTMLElement, cb: () => void) => void;
}

declare global {
  interface Window {
    oc: OC;
  }

  namespace JSX {
    interface IntrinsicElements {
      'oc-component': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { href: string },
        HTMLElement
      >;
    }
  }
}

export interface AcceptLanguage {
  code: string;
  script?: any;
  region: string;
  quality: number;
}

export interface Env {
  name: string;
}

export interface Plugins {}

export interface External {
  global: string;
  url: string;
  name: string;
}

export interface Template {
  type: string;
  version: string;
  externals: External[];
}

export interface Context<T = any, E = Env> {
  acceptLanguage: AcceptLanguage[];
  baseUrl: string;
  env: E;
  params: T;
  plugins: Plugins;
  requestHeaders: Record<string, string>;
  requestIp: string;
  setEmptyResponse: () => void;
  setHeader: (header: string, value: string) => void;
  staticPath: string;
  templates: Template[];
}
