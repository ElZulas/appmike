import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _prefsKey = 'club_peninsular_theme';

/// Tema claro u oscuro persistente (default: claro, alineado con la web).
class AppThemeModeController extends ChangeNotifier {
  AppThemeModeController() : _mode = ThemeMode.light;

  ThemeMode _mode;

  ThemeMode get mode => _mode;

  bool get isDark => _mode == ThemeMode.dark;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final s = prefs.getString(_prefsKey);
    if (s == 'dark') {
      _mode = ThemeMode.dark;
    } else {
      _mode = ThemeMode.light;
    }
    notifyListeners();
  }

  void setLight() => _apply(ThemeMode.light);

  void setDark() => _apply(ThemeMode.dark);

  void toggle() =>
      _apply(_mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark);

  void _apply(ThemeMode next) {
    if (_mode == next) return;
    _mode = next;
    notifyListeners();
    SharedPreferences.getInstance().then((prefs) {
      prefs.setString(_prefsKey, next == ThemeMode.dark ? 'dark' : 'light');
    });
  }
}

class AppThemeModeScope extends InheritedNotifier<AppThemeModeController> {
  const AppThemeModeScope({
    required AppThemeModeController controller,
    required super.child,
    super.key,
  }) : super(notifier: controller);

  static AppThemeModeController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppThemeModeScope>();
    assert(scope != null, 'AppThemeModeScope no encontrado');
    return scope!.notifier!;
  }
}
