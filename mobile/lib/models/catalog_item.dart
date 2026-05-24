import 'package:flutter/material.dart';

import '../utils/category_icons.dart';

/// Ítem del catálogo interno (precio estimado en tienda; se valida con ticket).
class CatalogItem {
  const CatalogItem({
    required this.id,
    required this.name,
    required this.shortDescription,
    required this.categoryIcon,
    required this.storePriceMxn,
    required this.serviceFeeRate,
    required this.available,
    this.highlightOffer = false,
  });

  factory CatalogItem.fromJson(Map<String, dynamic> json) {
    final store = json['storePriceMxn'];
    return CatalogItem(
      id: json['id'] as String,
      name: json['name'] as String,
      shortDescription: json['shortDescription'] as String? ?? '',
      categoryIcon: categoryIconFromName(json['categoryIcon'] as String? ?? 'Package'),
      storePriceMxn: (store is num) ? store.toDouble() : double.parse('$store'),
      serviceFeeRate: (json['serviceFeeRate'] as num).toDouble(),
      available: json['available'] as bool? ?? true,
      highlightOffer: json['highlightOffer'] as bool? ?? false,
    );
  }

  final String id;
  final String name;
  final String shortDescription;
  final IconData categoryIcon;

  /// Precio estimado en club (MXN), antes de comisión.
  final double storePriceMxn;

  /// Comisión de servicio como fracción (ej. 0.12 = 12 %).
  final double serviceFeeRate;

  final bool available;
  final bool highlightOffer;

  double get serviceFeeMxn => (storePriceMxn * serviceFeeRate).clamp(0, double.infinity);

  double get totalEstimatedMxn => storePriceMxn + serviceFeeMxn;
}
