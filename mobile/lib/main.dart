import 'package:flutter/material.dart';

import 'app/theme.dart';
import 'config/api_config.dart';
import 'screens/api_setup_screen.dart';
import 'screens/catalog_screen.dart';
import 'screens/welcome_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiConfig.init();
  runApp(const SuperSocioApp());
}

class SuperSocioApp extends StatelessWidget {
  const SuperSocioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SuperSocio',
      debugShowCheckedModeBanner: false,
      theme: buildSuperSocioTheme(),
      initialRoute: '/',
      routes: {
        '/': (_) =>
            ApiConfig.isConfigured ? const WelcomeScreen() : const ApiSetupScreen(),
        '/setup': (_) => const ApiSetupScreen(),
        '/catalog': (_) => const CatalogScreen(),
      },
    );
  }
}
