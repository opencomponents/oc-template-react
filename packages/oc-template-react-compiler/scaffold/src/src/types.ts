export interface OcParameters {
  userId: number;
  getMoreData?: boolean;
}

export interface AdditionalData {
  hobbies: string[];
  age: number;
}

export interface ClientProps extends Partial<AdditionalData> {
  userId: number;
  firstName: string;
  lastName: string;
}
