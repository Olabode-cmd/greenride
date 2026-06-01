import axios from "axios";
import { AuthUser } from "../types";
import { tokenStore } from "./token-store";

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const { data } = await axios.post<AuthUser>(
    "https://dummyjson.com/auth/login",
    { username, password, expiresInMins: 30 },
    { headers: { "Content-Type": "application/json" } },
  );

  tokenStore.setTokens(data.accessToken, data.refreshToken);
  return data;
}
