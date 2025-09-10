export const AuthView = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
} as const;

export type AuthViewType = typeof AuthView[keyof typeof AuthView];