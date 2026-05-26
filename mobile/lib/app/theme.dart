import 'package:flutter/material.dart';

const _accent = Color(0xFF0B7C7C);

/// Tema claro (Material 3).
ThemeData buildAppLightTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: _accent,
    brightness: Brightness.light,
    surface: const Color(0xFFF4F6F8),
  );
  return _baseTheme(scheme, Brightness.light);
}

/// Tema oscuro alineado con la web (zinc / teal).
ThemeData buildAppDarkTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: _accent,
    brightness: Brightness.dark,
    surface: const Color(0xFF0F172A),
    surfaceContainerHighest: const Color(0xFF1E293B),
  );
  return _baseTheme(scheme, Brightness.dark);
}

ThemeData _baseTheme(ColorScheme scheme, Brightness brightness) {
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    brightness: brightness,
    appBarTheme: AppBarTheme(
      centerTitle: false,
      elevation: 0,
      scrolledUnderElevation: 0.5,
      backgroundColor: scheme.surface,
      foregroundColor: scheme.onSurface,
      titleTextStyle: TextStyle(
        fontWeight: FontWeight.w700,
        fontSize: 20,
        letterSpacing: -0.3,
        color: scheme.onSurface,
      ),
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: scheme.surfaceContainerHighest.withValues(
        alpha: brightness == Brightness.dark ? 0.5 : 0.35,
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    ),
    textTheme: _textTheme(scheme, brightness),
  );
}

TextTheme _textTheme(ColorScheme scheme, Brightness brightness) {
  final baseLight = Typography.material2021(platform: TargetPlatform.android).black;
  final baseDark = Typography.material2021(platform: TargetPlatform.android).white;
  final base = brightness == Brightness.dark ? baseDark : baseLight;
  return base.copyWith(
    titleLarge: base.titleLarge?.copyWith(
      fontWeight: FontWeight.w700,
      letterSpacing: -0.2,
    ),
    bodyMedium: base.bodyMedium?.copyWith(height: 1.35, color: scheme.onSurfaceVariant),
    bodySmall: base.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
    labelLarge: base.labelLarge?.copyWith(fontWeight: FontWeight.w600),
  );
}
