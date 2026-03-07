import { useState } from "react";
import Profil from "./profil";

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
    setNom("");
     
  };

  return (
    <>
      <div>Rechercher un utilisateur Github</div>
      <form onSubmit={valid}>
        <div className="champ">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Entrez un nom GitHub"
          />
        </div>
        <div>
          <button>Rechercher</button>
        </div>
      </form>
      {message && <div>{message}</div>}
      {user && <Profil nom={user} />}
    </>
  );
}

export default User