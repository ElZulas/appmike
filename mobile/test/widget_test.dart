import 'package:flutter_test/flutter_test.dart';

import 'package:super_socio/main.dart';

void main() {
  testWidgets('Muestra catálogo SuperSocio', (WidgetTester tester) async {
    await tester.pumpWidget(const SuperSocioApp());

    expect(find.text('SuperSocio'), findsWidgets);
    expect(find.text('Catálogo estimado'), findsOneWidget);
  });
}
