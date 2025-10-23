// État de l'application
const appState = {
    indication: '',
    cancer: '',
    age: '',
    sexe: '',
    traitement: '',
    dateTraitement: '',
    comparaisons: [],
    hasComparison: false,
    resultats: '',
    conclusion: '',
    currentStep: 1
};

// Base de données de ressources par type de cancer
const cancerResources = {
    'cancer du sein': {
        memo: `
            <h3>Points clés</h3>
            <ul>
                <li>SUVmax normal du sein : généralement < 2</li>
                <li>Attention aux faux positifs : inflammation, fibroadénomes</li>
                <li>Sites métastatiques fréquents : os, foie, poumon, cerveau</li>
                <li>Ganglions axillaires : SUVmax > 2.5 suspect</li>
            </ul>
            <h3>Ressources utiles</h3>
            <ul>
                <li><a href="#" target="_blank">Critères PERCIST</a></li>
                <li><a href="#" target="_blank">TNM cancer du sein 2024</a></li>
            </ul>
        `,
    },
    'mélanome': {
        memo: `
            <h3>Points clés</h3>
            <ul>
                <li>Fixation physiologique cutanée possible</li>
                <li>Sites métastatiques : ganglions, poumon, foie, cerveau, peau</li>
                <li>Ganglion sentinelle : corrélation avec anatomopathologie</li>
                <li>Faux négatifs possibles si lésions < 5mm</li>
            </ul>
            <h3>Ressources utiles</h3>
            <ul>
                <li><a href="#" target="_blank">Stadification AJCC 8e édition</a></li>
                <li><a href="#" target="_blank">Suivi sous immunothérapie</a></li>
            </ul>
        `,
    },
    'cancer ORL': {
        memo: `
            <h3>Points clés</h3>
            <ul>
                <li>Fixation physiologique des amygdales</li>
                <li>Évaluation de l'extension locale et ganglionnaire</li>
                <li>Recherche de second cancer broncho-pulmonaire</li>
                <li>Post-thérapeutique : attention aux remaniements inflammatoires</li>
            </ul>
            <h3>Ressources utiles</h3>
            <ul>
                <li><a href="#" target="_blank">Classification TNM ORL</a></li>
                <li><a href="#" target="_blank">Critères de réponse Neck Imaging Reporting</a></li>
            </ul>
        `,
    },
    'lymphome': {
        memo: `
            <h3>Points clés</h3>
            <ul>
                <li>Critères de Lugano pour la réponse thérapeutique</li>
                <li>Score de Deauville (1-5) pour Hodgkin et LBDGC</li>
                <li>SUVmax baseline important pour le suivi</li>
                <li>Attention aux lymphomes peu/non FDG-avides (LLC, lymphome MALT)</li>
            </ul>
            <h3>Ressources utiles</h3>
            <ul>
                <li><a href="#" target="_blank">Critères de Lugano 2014</a></li>
                <li><a href="#" target="_blank">Score de Deauville</a></li>
            </ul>
        `,
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadFromLocalStorage();
    updatePreview();

    // Sauvegarde automatique toutes les 5 secondes
    setInterval(saveToLocalStorage, 5000);
});

// Event Listeners
function initEventListeners() {
    // Indication
    document.querySelectorAll('.indication-card').forEach(card => {
        card.addEventListener('click', (e) => selectIndication(e.currentTarget));
    });

    // Cancer - icônes rapides
    document.querySelectorAll('.cancer-card').forEach(card => {
        card.addEventListener('click', (e) => selectCancer(e.currentTarget.dataset.cancer));
    });

    // Cancer - input texte
    const cancerInput = document.getElementById('cancerInput');
    cancerInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            selectCancer(e.target.value.trim());
        }
    });

    // Champs formulaire
    ['age', 'sexe', 'traitement', 'dateTraitement', 'resultats', 'conclusion'].forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', (e) => {
            appState[id] = e.target.value;
            updatePreview();
        });
    });

    // Comparaison TEP
    document.getElementById('hasComparison').addEventListener('change', (e) => {
        appState.hasComparison = e.target.checked;
        toggleComparisonSection(e.target.checked);
        updatePreview();
    });

    document.getElementById('addTepBtn').addEventListener('click', addTepComparison);

    // Boutons
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('closeSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('hidden');
    });

    // Navigation clavier
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Sélection indication
function selectIndication(card) {
    // Désélectionner toutes les cartes
    document.querySelectorAll('.indication-card').forEach(c => c.classList.remove('selected'));

    // Sélectionner la carte cliquée
    card.classList.add('selected');

    appState.indication = card.dataset.indication;

    // Passer à l'étape suivante
    showStep(2);
    updatePreview();
}

// Sélection cancer
function selectCancer(cancer) {
    appState.cancer = cancer;

    // Mettre à jour l'interface
    document.querySelectorAll('.cancer-card').forEach(c => c.classList.remove('selected'));
    const selectedCard = document.querySelector(`.cancer-card[data-cancer="${cancer}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Afficher le sidebar si ressources disponibles
    if (cancerResources[cancer.toLowerCase()]) {
        showSidebar(cancer);
    }

    // Passer à l'étape suivante
    showStep(3);
    updatePreview();

    // Focus sur le champ âge
    setTimeout(() => document.getElementById('age').focus(), 100);
}

// Affichage des étapes
function showStep(stepNumber) {
    appState.currentStep = stepNumber;

    // Afficher toutes les étapes jusqu'à l'étape actuelle
    for (let i = 1; i <= 6; i++) {
        const step = document.getElementById(`step${i}`);
        if (i <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    }
}

// Gestion des comparaisons TEP
function toggleComparisonSection(show) {
    const tepList = document.getElementById('tepList');
    const addBtn = document.getElementById('addTepBtn');

    if (show) {
        tepList.classList.remove('hidden');
        addBtn.classList.remove('hidden');

        // Ajouter automatiquement le premier TEP
        if (appState.comparaisons.length === 0) {
            addTepComparison();
        }
    } else {
        tepList.classList.add('hidden');
        addBtn.classList.add('hidden');
        appState.comparaisons = [];
        tepList.innerHTML = '';
    }
}

function addTepComparison() {
    const id = Date.now();
    const tepItem = document.createElement('div');
    tepItem.className = 'tep-item';
    tepItem.dataset.id = id;
    tepItem.innerHTML = `
        <div class="form-group">
            <label>Date du TEP</label>
            <input type="text" class="tep-date" placeholder="Ex: 15/01/2024" data-id="${id}">
        </div>
        <div class="form-group">
            <label>Type</label>
            <select class="tep-type" data-id="${id}">
                <option value="">--</option>
                <option value="baseline">Baseline</option>
                <option value="nadir">Nadir</option>
                <option value="controle">Contrôle</option>
            </select>
        </div>
        <button class="remove-btn" onclick="removeTepComparison(${id})">✕</button>
    `;

    document.getElementById('tepList').appendChild(tepItem);

    // Event listeners pour ce TEP
    tepItem.querySelector('.tep-date').addEventListener('input', (e) => updateTepComparison(id, 'date', e.target.value));
    tepItem.querySelector('.tep-type').addEventListener('change', (e) => updateTepComparison(id, 'type', e.target.value));

    // Ajouter à l'état
    appState.comparaisons.push({ id, date: '', type: '' });

    // Focus sur le champ date
    tepItem.querySelector('.tep-date').focus();

    showStep(5); // Montrer les résultats
}

function removeTepComparison(id) {
    // Retirer de l'état
    appState.comparaisons = appState.comparaisons.filter(tep => tep.id !== id);

    // Retirer du DOM
    const tepItem = document.querySelector(`.tep-item[data-id="${id}"]`);
    if (tepItem) {
        tepItem.remove();
    }

    updatePreview();
}

function updateTepComparison(id, field, value) {
    const tep = appState.comparaisons.find(t => t.id === id);
    if (tep) {
        tep[field] = value;
        updatePreview();
    }
}

// Génération du texte
function generateReport() {
    let report = '';

    // Indication
    if (appState.indication && appState.cancer && appState.age) {
        const sexe = appState.sexe === 'M' ? 'Patient' : appState.sexe === 'F' ? 'Patiente' : 'Patient(e)';
        const indicationText = {
            'bilan': 'bilan initial',
            'reevaluation': 'réévaluation',
            'surveillance': 'surveillance',
            'recidive': 'recherche de récidive'
        };

        report += `INDICATION\n\n`;
        report += `${sexe} de ${appState.age} ans adressé${appState.sexe === 'F' ? 'e' : ''} pour ${indicationText[appState.indication]} d'un ${appState.cancer}`;

        if (appState.traitement && appState.dateTraitement) {
            report += `, traité${appState.sexe === 'F' ? 'e' : ''} par ${appState.traitement} depuis ${appState.dateTraitement}`;
        } else if (appState.traitement) {
            report += `, traité${appState.sexe === 'F' ? 'e' : ''} par ${appState.traitement}`;
        }

        report += '.\n\n';
    }

    // Résultats
    if (appState.resultats || appState.comparaisons.length > 0) {
        report += 'RÉSULTATS\n\n';

        // Phrase de comparaison
        if (appState.hasComparison && appState.comparaisons.length > 0) {
            const validTeps = appState.comparaisons.filter(tep => tep.date);

            if (validTeps.length > 0) {
                report += 'Examen comparé ';

                if (validTeps.length === 1) {
                    const tep = validTeps[0];
                    report += `au TEP du ${tep.date}`;
                    if (tep.type) {
                        report += ` (${tep.type})`;
                    }
                } else {
                    validTeps.forEach((tep, index) => {
                        if (index === validTeps.length - 1) {
                            report += ' et au ';
                        } else if (index > 0) {
                            report += ', au ';
                        } else {
                            report += 'au ';
                        }

                        report += `TEP du ${tep.date}`;
                        if (tep.type) {
                            report += ` (${tep.type})`;
                        }
                    });
                }

                report += '.\n\n';
            }
        }

        // Résultats
        if (appState.resultats) {
            report += appState.resultats + '\n\n';
        }
    }

    // Conclusion
    if (appState.conclusion) {
        report += 'CONCLUSION\n\n';
        report += appState.conclusion;
    }

    return report;
}

// Mise à jour de la prévisualisation
function updatePreview() {
    const preview = document.getElementById('preview');
    const copyBtn = document.getElementById('copyBtn');
    const report = generateReport();

    if (report.trim()) {
        preview.textContent = report;
        copyBtn.disabled = false;
    } else {
        preview.innerHTML = '<p class="placeholder">Le compte rendu apparaîtra ici au fur et à mesure...</p>';
        copyBtn.disabled = true;
    }
}

// Copie dans le presse-papier
async function copyToClipboard() {
    const report = generateReport();

    try {
        await navigator.clipboard.writeText(report);
        showCopyFeedback();
    } catch (err) {
        // Fallback pour les navigateurs plus anciens
        const textarea = document.createElement('textarea');
        textarea.value = report;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyFeedback();
    }
}

function showCopyFeedback() {
    const feedback = document.getElementById('copyFeedback');
    feedback.classList.remove('hidden');

    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 2000);
}

// Sidebar
function showSidebar(cancer) {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('sidebarContent');
    const resource = cancerResources[cancer.toLowerCase()];

    if (resource) {
        content.innerHTML = resource.memo;
        sidebar.classList.remove('hidden');
    }
}

// Sauvegarde/Chargement localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('petReportState', JSON.stringify(appState));
    } catch (e) {
        console.error('Erreur sauvegarde localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('petReportState');
        if (saved) {
            const savedState = JSON.parse(saved);

            // Ne charger que si récent (moins de 24h)
            const saveTime = localStorage.getItem('petReportSaveTime');
            const now = Date.now();
            if (!saveTime || (now - parseInt(saveTime)) > 24 * 60 * 60 * 1000) {
                return;
            }

            // Restaurer l'état
            Object.assign(appState, savedState);

            // Restaurer l'interface
            if (appState.indication) {
                const card = document.querySelector(`.indication-card[data-indication="${appState.indication}"]`);
                if (card) card.classList.add('selected');
                showStep(2);
            }

            if (appState.cancer) {
                const card = document.querySelector(`.cancer-card[data-cancer="${appState.cancer}"]`);
                if (card) card.classList.add('selected');
                document.getElementById('cancerInput').value = appState.cancer;
                showStep(3);
            }

            // Restaurer les champs
            ['age', 'sexe', 'traitement', 'dateTraitement', 'resultats', 'conclusion'].forEach(id => {
                const element = document.getElementById(id);
                if (appState[id]) {
                    element.value = appState[id];
                }
            });

            // Restaurer les comparaisons
            if (appState.hasComparison) {
                document.getElementById('hasComparison').checked = true;
                toggleComparisonSection(true);

                // Restaurer les TEP
                appState.comparaisons.forEach(tep => {
                    const tepItem = document.createElement('div');
                    tepItem.className = 'tep-item';
                    tepItem.dataset.id = tep.id;
                    tepItem.innerHTML = `
                        <div class="form-group">
                            <label>Date du TEP</label>
                            <input type="text" class="tep-date" placeholder="Ex: 15/01/2024" data-id="${tep.id}" value="${tep.date}">
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select class="tep-type" data-id="${tep.id}">
                                <option value="">--</option>
                                <option value="baseline" ${tep.type === 'baseline' ? 'selected' : ''}>Baseline</option>
                                <option value="nadir" ${tep.type === 'nadir' ? 'selected' : ''}>Nadir</option>
                                <option value="controle" ${tep.type === 'controle' ? 'selected' : ''}>Contrôle</option>
                            </select>
                        </div>
                        <button class="remove-btn" onclick="removeTepComparison(${tep.id})">✕</button>
                    `;

                    document.getElementById('tepList').appendChild(tepItem);

                    // Event listeners
                    tepItem.querySelector('.tep-date').addEventListener('input', (e) => updateTepComparison(tep.id, 'date', e.target.value));
                    tepItem.querySelector('.tep-type').addEventListener('change', (e) => updateTepComparison(tep.id, 'type', e.target.value));
                });
            }

            updatePreview();
        }
    } catch (e) {
        console.error('Erreur chargement localStorage:', e);
    }
}

// Réinitialisation
function resetForm() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Les données non copiées seront perdues.')) {
        // Réinitialiser l'état
        Object.keys(appState).forEach(key => {
            if (key === 'currentStep') {
                appState[key] = 1;
            } else if (key === 'comparaisons') {
                appState[key] = [];
            } else if (key === 'hasComparison') {
                appState[key] = false;
            } else {
                appState[key] = '';
            }
        });

        // Réinitialiser l'interface
        document.querySelectorAll('.indication-card, .cancer-card').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => input.value = '');
        document.getElementById('sexe').value = '';
        document.getElementById('cancerInput').value = '';
        document.getElementById('hasComparison').checked = false;
        document.getElementById('tepList').innerHTML = '';
        toggleComparisonSection(false);

        // Masquer le sidebar
        document.getElementById('sidebar').classList.add('hidden');

        // Retour à l'étape 1
        showStep(1);
        updatePreview();

        // Sauvegarder
        saveToLocalStorage();
    }
}

// Raccourcis clavier
function handleKeyboardShortcuts(e) {
    // Ctrl+Enter : Copier
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const copyBtn = document.getElementById('copyBtn');
        if (!copyBtn.disabled) {
            copyToClipboard();
        }
    }

    // Escape : Fermer sidebar
    if (e.key === 'Escape') {
        document.getElementById('sidebar').classList.add('hidden');
    }
}
