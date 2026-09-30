/* =========================================================
   MusicHub | global.js
   Injeta header, sidebar e player em qualquer página.
   Uso: <body data-page="home|library|favorites"> + <script src="../global.js" defer>
   Os ícones usam as URLs do Figma (expiram em ~7 dias):
   baixe para /imgs/icons/ e troque os caminhos no objeto ICONS.
========================================================= */
(() => {
    const ICONS = {
        logo:      "https://www.figma.com/api/mcp/asset/de0994ba-a0bd-4549-81e9-cbd919037ecc.svg",
        search:    "https://www.figma.com/api/mcp/asset/1b7d96b0-2ab1-49c4-a99d-fde9cb93f3a3.svg",
        home:      "https://www.figma.com/api/mcp/asset/0eae0eea-6c6a-4db7-a2f3-60072df7a214.svg",
        library:   "https://www.figma.com/api/mcp/asset/09fe4f4d-a9b3-4ef2-be63-1f026db0747e.svg",
        favorites: "https://www.figma.com/api/mcp/asset/65a7c8e5-c38c-4afe-8222-e5a9a8ba689c.svg",
        shuffle:   "https://www.figma.com/api/mcp/asset/c821074f-312a-4014-aa41-10bdbbe827a7.svg",
        prev:      "https://www.figma.com/api/mcp/asset/006ce3b3-793c-4676-a2d3-2aeb69c6e79a.svg",
        next:      "https://www.figma.com/api/mcp/asset/b202dd68-897d-4738-93b5-12bdbb889bcc.svg",
        play:      "https://www.figma.com/api/mcp/asset/436372af-6cf3-420f-b803-d3c713e6fa9e.svg",
        repeat:    "https://www.figma.com/api/mcp/asset/d6250717-4d3f-43a6-ac7b-3311e2ed9e0e.svg",
        heart:     "https://www.figma.com/api/mcp/asset/42875baa-bedd-446a-8c15-5afd02ff8671.svg",
        cover:     "https://www.figma.com/api/mcp/asset/b6eda8a9-0068-4912-8545-fa8e9d03f692.png",
        profile:   "../imgs/login/icon-FTperfil.svg"
    };

    const current = document.body.dataset.page || "home";
    const navItem = (key, href, label) => `
        <a class="sidebar__item ${current === key ? "sidebar__item--active" : ""}"
           href="${href}" aria-label="${label}" ${current === key ? 'aria-current="page"' : ""}>
            <img src="${ICONS[key]}" alt="">
        </a>`;

    const header = `
        <header class="header">
            <a href="#" class="header__logo" aria-label="MusicHub">
                <img src="${ICONS.logo}" alt="MusicHub">
            </a>
            <label class="header__search glass">
                <img class="header__search-icon" src="${ICONS.search}" alt="">
                <input type="search" placeholder="Search artists, tracks, playlists..." aria-label="Pesquisar">
            </label>
            <button class="header__profile glass" aria-label="Perfil">
                <img src="${ICONS.profile}" alt="">
            </button>
        </header>`;

    const sidebar = `
        <nav class="sidebar glass" aria-label="Navegação">
            ${navItem("home", "#", "Início")}
            ${navItem("library", "#", "Biblioteca")}
            ${navItem("favorites", "#", "Favoritos")}
        </nav>`;

    const player = `
        <footer class="player glass" aria-label="Player">
            <div class="player__song">
                <img class="player__cover" src="${ICONS.cover}" alt="">
                <div class="player__text">
                    <strong class="player__title" id="playerTitle">good 4 u</strong>
                    <span class="player__artist" id="playerArtist">Olivia Rodrigo</span>
                </div>
                <button class="player__favorite" aria-label="Favoritar">
                    <img src="${ICONS.heart}" alt="">
                </button>
            </div>

            <div class="player__center">
                <div class="player__controls">
                    <button aria-label="Aleatório"><img src="${ICONS.shuffle}" alt=""></button>
                    <button class="player__skip" aria-label="Anterior"><img src="${ICONS.prev}" alt=""></button>
                    <button class="player__play" id="playerPlay" aria-label="Reproduzir">
                        <img src="${ICONS.play}" alt="">
                    </button>
                    <button class="player__skip player__skip--next" aria-label="Próxima"><img src="${ICONS.next}" alt=""></button>
                    <button aria-label="Repetir"><img src="${ICONS.repeat}" alt=""></button>
                </div>
                <div class="player__progress">
                    <span id="timeNow">1:24</span>
                    <input type="range" id="progress" min="0" max="165" value="84" aria-label="Progresso">
                    <span id="timeTotal">2:45</span>
                </div>
            </div>

            <div class="player__volume">
                <svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="#fff"/>
                    <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9"/>
                </svg>
                <input type="range" id="volume" min="0" max="100" value="85" aria-label="Volume">
            </div>
        </footer>`;

    const host = document.querySelector(".page") || document.body;
    host.insertAdjacentHTML("afterbegin", header);
    host.insertAdjacentHTML("beforeend", sidebar + player);

    /* ---------- Comportamento ---------- */
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

    const paintRange = input => {
        input.style.setProperty("--val", `${(input.value / input.max) * 100}%`);
    };

    const progress = document.getElementById("progress");
    const volume = document.getElementById("volume");
    [progress, volume].forEach(input => {
        paintRange(input);
        input.addEventListener("input", () => paintRange(input));
    });
    progress.addEventListener("input", () => {
        document.getElementById("timeNow").textContent = fmt(progress.value);
    });

    document.getElementById("playerPlay").addEventListener("click", e => {
        e.currentTarget.classList.toggle("is-playing");
    });

    document.querySelector(".player__favorite").addEventListener("click", e => {
        e.currentTarget.classList.toggle("is-favorite");
    });

    /* API opcional para as páginas atualizarem a música tocando */
    window.MusicHubPlayer = {
        setTrack({ title, artist, cover, duration }) {
            if (title)  document.getElementById("playerTitle").textContent = title;
            if (artist) document.getElementById("playerArtist").textContent = artist;
            if (cover)  document.querySelector(".player__cover").src = cover;
            if (duration) {
                progress.max = duration;
                progress.value = 0;
                paintRange(progress);
                document.getElementById("timeNow").textContent = "0:00";
                document.getElementById("timeTotal").textContent = fmt(duration);
            }
        }
    };
})();