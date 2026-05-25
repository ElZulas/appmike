import 'package:flutter/material.dart';

import '../auth/auth_controller.dart';
import '../auth/auth_scope.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _register = false;
  bool _busy = false;
  String? _error;

  final _email = TextEditingController();
  final _password = TextEditingController();
  final _phone = TextEditingController();
  final _address = TextEditingController();
  final _name = TextEditingController();

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _phone.dispose();
    _address.dispose();
    _name.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = AuthScope.of(context);
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      if (_register) {
        if (_phone.text.trim().isEmpty) {
          throw Exception('El número de celular es obligatorio');
        }
        await auth.register(
          email: _email.text,
          password: _password.text,
          phone: _phone.text,
          deliveryAddress: _address.text,
          displayName: _name.text,
        );
      } else {
        await auth.login(_email.text, _password.text);
      }
      if (!mounted) return;
      Navigator.of(context).pop(true);
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = formatAuthError(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(_register ? 'Crear cuenta' : 'Iniciar sesión'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            children: [
              Expanded(
                child: SegmentedButton<bool>(
                  segments: const [
                    ButtonSegment(value: false, label: Text('Entrar')),
                    ButtonSegment(value: true, label: Text('Registro')),
                  ],
                  selected: {_register},
                  onSelectionChanged: (s) => setState(() => _register = s.first),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          if (_register)
            TextField(
              controller: _name,
              decoration: const InputDecoration(
                labelText: 'Nombre (opcional)',
                border: OutlineInputBorder(),
              ),
            ),
          if (_register) const SizedBox(height: 12),
          TextField(
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            autocorrect: false,
            decoration: const InputDecoration(
              labelText: 'Correo electrónico',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _password,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Contraseña (mín. 6 caracteres)',
              border: OutlineInputBorder(),
            ),
          ),
          if (_register) ...[
            const SizedBox(height: 12),
            TextField(
              controller: _phone,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Celular (10 dígitos)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _address,
              decoration: const InputDecoration(
                labelText: 'Dirección de entrega (opcional)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'La dirección puedes completarla después en tu perfil.',
              style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
            ),
          ],
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(
              _error!,
              style: text.bodyMedium?.copyWith(color: scheme.error),
            ),
          ],
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _busy ? null : _submit,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Text(_busy
                  ? 'Espera…'
                  : _register
                      ? 'Crear cuenta'
                      : 'Entrar'),
            ),
          ),
        ],
      ),
    );
  }
}
