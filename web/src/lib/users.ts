export type ThemeSetting = "light" | "dark" | "system";

export type UserSettings = {
  theme: ThemeSetting;
  notificationsEnabled: boolean;
};

export type UserProfile = {
  uid: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  displayName: string;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
};
