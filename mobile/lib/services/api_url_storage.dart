import 'package:shared_preferences/shared_preferences.dart';

class ApiUrlStorage {
  static const _key = 'api_base_url';

  static Future<String?> read() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_key);
  }

  static Future<void> write(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, _normalize(url));
  }

  static String _normalize(String url) {
    var u = url.trim();
    while (u.endsWith('/')) {
      u = u.substring(0, u.length - 1);
    }
    return u;
  }
}
