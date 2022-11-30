const formUser = document.getElementById("userForm") as HTMLFormElement;
const addUser = document.getElementById("addUser") as HTMLButtonElement;
const auth = document.getElementById("auth") as HTMLElement;
addUser.addEventListener("click", async (e) => {
  e.preventDefault();
  const emailELement = document.getElementById("email") as HTMLInputElement;
  const passwordELement = document.getElementById(
    "password"
  ) as HTMLInputElement;
  const email = emailELement.value;
  const password = passwordELement.value;
  console.log(email, password);

  if (auth.innerText == "register") {
    const result: any = await axios.post("http://localhost:5000/", {
      email: email,
      password: password,
    });
    const success: boolean = result.data.success;
    if (!success) {
      alert(result.data.msg);
      return;
    }
    if (result.status == 200) {
      window.location.href =
        "http://127.0.0.1:5500/dist/frontend/html/login.html";
    }
  } else {
    const result: any = await axios.post("http://localhost:5000/loguser", {
      email: email,
      password: password,
    });
    const success: boolean = result.data.success;
    console.log(success);
    if (!success) {
      alert(result.data.msg);
      return;
    }
    if (result.status == 200) {
      localStorage.setItem("token", result.data.token);
      window.location.href =
        "http://127.0.0.1:5500/dist/frontend/html/todos.html";
    }
  }
});
