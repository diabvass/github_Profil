import { useState, useEffect } from "react";
import style from "./profil.module.css";

export default function Profil({ nom }) {
  const [data, setData] = useState(null);
  const [recentdata, setRecentData] = useState(null);
  const [instant, setInstant] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nom) {
      setError("");
      return;
    }

    const fetchData = async () => {
      setInstant(true);
      setError("");
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_URL}/${nom}`,{
          headers: {
            'Authorization' : `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
            'accept' : 'application/vnd.github.v3+json'
          }
        });
        if (!response.ok) {
          console.error(response.status);
          if(response.status === 404) throw new Error(`Cet utilisateur n'existe pas.`);
          if(response.status === 500) throw new Error(`Github a un problème pour le moment.`);
          if(response.status === 403) throw new Error(`Limite Gihub dépassée. Attends un instant`);
        }
        const userData = await response.json();
        setData(userData);

        const recent = await fetch(userData.repos_url);
        if (!recent.ok) {
          console.error(`Repo recent erreur : ${recent.status}`);
          throw new Error('Dernier repo introuvable.');
        }

        const reposData = await recent.json();

        if (reposData.length === 0) {
          throw new Error("Cet utilisateur n'a pas de dépôts publics.");
        }

        reposData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRecentData(reposData[0]);

      } catch (err) {
        setError(err.message);
      } finally {
        setInstant(false);
      }
    };

    fetchData();
  }, [nom]);

  if (instant) return <div className="d-flex justify-content-center">Chargement...</div>;
  if (error) return <div className="d-flex justify-content-center text-danger">Erreur : {error}</div>;
  if (!data) return <div className="d-flex justify-content-center text-warning">Aucune donnée</div>;

  const { avatar_url, name, bio, location, public_repos, followers, following, created_at, html_url } = data;

  return (
    <div className={style.profileCard}>
        <div className={style.userHeader}>
            <img src={avatar_url} alt="Avatar de ${nom}" className={style.img} width="100"/>
            <div>
                <h2 className={style.username}>{name || data.login}</h2>
                <p className={style.description}>{bio || "Pas de bio"}</p>
            </div>
        </div>

        <hr className={style.ligne} aria-hidden="true" />
        <div className={style.userDetails}>
            <p><strong>Local :</strong> <span className={style.value}>{location || "Non spécifié"}</span></p>
            <p><strong>Répertoire Publics :</strong> <span className={style.value}>{public_repos}</span></p>
            <p><strong>Followers :</strong> <span className={style.value}>{followers}</span></p>
            <p><strong>Followings :</strong> <span className={style.value}>{following}</span></p>
            <p><strong>Compte créé le :</strong> <span className={style.value}>{new Date(created_at).toLocaleDateString()}</span></p>
            <p><strong>Url profil :</strong> <span className={style.value}><a href={html_url} target="_blank" rel="noopener noreferrer">Profil GitHub</a></span></p>
        </div>
        <hr className={style.ligne} aria-hidden="true" />

        <div className={style.recent}>
            <p className={style.recenTitle}><u>Information sur le repertoire récent</u></p>
            <div className={style.repoDetails}>
                <p><strong>Nom :</strong> <span className={style.value}>{recentdata.name}</span></p>
                <p><strong>URL :</strong> <span className={style.value}><a href={recentdata.html_url} target="_blank" rel="noopener noreferrer">Repo Github</a></span></p>
                <p><strong>Description :</strong> <span className={style.value}>{recentdata.description}</span></p>
                <p><strong>Langage principal :</strong> <span className={style.value}>{recentdata.language}</span></p>
                <p><strong>Dernière mise à jour :</strong> <span className={style.value}>{recentdata.updated_at}</span></p>
            </div>
        </div>
    </div>

  );
}