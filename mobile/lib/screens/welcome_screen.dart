import 'package:flutter/material.dart';

import '../auth/auth_scope.dart';
import '../brand.dart';
import '../widgets/api_settings_sheet.dart';
import 'profile_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final auth = AuthScope.of(context);

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
                Align(
                  alignment: Alignment.centerLeft,
                  child: Image.asset(
                    kBrandLogoAsset,
                    height: 64,
                    fit: BoxFit.contain,
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
                  child: const Text(
                    'Entrar al catálogo',
                    style: TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
                const SizedBox(height: 12),
                FilledButton.tonal(
                  onPressed: () => Navigator.of(context).pushNamed('/auth'),
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.white.withValues(alpha: 0.12),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(
                    auth.isSignedIn ? 'Mi cuenta' : 'Iniciar sesión',
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
                if (auth.isSignedIn) ...[
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(builder: (_) => const ProfileScreen()),
                    ),
                    child: Text(
                      auth.profile?.label ?? auth.user?.email ?? 'Ver perfil',
                      style: text.labelLarge?.copyWith(color: const Color(0xFF2DD4BF)),
                    ),
                  ),
                ],
                const SizedBox(height: 8),
                Text(
                  'El catálogo no requiere sesión. Para pagar y pedir, usa la web con la misma cuenta.',
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
