export interface IBaseResponse {
  error?: {
    date: string;
    status: boolean;
    message: string;
  };
  date?: string;
  status?: boolean;
  message: string;
}
