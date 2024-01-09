import { defineStore } from "pinia";

// defineStroe(접근하는 고유아이디, 옵션들)
export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      token: "",
      loginId: "",
    };
  },
  persist: true,
  getters: {
    getUserData: (state) => {
      return { loginId: state.loginId, token: state.token };
    },
  },
  actions: {
    // 화살표함수는 this가 상위스코프의 영향을 받아서 그렇게 정의하지 않는다
    deleteToken() {
      this.token = "";
    },
    deleteLoginId() {
      this.loginId = "";
    },
    deleteUserData() {
      this.token = "";
      this.loginId = "";
    },
    setToken(token: string) {
      this.token = token;
    },
    setLoginId(loginId: string) {
      this.loginId = loginId;
    },
    setUserData({ token, loginId }: { token: string; loginId: string }) {
      this.token = token;
      this.loginId = loginId;
    },
  },
});
