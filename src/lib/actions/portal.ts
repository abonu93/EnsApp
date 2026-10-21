// Sposta il nodo in fondo a <body>. Serve ai pannelli `position: fixed`
// (Sheet, Modal): dentro la schermata animata (`.ens-screen-in`, con
// transform) il fixed si riferisce alla pagina intera e non allo schermo, e
// su iPhone il calendario si apriva in fondo alla pagina, irraggiungibile.
export function portal(node: HTMLElement) {
  document.body.appendChild(node);
  return {
    destroy() {
      node.remove();
    },
  };
}
