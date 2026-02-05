// Système d'analyse de mots-clés pour convertir la voix en transaction
// PAS d'IA - juste recherche de patterns et mots-clés

// ============================================
// CATÉGORIES PRÉDÉFINIES (40+)
// ============================================
const CATEGORIES = {
  // Alimentation
  restaurant: { name: 'Restaurant', icon: '🍽️', color: '#ff6b6b', type: 'expense', keywords: ['restaurant', 'resto', 'manger', 'dîner', 'déjeuner', 'repas', 'bouffe'] },
  cafe: { name: 'Café', icon: '☕', color: '#8B4513', type: 'expense', keywords: ['café', 'coffee', 'starbucks', 'thé'] },
  groceries: { name: 'Courses', icon: '🛒', color: '#4CAF50', type: 'expense', keywords: ['courses', 'supermarché', 'carrefour', 'leclerc', 'auchan', 'lidl', 'épicerie', 'magasin'] },
  fastfood: { name: 'Fast Food', icon: '🍔', color: '#FFC107', type: 'expense', keywords: ['mcdo', 'mcdonald', 'burger', 'kebab', 'pizza', 'kfc', 'subway'] },

  // Transport
  essence: { name: 'Essence', icon: '⛽', color: '#607D8B', type: 'expense', keywords: ['essence', 'carburant', 'station', 'diesel', 'plein'] },
  taxi: { name: 'Taxi/VTC', icon: '🚕', color: '#FFD700', type: 'expense', keywords: ['taxi', 'uber', 'vtc', 'bolt', 'chauffeur'] },
  transport: { name: 'Transport', icon: '🚌', color: '#3F51B5', type: 'expense', keywords: ['bus', 'métro', 'tram', 'train', 'transport', 'navigo', 'ticket'] },
  parking: { name: 'Parking', icon: '🅿️', color: '#9C27B0', type: 'expense', keywords: ['parking', 'stationnement', 'parcmètre'] },
  voiture: { name: 'Voiture', icon: '🚗', color: '#795548', type: 'expense', keywords: ['voiture', 'auto', 'garage', 'réparation', 'vidange', 'pneu', 'contrôle technique'] },

  // Santé
  sante: { name: 'Santé', icon: '🏥', color: '#E91E63', type: 'expense', keywords: ['médecin', 'docteur', 'dentiste', 'pharmacie', 'médicament', 'santé', 'hôpital', 'kiné', 'ophtalmo'] },
  sport: { name: 'Sport', icon: '🏃', color: '#00BCD4', type: 'expense', keywords: ['sport', 'gym', 'salle', 'fitness', 'piscine', 'yoga', 'musculation', 'abonnement sport'] },

  // Shopping
  shopping: { name: 'Shopping', icon: '🛍️', color: '#E91E63', type: 'expense', keywords: ['shopping', 'vêtements', 'habits', 'chaussures', 'zara', 'h&m', 'amazon', 'achat'] },
  electronique: { name: 'Électronique', icon: '📱', color: '#2196F3', type: 'expense', keywords: ['téléphone', 'ordinateur', 'électronique', 'apple', 'samsung', 'tech', 'informatique'] },

  // Loisirs
  cinema: { name: 'Cinéma', icon: '🎬', color: '#9C27B0', type: 'expense', keywords: ['cinéma', 'ciné', 'film', 'ugc', 'pathé'] },
  netflix: { name: 'Streaming', icon: '📺', color: '#E50914', type: 'expense', keywords: ['netflix', 'spotify', 'disney', 'prime', 'streaming', 'abonnement'] },
  jeux: { name: 'Jeux', icon: '🎮', color: '#4CAF50', type: 'expense', keywords: ['jeux', 'playstation', 'xbox', 'nintendo', 'gaming', 'steam'] },
  sortie: { name: 'Sortie', icon: '🎉', color: '#FF5722', type: 'expense', keywords: ['sortie', 'bar', 'boîte', 'club', 'fête', 'concert', 'spectacle'] },

  // Maison
  loyer: { name: 'Loyer', icon: '🏠', color: '#795548', type: 'expense', keywords: ['loyer', 'appartement', 'logement', 'location'] },
  electricite: { name: 'Électricité', icon: '💡', color: '#FFC107', type: 'expense', keywords: ['électricité', 'edf', 'courant', 'facture électrique'] },
  eau: { name: 'Eau', icon: '💧', color: '#03A9F4', type: 'expense', keywords: ['eau', 'facture eau'] },
  internet: { name: 'Internet/Tel', icon: '📶', color: '#673AB7', type: 'expense', keywords: ['internet', 'wifi', 'téléphone', 'forfait', 'orange', 'sfr', 'free', 'bouygues'] },
  assurance: { name: 'Assurance', icon: '🛡️', color: '#607D8B', type: 'expense', keywords: ['assurance', 'mutuelle', 'axa', 'maif', 'macif'] },

  // Éducation
  education: { name: 'Éducation', icon: '📚', color: '#3F51B5', type: 'expense', keywords: ['école', 'formation', 'cours', 'livre', 'étude', 'université'] },

  // Voyages
  voyage: { name: 'Voyage', icon: '✈️', color: '#00BCD4', type: 'expense', keywords: ['voyage', 'avion', 'billet', 'hôtel', 'vacances', 'airbnb', 'booking'] },

  // Cadeaux
  cadeau: { name: 'Cadeau', icon: '🎁', color: '#E91E63', type: 'expense', keywords: ['cadeau', 'anniversaire', 'noël', 'fête'] },

  // Services
  coiffeur: { name: 'Coiffeur', icon: '💇', color: '#9E9E9E', type: 'expense', keywords: ['coiffeur', 'coiffure', 'barbier', 'cheveux'] },

  // Animaux
  animaux: { name: 'Animaux', icon: '🐾', color: '#8D6E63', type: 'expense', keywords: ['vétérinaire', 'véto', 'chien', 'chat', 'animal', 'croquettes'] },

  // Revenus
  salaire: { name: 'Salaire', icon: '💰', color: '#4CAF50', type: 'income', keywords: ['salaire', 'paie', 'paye', 'travail', 'boulot'] },
  freelance: { name: 'Freelance', icon: '💻', color: '#2196F3', type: 'income', keywords: ['freelance', 'mission', 'client', 'facture', 'projet'] },
  remboursement: { name: 'Remboursement', icon: '↩️', color: '#00BCD4', type: 'income', keywords: ['remboursement', 'remboursé', 'retour'] },
  vente: { name: 'Vente', icon: '🏷️', color: '#FF9800', type: 'income', keywords: ['vente', 'vendu', 'leboncoin', 'vinted'] },
  cadeau_recu: { name: 'Cadeau reçu', icon: '🎁', color: '#E91E63', type: 'income', keywords: ['reçu', 'donné', 'don'] },
  investissement: { name: 'Investissement', icon: '📈', color: '#4CAF50', type: 'income', keywords: ['dividende', 'investissement', 'intérêt', 'bourse', 'crypto'] },

  // Par défaut
  autre: { name: 'Autre', icon: '📝', color: '#9E9E9E', type: 'expense', keywords: [] },
};

// ============================================
// PATTERNS POUR LES MONTANTS
// ============================================
const AMOUNT_PATTERNS = [
  // "50 euros", "50€", "50 €"
  /(\d+(?:[.,]\d{1,2})?)\s*(?:euros?|€)/i,
  // "50 dollars", "50$", "$50"
  /(\d+(?:[.,]\d{1,2})?)\s*(?:dollars?|\$)/i,
  /\$\s*(\d+(?:[.,]\d{1,2})?)/i,
  // Juste un nombre seul (ex: "restaurant 25")
  /\b(\d+(?:[.,]\d{1,2})?)\b/,
];

// ============================================
// PATTERNS POUR LES DATES
// ============================================
const DAYS_MAP = {
  'lundi': 1, 'mardi': 2, 'mercredi': 3, 'jeudi': 4,
  'vendredi': 5, 'samedi': 6, 'dimanche': 0,
  'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
  'friday': 5, 'saturday': 6, 'sunday': 0,
};

const RELATIVE_DATES = {
  "aujourd'hui": 0, 'today': 0,
  'demain': 1, 'tomorrow': 1,
  'après-demain': 2, 'après demain': 2,
  'hier': -1, 'yesterday': -1,
  'avant-hier': -2, 'avant hier': -2,
};

// ============================================
// FONCTIONS D'ANALYSE
// ============================================

/**
 * Trouve la catégorie à partir du texte
 */
function findCategory(text) {
  const lowerText = text.toLowerCase();

  for (const [key, category] of Object.entries(CATEGORIES)) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return { key, ...category };
      }
    }
  }

  return { key: 'autre', ...CATEGORIES.autre };
}

/**
 * Extrait le montant du texte
 */
function extractAmount(text) {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Convertir virgule en point et parser
      const amount = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return null;
}

/**
 * Extrait la date du texte
 */
function extractDate(text) {
  const lowerText = text.toLowerCase();
  const today = new Date();

  // Chercher les dates relatives
  for (const [word, offset] of Object.entries(RELATIVE_DATES)) {
    if (lowerText.includes(word)) {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date;
    }
  }

  // Chercher les jours de la semaine
  for (const [day, dayIndex] of Object.entries(DAYS_MAP)) {
    if (lowerText.includes(day)) {
      const date = new Date(today);
      const currentDay = date.getDay();
      let daysToAdd = dayIndex - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Prochain occurrence
      date.setDate(date.getDate() + daysToAdd);
      return date;
    }
  }

  // Chercher format "le 15" ou "15 janvier"
  const dayMatch = lowerText.match(/le\s+(\d{1,2})/);
  if (dayMatch) {
    const date = new Date(today);
    date.setDate(parseInt(dayMatch[1]));
    // Si le jour est passé, aller au mois prochain
    if (date < today) {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  // Par défaut: aujourd'hui
  return today;
}

/**
 * Extrait l'heure du texte
 */
function extractTime(text) {
  const lowerText = text.toLowerCase();

  // Pattern "15h", "15h30", "15:30"
  const timeMatch = lowerText.match(/(\d{1,2})[h:](\d{0,2})?/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return { hours, minutes };
    }
  }

  // Mots-clés d'heure
  if (lowerText.includes('midi')) return { hours: 12, minutes: 0 };
  if (lowerText.includes('minuit')) return { hours: 0, minutes: 0 };
  if (lowerText.includes('matin')) return { hours: 9, minutes: 0 };
  if (lowerText.includes('soir')) return { hours: 19, minutes: 0 };

  return null;
}

/**
 * Fonction principale: analyse le texte et retourne une transaction
 */
export function parseVoiceInput(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const category = findCategory(text);
  const amount = extractAmount(text);
  const date = extractDate(text);
  const time = extractTime(text);

  // Déterminer si c'est une dépense ou un revenu
  const isIncome = category.type === 'income' ||
                   text.toLowerCase().includes('reçu') ||
                   text.toLowerCase().includes('gagné') ||
                   text.toLowerCase().includes('entré');

  // Créer la transaction
  const transaction = {
    name: category.name,
    category: category.key,
    icon: category.icon,
    color: category.color,
    amount: amount || 0,
    isIncome: isIncome,
    date: date,
    time: time,
    originalText: text,
    confidence: calculateConfidence(category, amount),
  };

  return transaction;
}

/**
 * Calcule un score de confiance
 */
function calculateConfidence(category, amount) {
  let confidence = 0;

  // Catégorie trouvée (pas "autre")
  if (category.key !== 'autre') {
    confidence += 50;
  }

  // Montant trouvé
  if (amount !== null) {
    confidence += 50;
  }

  return confidence;
}

/**
 * Retourne toutes les catégories disponibles
 */
export function getCategories() {
  return CATEGORIES;
}

/**
 * Génère des suggestions basées sur le texte partiel
 */
export function getSuggestions(text) {
  if (!text || text.length < 2) return [];

  const lowerText = text.toLowerCase();
  const suggestions = [];

  for (const [key, category] of Object.entries(CATEGORIES)) {
    for (const keyword of category.keywords) {
      if (keyword.includes(lowerText) || lowerText.includes(keyword)) {
        suggestions.push({
          text: keyword,
          category: category.name,
          icon: category.icon,
        });
        break;
      }
    }
  }

  return suggestions.slice(0, 5);
}

export default {
  parseVoiceInput,
  getCategories,
  getSuggestions,
};
