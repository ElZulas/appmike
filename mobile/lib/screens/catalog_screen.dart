import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../config/api_config.dart';
import '../data/sample_catalog.dart';
import '../widgets/api_settings_sheet.dart';
import '../models/cart_line.dart';
import '../models/catalog_item.dart';
import '../services/cart_storage.dart';
import '../services/catalog_api.dart';
import '../auth/auth_scope.dart';
import '../brand.dart';
import 'auth_screen.dart';
import 'profile_screen.dart';
import '../widgets/cart_panel.dart';
import '../widgets/product_card.dart';
import '../widgets/theme_toggle_button.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final CatalogApi _api = CatalogApi();
  final CartStorage _cartStorage = CartStorage();
  final TextEditingController _search = TextEditingController();

  List<CatalogItem> _catalog = [];
  final List<CartLine> _cart = [];
  bool _loading = true;
  String? _loadError;
  bool _cartReady = false;

  @override
  void initState() {
    super.initState();
    _loadCatalog();
  }

  @override
  void dispose() {
    _search.dispose();
    _api.dispose();
    super.dispose();
  }

  Future<void> _loadCatalog() async {
    setState(() {
      _loading = true;
      _loadError = null;
    });
    try {
      final products = await _api.fetchProducts();
      if (!mounted) return;
      setState(() => _catalog = products);
      await _hydrateCart();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        if (kDebugMode) {
          _catalog = sampleCatalog();
          _loadError = 'Sin API — catálogo de ejemplo. ($e)';
        } else {
          _catalog = [];
          _loadError =
              'No hay conexión con ${ApiConfig.baseUrl}. Revisa internet o cambia el servidor (ajustes en inicio).';
        }
      });
      await _hydrateCart();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _hydrateCart() async {
    final lines = await _cartStorage.load(_catalog);
    if (!mounted) return;
    setState(() {
      _cart
        ..clear()
        ..addAll(lines);
      _cartReady = true;
    });
  }

  Future<void> _persistCart() async {
    if (!_cartReady) return;
    await _cartStorage.save(_cart);
  }

  List<CatalogItem> get _filtered {
    final q = _search.text.trim().toLowerCase();
    if (q.isEmpty) return _catalog;
    return _catalog
        .where(
          (e) =>
              e.name.toLowerCase().contains(q) ||
              e.shortDescription.toLowerCase().contains(q),
        )
        .toList();
  }

  int get _cartCount => _cart.fold<int>(0, (s, l) => s + l.quantity);

  bool _wide(BuildContext context) => MediaQuery.sizeOf(context).width >= 960;

  void _addToCart(CatalogItem item) {
    if (!item.available) return;
    setState(() {
      final i = _cart.indexWhere((l) => l.item.id == item.id);
      if (i >= 0) {
        _cart[i].quantity += 1;
      } else {
        _cart.add(CartLine(item: item));
      }
    });
    _persistCart();
  }

  void _increment(CatalogItem item) {
    setState(() {
      final line = _cart.firstWhere((l) => l.item.id == item.id);
      line.quantity += 1;
    });
    _persistCart();
  }

  void _decrement(CatalogItem item) {
    setState(() {
      final i = _cart.indexWhere((l) => l.item.id == item.id);
      if (i < 0) return;
      if (_cart[i].quantity > 1) {
        _cart[i].quantity -= 1;
      } else {
        _cart.removeAt(i);
      }
    });
    _persistCart();
  }

  void _remove(CatalogItem item) {
    setState(() => _cart.removeWhere((l) => l.item.id == item.id));
    _persistCart();
  }

  void _openCart(BuildContext context) {
    if (_wide(context)) {
      _scaffoldKey.currentState?.openEndDrawer();
    } else {
      showCartBottomSheet(
        context,
        lines: _cart,
        onIncrement: (i) => setState(() => _increment(i)),
        onDecrement: (i) => setState(() => _decrement(i)),
        onRemove: (i) => setState(() => _remove(i)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;
    final wide = _wide(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final logo = isDark ? kBrandLogoAssetDark : kBrandLogoAssetLight;

    return Scaffold(
      key: _scaffoldKey,
      endDrawer: wide
          ? Drawer(
              width: 400,
              child: CartPanel(
                lines: _cart,
                onIncrement: (i) => setState(() => _increment(i)),
                onDecrement: (i) => setState(() => _decrement(i)),
                onRemove: (i) => setState(() => _remove(i)),
                onClose: () => Navigator.of(context).maybePop(),
              ),
            )
          : null,
      appBar: AppBar(
        title: Align(
          alignment: Alignment.centerLeft,
          child: Image.asset(
            logo,
            height: 32,
            fit: BoxFit.contain,
          ),
        ),
        actions: [
          const ThemeToggleIconButton(),
          Builder(
            builder: (context) {
              final auth = AuthScope.of(context);
              final signedIn = auth.isSignedIn;
              return IconButton(
                tooltip: signedIn ? 'Mi cuenta' : 'Iniciar sesión',
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => signedIn
                        ? const ProfileScreen()
                        : const AuthScreen(),
                  ),
                ),
                icon: Icon(
                  signedIn ? Icons.person : Icons.person_outline,
                ),
              );
            },
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilledButton.tonal(
              onPressed: () {},
              child: const Text('Mérida · Costco'),
            ),
          ),
          IconButton(
            tooltip: 'Carrito',
            onPressed: () => _openCart(context),
            icon: Badge(
              isLabelVisible: _cartCount > 0,
              label: Text('$_cartCount'),
              child: const Icon(Icons.shopping_cart_outlined),
            ),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : CustomScrollView(
              slivers: [
                if (_loadError != null)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                      child: MaterialBanner(
                        content: Text(_loadError!, style: text.bodySmall),
                        actions: [
                          TextButton(
                            onPressed: () => showApiSettingsSheet(context),
                            child: const Text('Servidor'),
                          ),
                          TextButton(onPressed: _loadCatalog, child: const Text('Reintentar')),
                        ],
                      ),
                    ),
                  ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Catálogo estimado',
                          style: text.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w800,
                            color: scheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Precios y existencias son referencia interna. El total se ajusta al validar el ticket en caja.',
                          style: text.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _search,
                          onChanged: (_) => setState(() {}),
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            hintText: 'Buscar por nombre…',
                            prefixIcon: Icon(Icons.search),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),
                if (_filtered.isEmpty)
                  SliverFillRemaining(
                    hasScrollBody: false,
                    child: Center(
                      child: Text(
                        'Sin resultados.',
                        style: text.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                        maxCrossAxisExtent: 380,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        mainAxisExtent: 348,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final item = _filtered[index];
                          return ProductCard(
                            item: item,
                            onAdd: () => _addToCart(item),
                          );
                        },
                        childCount: _filtered.length,
                      ),
                    ),
                  ),
              ],
            ),
    );
  }
}
