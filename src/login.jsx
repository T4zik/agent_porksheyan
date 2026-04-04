import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import userService from "../service/user.service";
import { FaSpinner } from "react-icons/fa";

export function Login({ setAccess }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  const registerUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    userService
      .saveUser(user, "/login")
      .then((res) => {
        if (res) {
          setAccess(true);
          navigate("../main", { relative: "path" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Вход</h2>
            <p>Введите свою почту и пароль.</p>
            <form onSubmit={registerUser}>
              <div className="form-group">
                <label>Электронная почта</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  value={user.email}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>Пароль</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  value={user.password}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner" /> Вход...
                    </>
                  ) : (
                    "Войти"
                  )}
                </button>
              </div>
              <p>
                Нет аккаунта? <Link to="/">Создайте его</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
