import 'catalog_item.dart';

class CartLine {
  CartLine({required this.item, this.quantity = 1});

  final CatalogItem item;
  int quantity;

  double get lineStoreMxn => item.storePriceMxn * quantity;

  double get lineServiceMxn => item.serviceFeeMxn * quantity;

  double get lineTotalMxn => item.totalEstimatedMxn * quantity;
}
