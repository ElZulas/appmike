import 'package:flutter/material.dart';

import '../models/catalog_item.dart';

String formatMxn(double value) {
  final v = value.round();
  return '\$$v MXN';
}

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.item,
    required this.onAdd,
  });

  final CatalogItem item;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                DecoratedBox(
                  decoration: BoxDecoration(
                    color: scheme.primaryContainer.withValues(alpha: 0.45),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Icon(item.categoryIcon, size: 26, color: scheme.primary),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (item.highlightOffer)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: _OfferChip(scheme: scheme),
                        ),
                      Text(
                        item.name,
                        style: text.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: scheme.onSurface,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.shortDescription,
                        style: text.bodySmall,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            _PriceBlock(item: item, scheme: scheme, text: text),
            const SizedBox(height: 10),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  item.available ? Icons.check_circle_outline : Icons.cancel_outlined,
                  size: 16,
                  color: item.available ? scheme.tertiary : scheme.error,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    item.available ? 'Disponible (estimado)' : 'Sin stock (estimado)',
                    style: text.labelSmall?.copyWith(
                      color: item.available ? scheme.onSurfaceVariant : scheme.error,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: FilledButton.tonalIcon(
                onPressed: item.available ? onAdd : null,
                icon: const Icon(Icons.add_shopping_cart_outlined, size: 18),
                label: const Text('Agregar'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OfferChip extends StatelessWidget {
  const _OfferChip({required this.scheme});

  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: scheme.tertiaryContainer,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        'Oferta estimada',
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: scheme.onTertiaryContainer,
              fontWeight: FontWeight.w700,
            ),
      ),
    );
  }
}

class _PriceBlock extends StatelessWidget {
  const _PriceBlock({
    required this.item,
    required this.scheme,
    required this.text,
  });

  final CatalogItem item;
  final ColorScheme scheme;
  final TextTheme text;

  @override
  Widget build(BuildContext context) {
    final pct = (item.serviceFeeRate * 100).round();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? scheme.surfaceContainerHigh
            : scheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _row('Precio tienda (est.)', formatMxn(item.storePriceMxn), text, emphasis: false),
          _row('Comisión servicio ($pct %)', formatMxn(item.serviceFeeMxn), text, emphasis: false),
          const Divider(height: 14),
          _row('Total estimado', formatMxn(item.totalEstimatedMxn), text, emphasis: true),
        ],
      ),
    );
  }

  Widget _row(String label, String value, TextTheme t, {required bool emphasis}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: emphasis
                  ? t.labelLarge?.copyWith(color: scheme.onSurface)
                  : t.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
            ),
          ),
          Text(
            value,
            style: emphasis
                ? t.titleSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: scheme.primary,
                  )
                : t.bodySmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: scheme.onSurface,
                  ),
          ),
        ],
      ),
    );
  }
}
