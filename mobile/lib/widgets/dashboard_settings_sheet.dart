import 'package:flutter/material.dart';

import '../theme/app_theme_mode.dart';
import 'api_settings_sheet.dart';

/// Ajustes rápidos desde el catálogo (servidor API, tema, volver al inicio).
void showDashboardSettingsSheet(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    showDragHandle: true,
    builder: (ctx) {
      final text = Theme.of(ctx).textTheme;
      final tm = AppThemeModeScope.of(context);
      final bottom = MediaQuery.paddingOf(ctx).bottom;
      return Padding(
        padding: EdgeInsets.fromLTRB(8, 8, 8, 16 + bottom),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text('Ajustes', style: text.titleMedium),
            ),
            SwitchListTile(
              secondary: Icon(
                tm.isDark ? Icons.dark_mode_outlined : Icons.light_mode_outlined,
              ),
              title: const Text('Modo oscuro'),
              value: tm.isDark,
              onChanged: (v) {
                if (v) {
                  tm.setDark();
                } else {
                  tm.setLight();
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.dns_outlined),
              title: const Text('Servidor API'),
              subtitle: const Text('URL y conexión'),
              onTap: () {
                Navigator.of(ctx).pop();
                showApiSettingsSheet(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.home_outlined),
              title: const Text('Volver al inicio'),
              subtitle: const Text('Pantalla de bienvenida'),
              onTap: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).maybePop();
              },
            ),
          ],
        ),
      );
    },
  );
}
