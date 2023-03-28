declare module 'oc-generic-template-compiler' {
  type Callback<T> = (err: Error | null, data?: T) => void;
  type CompiledViewInfo = any;

  type OcOptions = {
    files: {
      data: string;
      template: {
        src: string;
        type: string;
      };
      static: string[];
    };
  };

  type Options = {
    publishPath: string;
    componentPath: string;
    componentPackage: {
      name: string;
      version: string;
      dependencies: Record<string, string>;
      oc: OcOptions;
    };
    ocPackage: any;
    minify: boolean;
    verbose: boolean;
    production: boolean;
  };

  type CompileServer = (
    options: Options & { compiledViewInfo: CompiledViewInfo },
    cb: Callback<any>
  ) => void;
  type CompileView = (options: Options, cb: Callback<CompiledViewInfo>) => void;
  type CompileStatics = (options: Options, cb: Callback<'ok'>) => void;
  type GetInfo = () => {
    version: string;
  };

  export function createCompile(parameters: {
    compileView: CompileView;
    compileServer: CompileServer;
    compileStatics: CompileStatics;
    getInfo: GetInfo;
  }): (options: Options, cb: Callback<any>) => void;
}
