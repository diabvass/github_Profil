import { useState, useEffect } from "react";

export default function Profil({ nom }) {
  const [data, setData] = useState(null);
  const [recentdata, setRecentData] = useState(null);
  const [instant, setInstant] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nom) return;

    const fetchData = async () => {
      setInstant(true);
      setError("");
      try {
        const response = await fetch(`https://api.github.com/users/${nom}`);
        if (!response.ok) throw new Error("Utilisateur non trouvé");
        const userData = await response.json();
        setData(userData);

        const recent = await fetch(userData.repos_url);
        if (!recent.ok) throw new Error(`Erreur HTTP : ${recent.status}`);

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

  if (instant) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!data) return <div>Aucune donnée</div>;

  const { avatar_url, name, bio, location, public_repos, followers, following, created_at, html_url } = data;

  return (
    <div>
      <img src={avatar_url} alt={name || "Avatar"} width="100" />
      <h2>{name || data.login}</h2>
      <p>{bio || "Pas de bio"}</p>
      <p>Pays : {location || "Non spécifié"}</p>
      <p>Repos : {public_repos}</p>
      <p>Followers : {followers}</p>
      <p>Following : {following}</p>
      <p>Créé le : {new Date(created_at).toLocaleDateString()}</p>
      <a href={html_url} target="_blank" rel="noopener noreferrer">Profil GitHub</a>

      {recentdata && (
        <div>
            <p>Nom :{recentdata.name}</p>
            <p>URL : <a href={recentdata.html_url}>{recentdata.html_url}</a></p>
            <p>Description : {recentdata.description}</p>
            <p>Langage principal :{recentdata.language}</p>
            <p>Dernière mise à jour : {recentdata.updated_at}</p>
        </div>
      )}
    </div>
  );
}