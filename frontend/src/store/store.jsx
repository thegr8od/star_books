import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 로컬 스토리지 사용
import userReducer from "./userSlice";

// persist 설정
const persistConfig = {
  key: "root", // 로컬 스토리지에 저장될 때의 key 값
  storage: storage, // 사용할 스토리지 (local storage)
};

// 리듀서와 persist 설정을 결합
const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // persist 관련 액션 무시
      },
    }),
});
