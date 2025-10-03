// types.ts
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  PhoneVerificationScreen: { userData: any };
  CodeVerificationScreen: { userData: any; phoneNumber: string };
  ForgotPasswordScreen: undefined;
  PasswordRecoveryCodeScreen: { recoveryMethod: string; contactInfo: string };
  NewPasswordScreen: {
    recoveryMethod: string;
    contactInfo: string;
    verificationCode: string;
  };
  MainTabs: undefined;
  Category: undefined;
  ProfileComponent: undefined;
  NotificationsComponent: undefined;
  LocationScreen: undefined;
  AccountScreen: undefined;
  PendenciasScreen: undefined;
  SettingsScreen: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Agenda: undefined;
  Favorites: undefined;
  Perfil: undefined;
};
