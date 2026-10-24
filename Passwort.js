
(() => {
  const KEY = "dienstplan-passwort";
  document.documentElement.style.visibility = "hidden";

  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(KEY);
    const gate = document.createElement("div");

    gate.style.cssText = `
      position:fixed;inset:0;z-index:999999;
      background:#101820;color:white;
      display:flex;align-items:center;justify-content:center;
      padding:20px;font-family:Arial,sans-serif;
    `;

    gate.innerHTML = `
      <div style="background:#1d2a38;padding:25px;
        border-radius:18px;width:100%;max-width:350px">
        <h2>🔒 Mein Dienstplan</h2>
        <p id="pw-help"></p>
        <form id="pw-form">
          <input id="pw-input" type="password" required
            minlength="8" placeholder="Passwort"
            style="width:100%;box-sizing:border-box;
            padding:13px;font-size:17px">
          <button type="submit"
            style="width:100%;margin-top:12px;
            padding:13px;background:#f4c949;
            border:0;border-radius:8px">
            Weiter
          </button>
        </form>
        <p id="pw-error" style="color:#ffaaaa"></p>
      </div>
    `;

    document.body.appendChild(gate);
    document.documentElement.style.visibility = "visible";

    const input = gate.querySelector("#pw-input");
    const error = gate.querySelector("#pw-error");

    gate.querySelector("#pw-help").textContent = saved
      ? "Bitte Passwort eingeben."
      : "Lege dein Passwort fest (mindestens 8 Zeichen).";

    gate.querySelector("#pw-form").onsubmit = async (e) => {
      e.preventDefault();

      const password = input.value;
      const bytes = new TextEncoder().encode(password);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const hash = Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      if (!saved) {
        localStorage.setItem(KEY, hash);
        gate.remove();
      } else if (hash === saved) {
        gate.remove();
      } else {
        error.textContent = "Falsches Passwort!";
        input.value = "";
      }
    };
  });
})();

