import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/cart_line.dart';
import '../models/catalog_item.dart';

const _cartKey = 'supersocio-cart-v1';

class CartStorage {
  Future<List<CartLine>> load(List<CatalogItem> catalog) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_cartKey);
    if (raw == null) return [];
    try {
      final saved = (jsonDecode(raw) as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final byId = {for (final p in catalog) p.id: p};
      final lines = <CartLine>[];
      for (final row in saved) {
        final id = row['productId'] as String?;
        final qty = row['quantity'] as int?;
        final product = id != null ? byId[id] : null;
        if (product != null && qty != null && qty > 0) {
          lines.add(CartLine(item: product, quantity: qty));
        }
      }
      return lines;
    } catch (_) {
      return [];
    }
  }

  Future<void> save(List<CartLine> lines) async {
    final prefs = await SharedPreferences.getInstance();
    final payload = lines
        .map((l) => {'productId': l.item.id, 'quantity': l.quantity})
        .toList();
    await prefs.setString(_cartKey, jsonEncode(payload));
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cartKey);
  }
}
