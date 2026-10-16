import { useState, type ReactNode } from "react";
import type { AccountType } from "../services/auth.services.ts";
import { Person } from "../types/person.class.ts";
import { AuthContext } from "./AuthContext.tsx";

function AuthProvider({children}:{ children:ReactNode}){
    const [user, setCurrentUser] = useState<Person|null>(null);
    const [accountType, setaccountType] = useState<AccountType|null>(null);
    const value = {
        user,
        accountType,
        setUser: (authtenticatedUser:Person, authenticatedAccountType: AccountType)=>{
            setCurrentUser(authtenticatedUser);
            setaccountType(authenticatedAccountType);
        },
        logout: ()=>{
            setCurrentUser(null);
            setaccountType(null);
        }
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider;