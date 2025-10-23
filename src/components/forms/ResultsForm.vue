<script setup>
import { useReportState } from '@/composables/useReportState'

const { resultats } = useReportState()
</script>

<template>
  <div class="results-form">
    <h3 class="form-subtitle">Résultats</h3>

    <p class="section-help">
      Saisissez les résultats de l'examen TEP-FDG en texte libre
    </p>

    <div class="form-section">
      <label for="resultats" class="section-label">Résultats de l'examen</label>
      <textarea
        id="resultats"
        v-model="resultats"
        class="form-textarea"
        rows="12"
        placeholder="Exemples :&#10;- Absence d'hypermétabolisme pathologique du glucose.&#10;- Lésion hypermétabolique du lobe supérieur droit (SUVmax 8.5).&#10;- Adénopathies médiastinales hypermétaboliques.&#10;&#10;Décrivez ici vos observations..."
      />
    </div>

    <div class="help-box">
      <div class="help-title">💡 Conseils de rédaction</div>
      <ul class="help-list">
        <li>Décrire les lésions hypermétaboliques principales avec SUVmax</li>
        <li>Mentionner les adénopathies et leur localisation</li>
        <li>Indiquer les métastases à distance si présentes</li>
        <li>Préciser l'absence d'hypermétabolisme si normal</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.results-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.section-help {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  background: white;
  transition: border-color 0.2s ease;
  resize: vertical;
  line-height: 1.6;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-textarea::placeholder {
  color: var(--text-muted);
}

.help-box {
  padding: 1rem;
  background: var(--primary-light);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius);
}

.help-title {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.help-list {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.help-list li {
  margin-bottom: 0.25rem;
}
</style>
