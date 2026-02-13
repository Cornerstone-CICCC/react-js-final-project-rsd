"use client";

import { useEffect } from "react";
import { useUser } from "@/app/store/user";

export default function UserLoader() {
  const setUser = useUser((s) => s.setUser);
  const clearUser = useUser((s) => s.clearUser);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/session");
      const data = await res.json();

      if (data.logged) {
        setUser({ _id: data.userId });
      } else {
        clearUser();
      }
    }

    load();
  }, []);

  return null;
}
