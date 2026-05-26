import 'package:flutter/material.dart';

import '../theme/app_theme_mode.dart';

class ThemeToggleIconButton extends StatelessWidget {
  const ThemeToggleIconButton({super.key});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return IconButton(
      tooltip: dark ? 'Modo claro' : 'Modo oscuro',
      onPressed: () => AppThemeModeScope.of(context).toggle(),
      icon: Icon(dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
    );
  }
}
