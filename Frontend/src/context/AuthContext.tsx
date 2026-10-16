import { createContext } from "react";
import type { AccountType } from "../services/auth.services.ts";
import type { Person } from "../types/person.class.ts";
interface AuthContextValue{
    user: Person | null;
    accountType: AccountType | null;
    setUser: (user: Person, accountType: AccountType) =>void;
    logout: ()=>void;
}
export const AuthContext = createContext<AuthContextValue | null>(null);
