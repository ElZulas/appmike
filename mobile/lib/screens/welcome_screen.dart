import 'package:flutter/material.dart';

import '../widgets/api_settings_sheet.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF042F2E), Color(0xFF0F172A)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 32),
                Text(
                  'SuperSocio',
                  style: text.titleLarge?.copyWith(
                    color: scheme.primaryContainer.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const Spacer(),
                Text(
                  '¿Qué pedo?',
                  style: text.displaySmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    height: 1.05,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Tu mandado del club, sin fila ni membresía. Precios estimados y comisión clara.',
                  style: text.bodyLarge?.copyWith(
                    color: Colors.white.withValues(alpha: 0.75),
                    height: 1.4,
                  ),
                ),
                const Spacer(),
                FilledButton(
                  onPressed: () => Navigator.of(context).pushReplacementNamed('/catalog'),
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF2DD4BF),
                    foregroundColor: const Color(0xFF042F2E),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Entrar al catálogo', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white70,
                    side: BorderSide(color: Colors.white.withValues(alpha: 0.25)),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Iniciar sesión (próximamente)'),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onLongPress: () => showApiSettingsSheet(context),
                  child: Text(
                    'App en beta · Mérida\n(mantén pulsado para servidor API)',
                    textAlign: TextAlign.center,
                    style: text.labelSmall?.copyWith(color: Colors.white38),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
