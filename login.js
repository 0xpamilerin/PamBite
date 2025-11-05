document.addEventListener("DOMContentLoaded", () => {
  const f = document.getElementById("loginForm"),
        e = document.getElementById("email"),
        p = document.getElementById("password");

  const errs = {
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
  };

  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
  };
  function validate() {
    let ok = true;
    if (!patterns.email.test(e.value.trim())) { errs.email?.classList.remove("hidden"); ok = false; } else errs.email?.classList.add("hidden");
    if (!patterns.password.test(p.value)) { errs.password?.classList.remove("hidden"); ok = false; } else errs.password?.classList.add("hidden");
    return ok;
  }

  [e,p].forEach(inp => inp.addEventListener("input", validate));

  f.addEventListener("submit", ev => {
    ev.preventDefault();
    if (validate()) {
      alert("✅ Login successful!");
      f.reset(); Object.values(errs).forEach(el => el?.classList.add("hidden"));
    }
  });
});
