(() => {
    const songs = [...document.querySelectorAll(".song")];

    /* ---------- Acessibilidade: cada linha vira um item selecionável ---------- */
    songs.forEach(song => {
        song.setAttribute("role", "option");
        song.setAttribute("tabindex", "0");
        song.setAttribute("aria-selected", "false");
    });
    document.querySelector(".songs-list")?.setAttribute("role", "listbox");

    /* ---------- Seleção (clique) ---------- */
    const select = song => {
        songs.forEach(s => {
            const active = s === song;
            s.classList.toggle("is-selected", active);
            s.setAttribute("aria-selected", String(active));
        });
    };

    /* ---------- Tocar (duplo clique / Enter) ---------- */
    const toMinutes = text => {
        const [m, s] = text.trim().split(":").map(Number);
        return m * 60 + s;
    };

    const play = song => {
        const cells = song.querySelectorAll(":scope > span");
        const title = song.querySelector(".song-title span")?.textContent;
        const cover = song.querySelector(".song-title img")?.src;
        const artist = cells[1]?.textContent;
        const duration = toMinutes(cells[cells.length - 1].textContent);

        songs.forEach(s => s.classList.toggle("is-current", s === song));

        window.MusicHubPlayer?.setTrack({ title, artist, cover, duration });
        document.querySelector("#playerPlay")?.classList.add("is-playing");
    };

    songs.forEach(song => {
        song.addEventListener("click", e => {
            if (e.target.closest(".favorite")) return; // coração não seleciona a linha
            select(song);
        });

        song.addEventListener("dblclick", e => {
            if (e.target.closest(".favorite")) return;
            select(song);
            play(song);
        });

        song.addEventListener("keydown", e => {
            const i = songs.indexOf(song);

            if (e.key === "Enter") {
                e.preventDefault();
                select(song);
                play(song);
            } else if (e.key === " ") {
                e.preventDefault();
                select(song);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                songs[Math.min(i + 1, songs.length - 1)].focus();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                songs[Math.max(i - 1, 0)].focus();
            }
        });
    });

    /* ---------- Favoritos da lista ---------- */
    document.querySelectorAll(".favorite").forEach(button => {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            const on = button.classList.toggle("is-favorite");
            button.setAttribute("aria-pressed", String(on));
        });
    });

    /* ---------- Botão Play da playlist ---------- */
    document.querySelector("#mainPlay")?.addEventListener("click", e => {
        e.currentTarget.classList.toggle("is-playing");
    });

    /* ---------- Follow ---------- */
    document.querySelector(".follow-button")?.addEventListener("click", e => {
        const button = e.currentTarget;
        button.classList.toggle("is-following");
        button.textContent = button.classList.contains("is-following")
            ? "Following"
            : "Follow";
    });
})();