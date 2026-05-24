import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';

import '../services/api_url_storage.dart';

/// URL base de la API (mismo contrato que `web/`).
///
/// Prioridad: guardado en el dispositivo → `--dart-define=API_BASE_URL` → dev local.
///
/// **Release / APK:** usa `dart_defines/prod.json` al compilar o la pantalla inicial
/// de configuración (primera vez). No uses `localhost` ni `10.0.2.2` en producción.
class ApiConfig {
  static const String _compileTime = String.fromEnvironment('API_BASE_URL');

  static String _resolved = '';
  static bool _initialized = false;

  static String get baseUrl => _resolved;

  static bool get isConfigured => _resolved.isNotEmpty;

  static bool get isLocalDevHost {
    final u = _resolved.toLowerCase();
    return u.contains('localhost') ||
        u.contains('127.0.0.1') ||
        u.contains('10.0.2.2') ||
        u.startsWith('http://192.168.') ||
        u.startsWith('http://10.') ||
        u.startsWith('http://172.');
  }

  static Future<void> init() async {
    if (_initialized) return;

    final stored = await ApiUrlStorage.read();
    if (stored != null && stored.isNotEmpty) {
      _resolved = stored;
      _initialized = true;
      return;
    }

    if (_compileTime.isNotEmpty) {
      _resolved = _compileTime;
      _initialized = true;
      return;
    }

    if (kDebugMode) {
      _resolved = !kIsWeb && Platform.isAndroid
          ? 'http://10.0.2.2:4000'
          : 'http://127.0.0.1:4000';
    }

    _initialized = true;
  }

  static Future<void> setBaseUrl(String url) async {
    _resolved = url.trim();
    while (_resolved.endsWith('/')) {
      _resolved = _resolved.substring(0, _resolved.length - 1);
    }
    await ApiUrlStorage.write(_resolved);
  }
}
