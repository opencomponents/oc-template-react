import React from 'react';

const DataContext = React.createContext<any>({});

type Data<T = any> = T & {
  getData(parameters: T, cb: (err: Error | null, data: any) => void): void;
  getSetting(setting: 'name' | 'version' | 'baseUrl' | 'staticPath'): string;
};

type PromiseData<T = any> = T & {
  getData<O = any>(parameters?: Partial<T>): Promise<O>;
  getSetting(setting: 'name' | 'version' | 'baseUrl' | 'staticPath'): string;
};

export const DataProvider = ({ children, ...props }: any) => {
  return <DataContext.Provider value={props}>{children}</DataContext.Provider>;
};

export function useData<T = any>(): PromiseData<T> {
  const {
    value: { getData, ...rest }
  }: { value: Data<T> } = React.useContext(DataContext);
  const asyncGetData = React.useCallback(<O = any, I = any>(data: I) => {
    return new Promise<O>((resolve, reject) => {
      // @ts-ignore
      getData({ ...rest, ...data }, (err, newData) => {
        if (err) {
          reject(err);
        } else {
          resolve(newData);
        }
      });
    });
  }, []);

  // @ts-ignore
  return { getData: asyncGetData, ...rest };
}
