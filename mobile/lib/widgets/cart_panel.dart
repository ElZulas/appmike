import 'package:flutter/material.dart';

import '../models/cart_line.dart';
import '../models/catalog_item.dart';
import 'product_card.dart';

class CartPanel extends StatelessWidget {
  const CartPanel({
    super.key,
    required this.lines,
    required this.onIncrement,
    required this.onDecrement,
    required this.onRemove,
    required this.onClose,
  });

  final List<CartLine> lines;
  final void Function(CatalogItem item) onIncrement;
  final void Function(CatalogItem item) onDecrement;
  final void Function(CatalogItem item) onRemove;
  final VoidCallback onClose;

  double get _store =>
      lines.fold<double>(0, (s, l) => s + l.lineStoreMxn);

  double get _service =>
      lines.fold<double>(0, (s, l) => s + l.lineServiceMxn);

  double get _total => _store + _service;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;

    return Material(
      elevation: 2,
      color: scheme.surface,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Text('Carrito', style: text.titleLarge),
                  const Spacer(),
                  IconButton(
                    onPressed: onClose,
                    icon: const Icon(Icons.close),
                    tooltip: 'Cerrar',
                  ),
                ],
              ),
              if (lines.isEmpty)
                Expanded(
                  child: Center(
                    child: Text(
                      'Agrega productos desde el catálogo.\n'
                      'Los precios son estimados; el total final se confirma con el ticket.',
                      textAlign: TextAlign.center,
                      style: text.bodyMedium,
                    ),
                  ),
                )
              else ...[
                Expanded(
                  child: ListView.separated(
                    itemCount: lines.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, i) {
                      final line = lines[i];
                      final item = line.item;
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: Icon(item.categoryIcon, color: scheme.primary),
                        title: Text(item.name, maxLines: 2, overflow: TextOverflow.ellipsis),
                        subtitle: Text(
                          '${formatMxn(item.storePriceMxn)} + ${formatMxn(item.serviceFeeMxn)} c/u',
                          style: text.bodySmall,
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              onPressed: () => onDecrement(item),
                              icon: const Icon(Icons.remove),
                            ),
                            Text('${line.quantity}', style: text.titleSmall),
                            IconButton(
                              onPressed: () => onIncrement(item),
                              icon: const Icon(Icons.add),
                            ),
                            IconButton(
                              onPressed: () => onRemove(item),
                              icon: Icon(Icons.delete_outline, color: scheme.error),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: scheme.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.5)),
                  ),
                  child: Column(
                    children: [
                      _totRow('Subtotal tienda (est.)', formatMxn(_store), text, scheme),
                      _totRow('Comisión servicio (est.)', formatMxn(_service), text, scheme),
                      const Divider(height: 20),
                      _totRow('Total estimado', formatMxn(_total), text, scheme, bold: true),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: null,
                  child: const Text('Continuar (próximamente)'),
                ),
                Text(
                  'Checkout con Stripe / Mercado Pago en siguiente iteración.',
                  style: text.bodySmall,
                  textAlign: TextAlign.center,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _totRow(String label, String value, TextTheme t, ColorScheme scheme, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(child: Text(label, style: bold ? t.titleSmall : t.bodyMedium)),
          Text(
            value,
            style: bold
                ? t.titleMedium?.copyWith(fontWeight: FontWeight.w800, color: scheme.primary)
                : t.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

void showCartBottomSheet(
  BuildContext context, {
  required List<CartLine> lines,
  required void Function(CatalogItem item) onIncrement,
  required void Function(CatalogItem item) onDecrement,
  required void Function(CatalogItem item) onRemove,
}) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (ctx) {
      return SizedBox(
        height: MediaQuery.sizeOf(ctx).height * 0.88,
        child: CartPanel(
          lines: lines,
          onIncrement: onIncrement,
          onDecrement: onDecrement,
          onRemove: onRemove,
          onClose: () => Navigator.pop(ctx),
        ),
      );
    },
  );
}
