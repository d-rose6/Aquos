# Detalhes do Dispositivo — componente Angular

Componente standalone (Angular 15+). Arquivos:

- device-detail.component.ts    (TypeScript — estado, timer de fluxo, gotas)
- device-detail.component.html  (template)
- device-detail.component.scss  (estilos + animações)

## Uso

    <app-device-detail
      deviceName="Cozinha"
      deviceId="1"
      status="Online"
      [valveControlEnabled]="false"
      [liveFlow]="true">
    </app-device-detail>

## Notas

- Angular usa TypeScript; o navegador roda o JavaScript compilado. Não há arquivo .js à parte.
- `valveControlEnabled = false` mantém os botões visíveis porém inativos (estado atual do protótipo).
- A animação reage ao fluxo: `dropCount` e `dropSpeed` derivam de `flow`; `poolHeight` cresce junto.
- Fonte Archivo: adicione no index.html
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&display=swap" rel="stylesheet">
- Se não usar SCSS, o arquivo funciona quase igual em CSS puro — basta expandir o aninhamento.
