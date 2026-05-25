import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config/api_config.dart';
import '../widgets/api_settings_sheet.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  Future<void> _openWebSession(BuildContext context) async {
    final uri = Uri.parse('${ApiConfig.webAppDefault}/app?tab=session');
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No se pudo abrir el navegador. Entra a appmike.vercel.app'),
        ),
      );
    }
  }

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
                  'Que onda, ¿tu mandado?, sin fila ni membresía.',
                  style: text.displaySmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    height: 1.05,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Precios estimados y comisión clara. Un socio compra en el club y te lo deja en la puerta.',
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
                  onPressed: () => _openWebSession(context),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: BorderSide(color: Colors.white.withValues(alpha: 0.25)),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Iniciar sesión (web)'),
                ),
                const SizedBox(height: 8),
                Text(
                  'La cuenta y el pedido con pago están en la web por ahora. El catálogo en la app no requiere sesión.',
                  textAlign: TextAlign.center,
                  style: text.labelSmall?.copyWith(color: Colors.white54, height: 1.35),
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
