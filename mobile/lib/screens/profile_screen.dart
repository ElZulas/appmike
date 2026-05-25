import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../auth/auth_scope.dart';
import '../config/api_config.dart';
import 'auth_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = AuthScope.of(context);
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;

    if (auth.loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (!auth.isSignedIn) {
      return Scaffold(
        appBar: AppBar(title: const Text('Mi cuenta')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Inicia sesión para ver tu perfil y pedidos.',
                  textAlign: TextAlign.center,
                  style: text.bodyLarge,
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(builder: (_) => const AuthScreen()),
                  ),
                  child: const Text('Iniciar sesión'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final p = auth.profile;
    final err = auth.profileError;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi cuenta'),
        actions: [
          IconButton(
            tooltip: 'Actualizar',
            onPressed: auth.refreshProfile,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          if (err != null)
            Card(
              color: scheme.errorContainer,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(err, style: TextStyle(color: scheme.onErrorContainer)),
              ),
            ),
          if (err != null) const SizedBox(height: 12),
          Text(
            p?.label ?? auth.user?.email ?? 'Usuario',
            style: text.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 4),
          Text(auth.user?.email ?? '', style: text.bodyMedium),
          const SizedBox(height: 20),
          _InfoTile(label: 'Celular', value: p?.phone.isNotEmpty == true ? p!.phone : '—'),
          _InfoTile(
            label: 'Dirección',
            value: p?.deliveryAddress.isNotEmpty == true ? p!.deliveryAddress : '—',
          ),
          const SizedBox(height: 24),
          Text(
            'Para pagar y confirmar pedidos usa la web con la misma cuenta.',
            style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: 8),
          OutlinedButton(
            onPressed: () async {
              final uri = Uri.parse('${ApiConfig.webAppDefault}/app?tab=session');
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            },
            child: const Text('Abrir pedidos en la web'),
          ),
          const SizedBox(height: 24),
          OutlinedButton(
            onPressed: () async {
              await auth.logout();
              if (context.mounted) Navigator.of(context).pop();
            },
            child: const Text('Cerrar sesión'),
          ),
        ],
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.labelMedium),
          const SizedBox(height: 2),
          Text(value, style: Theme.of(context).textTheme.bodyLarge),
        ],
      ),
    );
  }
}
