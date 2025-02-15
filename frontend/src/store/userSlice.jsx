import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {
    userId: null,
    email: null,
    nickname: null,
    gender: null,
    snsAccount: false,
    role: null,
    isActive: false,
    profileImagePath: null,
    isLogin: false,
  },
  reducers: {
    // 로그인
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    // 로그아웃
    clearUser: (state) => {
      return user.getInitialState();
    },
    // 업데이트
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { setUser, clearUser, updateUserField } = user.actions;
export default user.reducer;
