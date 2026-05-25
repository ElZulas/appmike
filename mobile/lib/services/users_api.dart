import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/user_profile.dart';

class UsersApi {
  UsersApi({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<UserProfile> fetchMyProfile(String token) async {
    return _parseProfile(
      await _authRequest('GET', '/v1/users/me', token),
    );
  }

  Future<UserProfile> updateMyProfile(
    String token, {
    String? phone,
    String? deliveryAddress,
    String? displayName,
  }) async {
    final body = <String, dynamic>{};
    if (phone != null) body['phone'] = phone;
    if (deliveryAddress != null) body['deliveryAddress'] = deliveryAddress;
    if (displayName != null) body['displayName'] = displayName;

    return _parseProfile(
      await _authRequest('PATCH', '/v1/users/me', token, body: body),
    );
  }

  Future<http.Response> _authRequest(
    String method,
    String path,
    String token, {
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}$path');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
    final http.Response res;
    switch (method) {
      case 'GET':
        res = await _client
            .get(uri, headers: headers)
            .timeout(const Duration(seconds: 15));
      case 'PATCH':
        res = await _client
            .patch(
              uri,
              headers: headers,
              body: jsonEncode(body ?? {}),
            )
            .timeout(const Duration(seconds: 15));
      default:
        throw UsersApiException('Método no soportado');
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      String message = 'HTTP ${res.statusCode}';
      try {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        message = data['error'] as String? ?? message;
      } catch (_) {}
      throw UsersApiException(message);
    }
    return res;
  }

  UserProfile _parseProfile(http.Response res) {
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return UserProfile.fromJson(data);
  }

  void dispose() => _client.close();
}

class UsersApiException implements Exception {
  UsersApiException(this.message);
  final String message;
  @override
  String toString() => message;
}
