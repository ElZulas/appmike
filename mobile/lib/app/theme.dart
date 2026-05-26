import 'package:flutter/material.dart';

const _accent = Color(0xFF0B7C7C);
const _darkSurface = Color(0xFF0F172A);
const _darkCard = Color(0xFF1E293B);
const _darkInput = Color(0xFF334155);

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
  final scheme = ColorScheme(
    brightness: Brightness.dark,
    primary: const Color(0xFF2DD4BF),
    onPrimary: const Color(0xFF042F2E),
    primaryContainer: const Color(0xFF134E4A),
    onPrimaryContainer: const Color(0xFFCCFBF1),
    secondary: const Color(0xFF94A3B8),
    onSecondary: const Color(0xFF0F172A),
    secondaryContainer: const Color(0xFF334155),
    onSecondaryContainer: const Color(0xFFE2E8F0),
    tertiary: const Color(0xFF5EEAD4),
    onTertiary: const Color(0xFF042F2E),
    tertiaryContainer: const Color(0xFF115E59),
    onTertiaryContainer: const Color(0xFF99F6E4),
    error: const Color(0xFFF87171),
    onError: const Color(0xFF450A0A),
    errorContainer: const Color(0xFF7F1D1D),
    onErrorContainer: const Color(0xFFFECACA),
    surface: _darkSurface,
    onSurface: const Color(0xFFF8FAFC),
    onSurfaceVariant: const Color(0xFFCBD5E1),
    outline: const Color(0xFF64748B),
    outlineVariant: const Color(0xFF475569),
    shadow: Colors.black,
    scrim: Colors.black,
    inverseSurface: const Color(0xFFF8FAFC),
    onInverseSurface: const Color(0xFF0F172A),
    inversePrimary: _accent,
    surfaceTint: _accent,
    surfaceContainerHighest: _darkCard,
    surfaceContainerHigh: const Color(0xFF334155),
    surfaceContainer: const Color(0xFF1E293B),
    surfaceContainerLow: const Color(0xFF172033),
    surfaceContainerLowest: const Color(0xFF0B1220),
    surfaceBright: const Color(0xFF334155),
    surfaceDim: _darkSurface,
  );
  return _baseTheme(scheme, Brightness.dark);
}

ThemeData _baseTheme(ColorScheme scheme, Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  final cardColor = isDark ? _darkCard : scheme.surfaceContainerHighest.withValues(alpha: 0.35);
  final inputFill = isDark ? _darkInput : scheme.surfaceContainerHighest.withValues(alpha: 0.35);

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
      iconTheme: IconThemeData(color: scheme.onSurface),
      actionsIconTheme: IconThemeData(color: scheme.onSurface),
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
      color: cardColor,
      surfaceTintColor: Colors.transparent,
    ),
    dividerTheme: DividerThemeData(color: scheme.outlineVariant.withValues(alpha: 0.6)),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: inputFill,
      hintStyle: TextStyle(color: scheme.onSurfaceVariant),
      prefixIconColor: scheme.onSurfaceVariant,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: scheme.primary.withValues(alpha: 0.6)),
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

  TextStyle? onSurface(TextStyle? s) => s?.copyWith(color: scheme.onSurface);
  TextStyle? onVariant(TextStyle? s) => s?.copyWith(color: scheme.onSurfaceVariant);

  return base.copyWith(
    displaySmall: onSurface(base.displaySmall),
    headlineSmall: onSurface(base.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
    headlineMedium: onSurface(base.headlineMedium),
    titleLarge: onSurface(base.titleLarge?.copyWith(fontWeight: FontWeight.w700, letterSpacing: -0.2)),
    titleMedium: onSurface(base.titleMedium),
    titleSmall: onSurface(base.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
    bodyLarge: onSurface(base.bodyLarge),
    bodyMedium: onVariant(base.bodyMedium?.copyWith(height: 1.35)),
    bodySmall: onVariant(base.bodySmall),
    labelLarge: onSurface(base.labelLarge?.copyWith(fontWeight: FontWeight.w600)),
    labelMedium: onVariant(base.labelMedium),
    labelSmall: onVariant(base.labelSmall),
  );
}
