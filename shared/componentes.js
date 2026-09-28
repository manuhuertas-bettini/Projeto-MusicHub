const CAMINHO_ASSETS = '../assets';

class MhHeader extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('.topbar')) return;

    const avatar = this.getAttribute('avatar');
    const conteudoAvatar = avatar ? `<img src="${avatar}" alt="">` : '';

    this.innerHTML = `
      <header class="topbar">
        <a class="topbar__logo" href="#">
          <img src="${CAMINHO_ASSETS}/logo-hub.svg" alt="MusicHub" width="102" height="40">
        </a>

        <form class="search" role="search" id="search-form">
          <i class="fa-solid fa-magnifying-glass search__icon"></i>
          <input class="search__input" type="search" id="search-input" name="q"
                 placeholder="Search artists, tracks, playlists..." aria-label="Buscar">
        </form>

        <button class="topbar__avatar" type="button" id="btn-perfil" aria-label="Perfil">
          ${conteudoAvatar}
        </button>
      </header>
    `;
  }
}

class MhSidebar extends HTMLElement {
  static itens = [
    { id: 'home', rotulo: 'Início', icone: 'icon-home.svg', classe: 'sidebar__icon--home' },
    { id: 'biblioteca', rotulo: 'Biblioteca', icone: 'icon-biblioteca.svg', classe: '' },
    { id: 'favoritos', rotulo: 'Favoritos', icone: 'icon-favoritos.svg', classe: '' },
  ];

  static get observedAttributes() {
    return ['ativo'];
  }

  connectedCallback() {
    this.renderizar();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.renderizar();
  }

  renderizar() {
    const ativo = this.getAttribute('ativo');

    const links = MhSidebar.itens.map((item) => {
      const classeAtivo = item.id === ativo ? ' sidebar__item--active' : '';
      const href = this.getAttribute(`href-${item.id}`) || '#';
      const atual = item.id === ativo ? ' aria-current="page"' : '';

      return `
        <a class="sidebar__item${classeAtivo}" href="${href}" id="nav-${item.id}" aria-label="${item.rotulo}"${atual}>
          <img class="sidebar__icon ${item.classe}" src="${CAMINHO_ASSETS}/shared/${item.icone}" alt="">
        </a>
      `;
    }).join('');

    this.innerHTML = `<nav class="sidebar" aria-label="Navegação principal">${links}</nav>`;
  }
}

class MhAlbum3d extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'alt'];
  }

  connectedCallback() {
    if (!this.querySelector('.album3d')) {
      this.innerHTML = `
        <div class="album3d">
          <img class="album3d__face album3d__frente" alt="">
          <div class="album3d__face album3d__tras"></div>
          <div class="album3d__face album3d__direita"></div>
          <div class="album3d__face album3d__topo"></div>
          <div class="album3d__face album3d__base"></div>
        </div>
      `;
      this.addEventListener('pointermove', this.inclinar);
      this.addEventListener('pointerleave', this.soltar);
    }
    this.atualizar();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.atualizar();
  }

  get imagem() {
    return this.querySelector('.album3d__frente');
  }

  atualizar() {
    const img = this.imagem;
    if (!img) return;

    const src = this.getAttribute('src');
    if (src && img.getAttribute('src') !== src) img.src = src;
    img.alt = this.getAttribute('alt') || '';

    if (this.hasAttribute('data-cor-dinamica')) {
      img.dataset.corDinamica = '';
      if (this.dataset.saturacaoMinima) img.dataset.saturacaoMinima = this.dataset.saturacaoMinima;
    }

    this.style.setProperty('--capa', src ? `url("${src}")` : 'none');
  }

  inclinar = (evento) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const area = this.getBoundingClientRect();
    const x = (evento.clientX - area.left) / area.width - 0.5;
    const y = (evento.clientY - area.top) / area.height - 0.5;

    this.style.setProperty('--mouse-y', `${x * 16}deg`);
    this.style.setProperty('--mouse-x', `${-y * 12}deg`);
  };

  soltar = () => {
    this.style.setProperty('--mouse-y', '0deg');
    this.style.setProperty('--mouse-x', '0deg');
  };
}

customElements.define('mh-header', MhHeader);
customElements.define('mh-sidebar', MhSidebar);
customElements.define('mh-album-3d', MhAlbum3d);
