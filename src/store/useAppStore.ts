// store/appStore.ts
import { create } from "zustand";
import { addDays, subDays, format } from "date-fns";

interface AppState {
  loginInfo: any;
  setLoginInfo: (info: any) => void;

  date: Date;
  setDate: (date: Date) => void;
  goPrevDate: () => void;
  goNextDate: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  loginInfo: (() => {
    const authStr =
      typeof window !== "undefined"
        ? localStorage.getItem("quizbells-auth")
        : null;
    return authStr ? JSON.parse(authStr) : {};
  })(),
  setLoginInfo: (info) => set({ loginInfo: info }),

  date: new Date(),
  setDate: (date) => set({ date }),
  goPrevDate: () => {
    set((state) => ({ date: subDays(state.date, 1) }));
  },
  goNextDate: () => {
    const today = new Date();
    const current = get().date;
    if (format(current, "yyyy-MM-dd") !== format(today, "yyyy-MM-dd")) {
      set({ date: addDays(current, 1) });
    }
  },
}));
