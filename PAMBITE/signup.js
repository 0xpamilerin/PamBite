document.addEventListener("DOMContentLoaded", () => {
  const f = document.getElementById("signupForm"),
        n = document.getElementById("name"),
        e = document.getElementById("email"),
        p = document.getElementById("password"),
        c = document.getElementById("confirm-password");

  const errs = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    confirm: document.getElementById("confirmError"),
  };

  const patterns = {
    name: /^[A-Za-z\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
  };

  function validate() {
    let ok = true;
    if (!patterns.name.test(n.value.trim())) { errs.name?.classList.remove("hidden"); ok = false; } else errs.name?.classList.add("hidden");
    if (!patterns.email.test(e.value.trim())) { errs.email?.classList.remove("hidden"); ok = false; } else errs.email?.classList.add("hidden");
    if (!patterns.password.test(p.value)) { errs.password?.classList.remove("hidden"); ok = false; } else errs.password?.classList.add("hidden");
    if (p.value !== c.value || !c.value) { errs.confirm?.classList.remove("hidden"); ok = false; } else errs.confirm?.classList.add("hidden");
    return ok;
  }

  [n,e,p,c].forEach(inp => inp.addEventListener("input", validate));

  f.addEventListener("submit", ev => {
    ev.preventDefault();
    if (validate()) {
      alert("✅ Signup successful!");
      f.reset(); Object.values(errs).forEach(el => el?.classList.add("hidden"));
    }
  });
});
