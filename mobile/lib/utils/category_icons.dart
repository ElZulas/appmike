import 'package:flutter/material.dart';

/// Mapeo de nombres del catálogo API (estilo Lucide en web) a iconos Material.
IconData categoryIconFromName(String name) {
  switch (name) {
    case 'UtensilsCrossed':
      return Icons.restaurant_outlined;
    case 'Wheat':
      return Icons.grain_outlined;
    case 'Home':
      return Icons.home_outlined;
    case 'Droplets':
      return Icons.water_drop_outlined;
    case 'Drumstick':
      return Icons.set_meal_outlined;
    case 'Milk':
      return Icons.local_drink_outlined;
    case 'Egg':
      return Icons.egg_outlined;
    case 'Sparkles':
      return Icons.auto_awesome_outlined;
    case 'Layers':
      return Icons.layers_outlined;
    case 'Coffee':
      return Icons.coffee_outlined;
    case 'Sandwich':
      return Icons.lunch_dining_outlined;
    case 'Battery':
      return Icons.battery_charging_full_outlined;
    case 'Package':
    default:
      return Icons.inventory_2_outlined;
  }
}
