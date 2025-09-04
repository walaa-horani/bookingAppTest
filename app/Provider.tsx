"use client"
import axios from "axios";
import React, { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; 
import { Toaster } from "sonner";
import Header from "./_components/Header";

interface ProviderProps {
  children: ReactNode;
}

interface UserType {
  id: string;
  fullName?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
}

function Provider({ children }: ProviderProps) {
  const { user } = useUser(); 

  useEffect(() => {
    if (user) createNewUser();
  }, [user]);

  const createNewUser = async () => {
    if (!user) return;

    try {
      const result = await axios.post("/api/user", {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        userId: user.id,
      });

      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  return <div>
       
         <Header/>
    {children}
     <Toaster />
    </div>;
}

export default Provider;
