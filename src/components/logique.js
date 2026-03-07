 async function Data(){
    const url = `https://api.github.com/users/${n}`;
    
    // Récupération des données utilisateur
    try {
        console.log("Requête API utilisateur...");
        const reponse = await fetch(url);
        
        if (!reponse.ok) {
            console.log(`Erreur HTTP: ${reponse.status}`);
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        
        console.log("Données utilisateur reçues");
        const data = await reponse.json();
        
        // Extraction des informations utilisateur
        const avatar = data.avatar_url; // avatar
        const nom = data.name || data.login; // nom
        const bio = data.bio || "Aucune bio disponible"; // bio
        const pays = data.location || "Non spécifié"; // pays
        const nbrepopub = data.public_repos; // Nombre de repositories publics
        const nbfollowers = data.followers; // Nombre de followers
        const nbfollowing = data.following; // Nombre de following
        const creation = data.created_at; // Date de création du compte
        const Url = data.html_url; // URL du profil GitHub
        console.log("Données utilisateur extraites");
        
        // Récupération des informations du dépôt le plus récent      
        console.log("Requête API repositories...");
        const reposUrl = data.repos_url;
        const reposResponse = await fetch(reposUrl);
        
        if (!reposResponse.ok) {
            console.log(`Erreur HTTP repositories: ${reposResponse.status}`);
            throw new Error(`Erreur HTTP : ${reposResponse.status}`);
        }
        
        console.log("Données repositories reçues");
        const reposData = await reposResponse.json();
        
       if (reposData.length === 0) {
            console.log("Aucun repository trouvé");
            throw new Error("Cet utilisateur n'a pas de dépôts publics.");
        }
        
        // Tri des dépôts par date de mise à jour et sélection du plus récent
        console.log("Tri des repositories...");
        reposData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        const recentRepo = reposData[0];

        // Extraction des informations du dépôt
        const repoNom = recentRepo.name;
        const repoUrl = recentRepo.html_url;
        const repoDescription = recentRepo.description || "Aucune description";
        const repoLangage = recentRepo.language || "Non spécifié";
        const repoMiseAJour = recentRepo.updated_at;

        // Affichage des informations dans l'interface
        console.log("Affichage des données...");
        notif.innerHTML = `
            <div class="profile-card">
                <div class="profile-image-container">
                    <div class="profile-image-circle">
                        <i class="fab fa-github github-icon"></i>
                    </div>
                </div>

                <div class="user-header">
                    <img src="${avatar}" alt="Avatar de ${nom}" class="img-fluid.rounded">
                    
                    <div>
                        <h2 class="username">${nom}</h2>
                        <p class="description">${bio}</p>
                    </div>
                </div>

                <hr class="ligne" aria-hidden="true">

                <div class="user-details">
                    <p><strong>Local :</strong> <span class="detail-value">${pays}</span></p>
                    <p><strong>Répertoire Publics :</strong> <span class="detail-value">${nbrepopub}</span></p>
                    <p><strong>Followers :</strong> <span class="detail-value">${nbfollowers}</span></p>
                    <p><strong>Followings :</strong> <span class="detail-value">${nbfollowing}</span></p>
                    <p><strong>Compte créé le :</strong> <span class="detail-value">${creation}</span></p>
                    <p><strong>Url profil :</strong> <span class="detail-value"><a href=${Url}>${Url}</a></span></p>
                </div>

                <hr class="ligne" aria-hidden="true">

                <div class="repo-info-section">
                    <p class="section-title"><u>Information sur le repertoire récent</u></p>
                    <div class="repo-details">
                        <p><strong>Nom :</strong> <span class="detail-value">${repoNom}</span></p>
                        <p><strong>URL :</strong> <span class="detail-value"><a href=${repoUrl}>${repoUrl}</a></span></p>
                        <p><strong>Description :</strong> <span class="detail-value">${repoDescription}</span></p>
                        <p><strong>Langage principal :</strong> <span class="detail-value">${repoLangage}</span></p>
                        <p><strong>Dernière mise à jour :</strong> <span class="detail-value">${repoMiseAJour}</span></p>
                    </div>
                </div>
            </div>
        `;
        console.log("Affichage terminé avec succès");
    } catch (e) {
        console.log(`Erreur attrapée: ${e.message}`);
        notif.innerHTML = `<div class="alert alert-danger">Erreur : ${e.message}</div>`;
    }
    console.log("Fin de l'exécution de Get()");
}

export default Data