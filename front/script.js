// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Récupération des éléments
    const contactForm = document.getElementById('contactForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    
    // Vérifier que les éléments existent
    if (!contactForm) {
        console.error('Formulaire de contact non trouvé');
        return;
    }
    
    // Fonction pour afficher un message
    function showMessage(text, type) {
        let bgColor, textColor, borderColor;
        
        switch(type) {
            case 'success':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                borderColor = 'border-green-200';
                break;
            case 'error':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                borderColor = 'border-red-200';
                break;
            case 'loading':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                borderColor = 'border-blue-200';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                borderColor = 'border-gray-200';
        }
        
        messageDiv.innerHTML = `
            <div class="p-4 ${bgColor} ${textColor} border ${borderColor} rounded-lg text-center">
                ${text}
            </div>
        `;
        
        // Faire défiler vers le message
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Gestion de la soumission du formulaire
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Empêche le rechargement de la page
        
        console.log('📝 Formulaire soumis'); // Debug
        
        // Désactiver le bouton et changer le texte
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        
        showMessage('⏳ Envoi en cours...', 'loading');
        
        // Récupérer les données du formulaire
        const formData = {
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            email: document.getElementById('email').value.trim(),
            telephone: document.getElementById('telephone').value.trim(),
            sujet: document.getElementById('sujet').value.trim(),
            message: document.getElementById('message-text').value.trim()
        };
        
        console.log('📊 Données du formulaire:', formData); // Debug
        
        try {
            // Envoyer les données au backend
            console.log('🚀 Envoi vers le backend...');
            
            const response = await fetch('http://localhost:3000/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('📡 Réponse reçue:', response.status, response.statusText);
            
            const result = await response.json();
            console.log('📋 Données de réponse:', result);
            
            if (response.ok) {
                // Succès
                showMessage('✅ Message envoyé avec succès ! Nous vous répondrons bientôt.', 'success');
                contactForm.reset(); // Vider le formulaire
            } else {
                // Erreur du serveur
                showMessage(`❌ Erreur: ${result.error || 'Erreur inconnue'}`, 'error');
            }
            
        } catch (error) {
            console.error('💥 Erreur lors de l\'envoi:', error);
            
            // Messages d'erreur spécifiques
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showMessage('❌ Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 3000.', 'error');
            } else {
                showMessage('❌ Une erreur inattendue s\'est produite. Veuillez réessayer.', 'error');
            }
        } finally {
            // Réactiver le bouton dans tous les cas
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer le message';
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    });
    
    // Gestion de la newsletter (optionnel)
    const newsletterBtn = document.getElementById('newsletter-subscribe');
    const newsletterEmail = document.getElementById('newsletter-email');
    
    if (newsletterBtn && newsletterEmail) {
        newsletterBtn.addEventListener('click', function() {
            const email = newsletterEmail.value.trim();
            if (email) {
                alert(`Merci pour votre inscription avec l'email: ${email}`);
                newsletterEmail.value = '';
            } else {
                alert('Veuillez entrer un email valide');
            }
        });
    }
    
    console.log(' Script de contact chargé avec succès');
});