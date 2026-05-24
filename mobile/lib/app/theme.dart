import 'package:flutter/material.dart';

/// Tema “data-driven”: fondo claro, acento teal, tipografía sans del sistema.
ThemeData buildSuperSocioTheme() {
  const accent = Color(0xFF0B7C7C);
  final scheme = ColorScheme.fromSeed(
    seedColor: accent,
    brightness: Brightness.light,
    surface: const Color(0xFFF4F6F8),
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
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
      color: scheme.surfaceContainerHighest.withValues(alpha: 0.35),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    ),
    textTheme: _textTheme(scheme),
  );
}

TextTheme _textTheme(ColorScheme scheme) {
  final base = Typography.material2021(platform: TargetPlatform.android).black;
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
