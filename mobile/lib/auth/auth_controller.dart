import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

import '../models/user_profile.dart';
import '../services/users_api.dart';

class AuthController extends ChangeNotifier {
  AuthController({UsersApi? usersApi, FirebaseAuth? auth})
      : _usersApi = usersApi ?? UsersApi(),
        _auth = auth ?? FirebaseAuth.instance;

  final UsersApi _usersApi;
  final FirebaseAuth _auth;
  StreamSubscription<User?>? _sub;

  User? user;
  UserProfile? profile;
  String? profileError;
  bool loading = true;

  bool get isSignedIn => user != null;

  Future<void> init() async {
    _sub = _auth.authStateChanges().listen(_handleAuthUser);
  }

  Future<void> _handleAuthUser(User? u) async {
    user = u;
    if (u == null) {
      profile = null;
      profileError = null;
      loading = false;
      notifyListeners();
      return;
    }

    loading = true;
    notifyListeners();
    try {
      final token = await u.getIdToken();
      if (token == null) throw UsersApiException('No se obtuvo token de sesión');
      profile = await _usersApi.fetchMyProfile(token);
      profileError = null;
    } catch (e) {
      profile = null;
      profileError = e is UsersApiException
          ? e.message
          : 'No se pudo cargar tu perfil desde la API';
    }
    loading = false;
    notifyListeners();
  }

  Future<String?> getIdToken() async {
    final u = user ?? _auth.currentUser;
    if (u == null) return null;
    return u.getIdToken();
  }

  Future<void> login(String email, String password) async {
    await _auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
  }

  Future<void> register({
    required String email,
    required String password,
    required String phone,
    String deliveryAddress = '',
    String displayName = '',
  }) async {
    final cred = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
    final token = await cred.user!.getIdToken();
    if (token == null) throw UsersApiException('No se obtuvo token de sesión');
    profile = await _usersApi.updateMyProfile(
      token,
      phone: phone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      displayName: displayName.trim(),
    );
    profileError = null;
    notifyListeners();
  }

  Future<void> logout() async {
    await _auth.signOut();
  }

  Future<void> refreshProfile() async {
    final u = user ?? _auth.currentUser;
    if (u == null) return;
    try {
      final token = await u.getIdToken();
      if (token == null) throw UsersApiException('No se obtuvo token de sesión');
      profile = await _usersApi.fetchMyProfile(token);
      profileError = null;
    } catch (e) {
      profileError = e is UsersApiException
          ? e.message
          : 'No se pudo actualizar el perfil';
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _sub?.cancel();
    _usersApi.dispose();
    super.dispose();
  }
}

String formatAuthError(Object error) {
  if (error is FirebaseAuthException) {
    switch (error.code) {
      case 'user-not-found':
      case 'wrong-password':
      case 'invalid-credential':
        return 'Correo o contraseña incorrectos';
      case 'email-already-in-use':
        return 'Ese correo ya está registrado';
      case 'weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'invalid-email':
        return 'Correo inválido';
      case 'too-many-requests':
        return 'Demasiados intentos. Espera un momento.';
      default:
        return (error.message ?? error.code).replaceFirst('Firebase: ', '');
    }
  }
  if (error is UsersApiException) return error.message;
  if (error is Exception) {
    return error.toString().replaceFirst('Exception: ', '');
  }
  return 'Error de autenticación';
}
