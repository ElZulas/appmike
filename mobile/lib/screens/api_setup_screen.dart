import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../config/api_config.dart';

/// Primera vez en release: el usuario pega la URL pública de la API (Render, Railway, etc.).
class ApiSetupScreen extends StatefulWidget {
  const ApiSetupScreen({super.key});

  @override
  State<ApiSetupScreen> createState() => _ApiSetupScreenState();
}

class _ApiSetupScreenState extends State<ApiSetupScreen> {
  final _controller = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final raw = _controller.text.trim();
    if (raw.isEmpty) {
      setState(() => _error = 'Escribe la URL de la API.');
      return;
    }
    final uri = Uri.tryParse(raw);
    if (uri == null || !uri.hasScheme || uri.host.isEmpty) {
      setState(() => _error = 'URL inválida. Ejemplo: https://tu-api.onrender.com');
      return;
    }

    setState(() {
      _busy = true;
      _error = null;
    });

    try {
      final base = raw.replaceAll(RegExp(r'/+$'), '');
      final health = Uri.parse('$base/health');
      final res = await http.get(health).timeout(const Duration(seconds: 15));
      if (res.statusCode != 200) {
        throw Exception('HTTP ${res.statusCode}');
      }
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      if (body['ok'] != true) {
        throw Exception('Respuesta inesperada del servidor');
      }

      await ApiConfig.setBaseUrl(base);
      if (!mounted) return;
      if (Navigator.of(context).canPop()) {
        Navigator.of(context).pop(true);
      } else {
        Navigator.of(context).pushReplacementNamed('/');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error =
            'No se pudo conectar. ¿La API está en internet y accesible?\n($e)';
      });
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
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
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Conectar servidor',
                  style: text.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'La app necesita la URL pública de tu API (no la IP de tu PC). '
                  'Despliega `api/` en Render, Railway o similar y pega esa dirección aquí.',
                  style: text.bodyMedium?.copyWith(
                    color: Colors.white70,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _controller,
                  enabled: !_busy,
                  keyboardType: TextInputType.url,
                  autocorrect: false,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'URL de la API',
                    hintText: ApiConfig.productionDefault,
                    labelStyle: const TextStyle(color: Colors.white70),
                    hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.35)),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.08),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    errorText: _error,
                  ),
                ),
                const Spacer(),
                FilledButton(
                  onPressed: _busy ? null : _save,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF2DD4BF),
                    foregroundColor: const Color(0xFF042F2E),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: _busy
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Probar y continuar', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
