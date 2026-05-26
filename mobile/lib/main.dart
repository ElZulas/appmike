import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'app/theme.dart';
import 'auth/auth_controller.dart';
import 'auth/auth_scope.dart';
import 'config/api_config.dart';
import 'brand.dart';
import 'firebase_options.dart';
import 'screens/api_setup_screen.dart';
import 'screens/auth_screen.dart';
import 'screens/catalog_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/welcome_screen.dart';

final _authController = AuthController();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await ApiConfig.init();
  await _authController.init();
  runApp(const ClubPeninsularExpressApp());
}

class ClubPeninsularExpressApp extends StatelessWidget {
  const ClubPeninsularExpressApp({super.key});

  @override
  Widget build(BuildContext context) {
    return AuthScope(
      controller: _authController,
      child: MaterialApp(
        title: kAppDisplayName,
        debugShowCheckedModeBanner: false,
        theme: buildSuperSocioTheme(),
        initialRoute: '/',
        routes: {
          '/': (_) => ApiConfig.isConfigured
              ? const WelcomeScreen()
              : const ApiSetupScreen(),
          '/setup': (_) => const ApiSetupScreen(),
          '/catalog': (_) => const CatalogScreen(),
          '/auth': (_) => const AuthScreen(),
          '/profile': (_) => const ProfileScreen(),
        },
      ),
    );
  }
}
