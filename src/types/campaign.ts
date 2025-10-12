export type Campaign = {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    Active?: boolean;
  };
};