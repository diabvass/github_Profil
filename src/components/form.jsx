import { useState } from "react";
import Profil from "./profil";
import style from "./form.module.css";

function User() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  const valid = (event) => {
    event.preventDefault();
    setMessage("");
    if (!nom.trim()) {
      setMessage("Entrer un nom");
      return;
    }
    setUser(nom);
     
  };

  return (
    <>
        <div className={style["body-github"]}>
            <div className="container mt-5">
                <h1 className={style.titre}>GitHub User Profil</h1>
                <form onSubmit={valid} className="d-flex justify-content-center mb-4  g-3 align-items-center row row-cols-lg-auto">
                    <input type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className={style.champ} 
                    placeholder="Nom d'utilisateur GitHub" />
                    <button type="submit" className="btn btn-success ms-2">Rechercher</button>
                </form>
                <div className="d-flex justify-content-center">
                    {message && <div className={style.message}>{message}</div>}
                    
                </div> 
            </div>
        </div>
     
       <div>
          {user && <Profil nom={user} />}
        </div>
 
    </>
  );
}
export default User