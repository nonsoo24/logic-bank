import { api } from "@/shared/api/client";


export const verifyAccount = async (accountNumber: string) => {
  const res = await api.post("/verify-account", { accountNumber });
  return res.data;
};