import 'package:flutter/material.dart';

import '../config/api_config.dart';
import '../screens/api_setup_screen.dart';

void showApiSettingsSheet(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    showDragHandle: true,
    builder: (ctx) => Padding(
      padding: EdgeInsets.fromLTRB(24, 8, 24, 24 + MediaQuery.paddingOf(ctx).bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Servidor API', style: Theme.of(ctx).textTheme.titleMedium),
          const SizedBox(height: 8),
          SelectableText(
            ApiConfig.isConfigured ? ApiConfig.baseUrl : '(sin configurar)',
            style: Theme.of(ctx).textTheme.bodySmall,
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              Navigator.of(context).push(
                MaterialPageRoute<void>(builder: (_) => const ApiSetupScreen()),
              );
            },
            child: const Text('Cambiar URL del servidor'),
          ),
        ],
      ),
    ),
  );
}
