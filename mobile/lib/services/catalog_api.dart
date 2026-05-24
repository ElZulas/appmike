import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/catalog_item.dart';

class CatalogApi {
  CatalogApi({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<List<CatalogItem>> fetchProducts() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/v1/catalog/products');
    final res = await _client.get(uri).timeout(const Duration(seconds: 12));
    if (res.statusCode != 200) {
      throw CatalogApiException('HTTP ${res.statusCode}');
    }
    final list = jsonDecode(res.body) as List<dynamic>;
    return list
        .map((e) => CatalogItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  void dispose() => _client.close();
}

class CatalogApiException implements Exception {
  CatalogApiException(this.message);
  final String message;
  @override
  String toString() => message;
}
