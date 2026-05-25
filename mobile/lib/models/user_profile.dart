class UserSettings {
  const UserSettings({
    required this.theme,
    required this.notificationsEnabled,
  });

  final String theme;
  final bool notificationsEnabled;

  factory UserSettings.fromJson(Map<String, dynamic> json) {
    return UserSettings(
      theme: json['theme'] as String? ?? 'system',
      notificationsEnabled: json['notificationsEnabled'] as bool? ?? true,
    );
  }
}

class UserProfile {
  const UserProfile({
    required this.uid,
    required this.email,
    required this.phone,
    required this.deliveryAddress,
    required this.displayName,
    required this.settings,
    required this.createdAt,
    required this.updatedAt,
  });

  final String uid;
  final String email;
  final String phone;
  final String deliveryAddress;
  final String displayName;
  final UserSettings settings;
  final String createdAt;
  final String updatedAt;

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      uid: json['uid'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      deliveryAddress: json['deliveryAddress'] as String? ?? '',
      displayName: json['displayName'] as String? ?? '',
      settings: UserSettings.fromJson(
        json['settings'] as Map<String, dynamic>? ?? {},
      ),
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
    );
  }

  String get label {
    if (displayName.trim().isNotEmpty) return displayName.trim();
    return email;
  }
}
