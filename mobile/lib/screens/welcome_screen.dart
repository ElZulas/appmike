import 'package:flutter/material.dart';

import '../auth/auth_scope.dart';
import '../brand.dart';
import '../widgets/api_settings_sheet.dart';
import '../widgets/theme_toggle_button.dart';
import 'profile_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    final auth = AuthScope.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final logo = isDark ? kBrandLogoAssetDark : kBrandLogoAssetLight;

    final titleStyle = text.displaySmall?.copyWith(
      color: scheme.onSurface,
      fontWeight: FontWeight.w900,
      height: 1.05,
    );

    final bodyStyle = text.bodyLarge?.copyWith(
      color: scheme.onSurface.withValues(alpha: 0.8),
      height: 1.4,
    );

    return Scaffold(
      body: DecoratedBox(
        decoration: isDark
            ? const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Color(0xFF042F2E), Color(0xFF0F172A)],
                ),
              )
            : BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    scheme.surface,
                    scheme.surfaceContainerHighest.withValues(alpha: 0.4),
                  ],
                ),
              ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Align(
                              alignment: Alignment.centerLeft,
                              child: Image.asset(
                                logo,
                                height: 56,
                                fit: BoxFit.contain,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              kAppDisplayName,
                              style: text.titleMedium?.copyWith(
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.3,
                                color: scheme.onSurface,
                                height: 1.15,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const ThemeToggleIconButton(),
                    ],
                  ),
                ),
                const Spacer(),
                Text(
                  'Que onda, ¿tu mandado?, sin fila ni membresía.',
                  style: titleStyle,
                ),
                const SizedBox(height: 12),
                Text(
                  'Precios estimados y comisión clara. Un socio compra en el club y te lo deja en la puerta.',
                  style: bodyStyle,
                ),
                const Spacer(),
                FilledButton(
                  onPressed: () =>
                      Navigator.of(context).pushReplacementNamed('/catalog'),
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
                  child: Text(
                    auth.isSignedIn ? 'Mi cuenta' : 'Iniciar sesión',
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
                if (auth.isSignedIn) ...[
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const ProfileScreen(),
                      ),
                    ),
                    child: Text(
                      auth.profile?.label ?? auth.user?.email ?? 'Ver perfil',
                      style: text.labelLarge?.copyWith(color: scheme.primary),
                    ),
                  ),
                ],
                const SizedBox(height: 8),
                Text(
                  'El catálogo no requiere sesión. Para pagar y pedir, usa la web con la misma cuenta.',
                  textAlign: TextAlign.center,
                  style: text.labelSmall?.copyWith(
                    color: scheme.onSurface.withValues(alpha: 0.55),
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onLongPress: () => showApiSettingsSheet(context),
                  child: Text(
                    'App en beta · Mérida\n(mantén pulsado para servidor API)',
                    textAlign: TextAlign.center,
                    style: text.labelSmall?.copyWith(
                      color: scheme.onSurface.withValues(alpha: 0.38),
                    ),
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
