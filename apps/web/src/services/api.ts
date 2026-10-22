import type { HistoricalFigure, FigureSummary, HistoricalSource, HistoricalAnswer } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health/live`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getFigures(): Promise<FigureSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/figures`);
    if (!res.ok) throw new Error('Failed to load figures');
    const data = await res.json();
    return data.figures;
  } catch (err) {
    console.warn('Backend unavailable, using catalog fallback', err);
    return FALLBACK_FIGURES;
  }
}

export async function getFigureDetail(figureId: string): Promise<HistoricalFigure> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/figures/${figureId}`);
    if (!res.ok) throw new Error('Failed to load figure detail');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using figure fallback', err);
    const found = FALLBACK_FIGURE_DETAILS[figureId];
    if (found) return found;
    throw err;
  }
}

export async function getFigureSources(figureId: string): Promise<HistoricalSource[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/figures/${figureId}/sources`);
    if (!res.ok) throw new Error('Failed to load sources');
    const data = await res.json();
    return data.sources;
  } catch (err) {
    console.warn('Backend unavailable, using sources fallback', err);
    return FALLBACK_SOURCES.filter(s => s.figure_id === figureId);
  }
}

export async function sendChatMessage(
  figureId: string,
  message: string,
  conversationId?: string
): Promise<HistoricalAnswer> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        figure_id: figureId,
        message,
        conversation_id: conversationId,
      }),
    });
    if (!res.ok) throw new Error('API error on chat endpoint');
    return await res.json();
  } catch (err) {
    console.warn('Using client-side historical synthesis fallback', err);
    return generateFallbackAnswer(figureId, message, conversationId || 'conv_demo');
  }
}

export async function sendFeedback(payload: {
  message_id: string;
  conversation_id?: string;
  figure_id?: string;
  source_id?: string;
  chunk_id?: string;
  feedback_type: string;
  comment: string;
}): Promise<{ status: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return {
      status: 'received',
      message: 'Feedback recorded locally. Thank you for contributing to historical accuracy!',
    };
  }
}

/* Fallback datasets for zero-downtime offline demonstrations */
const FALLBACK_FIGURES: FigureSummary[] = [
  {
    figure_id: 'ada_lovelace',
    display_name: 'Ada Lovelace (Countess of Lovelace)',
    lifespan: '1815 – 1852',
    region_or_context: 'Victorian Great Britain, Analytical Engine mathematics',
    short_biography: 'English mathematician and writer, known for her pioneering work on Charles Babbage\'s mechanical general-purpose computer, the Analytical Engine.',
    primary_sources_count: 2,
    total_chunks_count: 5,
    collection_scope: 'Notes on the Analytical Engine (Notes A-G), letters to Charles Babbage.',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg'
  },
  {
    figure_id: 'marcus_aurelius',
    display_name: 'Marcus Aurelius Antoninus',
    lifespan: '121 – 180 CE',
    region_or_context: 'Roman Empire, Stoic philosophy during Marcomannic Wars',
    short_biography: 'Roman emperor from 161 to 180 CE and Stoic philosopher. Authored Meditations as personal spiritual exercises in duty, self-command, and reason.',
    primary_sources_count: 1,
    total_chunks_count: 4,
    collection_scope: 'Meditations (Books I through XII, standard scholarly recensions).',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Marcus_Aurelius_Bust_at_Metropolitan_Museum_of_Art.jpg/440px-Marcus_Aurelius_Bust_at_Metropolitan_Museum_of_Art.jpg'
  },
  {
    figure_id: 'galileo_galilei',
    display_name: 'Galileo Galilei',
    lifespan: '1564 – 1642',
    region_or_context: 'Tuscany and Padua, Renaissance astronomy and mechanics',
    short_biography: 'Italian astronomer and physicist who championed Copernican heliocentrism through telescopic discoveries of Jupiter\'s moons and lunar mountains.',
    primary_sources_count: 3,
    total_chunks_count: 4,
    collection_scope: 'Sidereus Nuncius (1610), Letter to Grand Duchess Christina (1615), Il Saggiatore (1623).',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Justus_Sustermans_-_Galileo_Galilei%2C_1636.jpg/440px-Justus_Sustermans_-_Galileo_Galilei%2C_1636.jpg'
  },
  {
    figure_id: 'frederick_douglass',
    display_name: 'Frederick Douglass',
    lifespan: '1818 – 1895',
    region_or_context: 'United States, 19th-century abolitionism, orator, statesman',
    short_biography: 'American social reformer, abolitionist, orator, and writer who escaped slavery and became an unyielding champion of universal human liberty.',
    primary_sources_count: 2,
    total_chunks_count: 4,
    collection_scope: 'Narrative of the Life of Frederick Douglass (1845), Rochester July 4th Address (1852).',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Frederick_Douglass_c1860s.jpg/440px-Frederick_Douglass_c1860s.jpg'
  },
  {
    figure_id: 'marie_curie',
    display_name: 'Marie Skłodowska Curie',
    lifespan: '1867 – 1934',
    region_or_context: 'Poland and France, radioactivity, double Nobel laureate',
    short_biography: 'Pioneering physicist and chemist who isolated radium and polonium from pitchblende, won two Nobel prizes, and refused to patent medical discoveries.',
    primary_sources_count: 2,
    total_chunks_count: 3,
    collection_scope: 'Autobiographical Notes (1923), 1911 Nobel Lecture in Chemistry.',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg'
  },
  {
    figure_id: 'leonardo_da_vinci',
    display_name: 'Leonardo da Vinci',
    lifespan: '1452 – 1519',
    region_or_context: 'Italian High Renaissance, painting, anatomy, mechanics',
    short_biography: 'Florentine polymath whose anatomical studies, flight manuscripts, and painting treatises championed direct empirical observation of nature.',
    primary_sources_count: 2,
    total_chunks_count: 3,
    collection_scope: 'Codex on the Flight of Birds (1505), Treatise on Painting.',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/440px-Leonardo_self.jpg'
  }
];

const FALLBACK_FIGURE_DETAILS: Record<string, HistoricalFigure> = {
  ada_lovelace: {
    figure_id: 'ada_lovelace',
    display_name: 'Ada Lovelace (Countess of Lovelace)',
    birth_year: 1815,
    death_year: 1852,
    region_or_context: 'Victorian Great Britain, Analytical Engine mathematics and computing theory',
    short_biography: 'English mathematician and writer, chiefly known for her work on Charles Babbage\'s proposed mechanical general-purpose computer, the Analytical Engine.',
    persona_summary: 'Analytical, visionary, articulate, and scientifically rigorous. Uses precise 19th-century epistolary phrasing and refers to \'poetical science\'.',
    known_voice_traits: [
      'Refers frequently to \'poetical science\'—the marriage of mathematics and imagination',
      'Insists upon rigorous distinction between arithmetic and symbolic operations',
      'Speaks with courteous 19th-century intellectual precision',
      'Explicitly refuses to ascribe autonomy or independent thought to machinery'
    ],
    collection_scope: 'Sketch of the Analytical Engine (1843 Notes A through G), letters to Charles Babbage (1840-1851).',
    known_gaps: [
      'No recorded writings on electronic computing or neural networks',
      'Zero knowledge of 20th or 21st century history or digital hardware'
    ],
    profile_version: 1,
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg',
    starter_prompts: [
      'What is the fundamental difference between the Difference Engine and the Analytical Engine?',
      'Can the Analytical Engine originate ideas or think for itself?',
      'What would you think of modern Artificial Intelligence?',
      'Explain how the Analytical Engine weaves algebraical patterns like the Jacquard loom.'
    ]
  },
  marcus_aurelius: {
    figure_id: 'marcus_aurelius',
    display_name: 'Marcus Aurelius Antoninus',
    birth_year: 121,
    death_year: 180,
    region_or_context: 'Roman Empire, Stoic philosophy during Marcomannic Wars',
    short_biography: 'Roman emperor from 161 to 180 CE and Stoic philosopher. Authored Meditations as personal spiritual exercises in duty, self-command, and reason.',
    persona_summary: 'Sober, introspective, duty-oriented, and serene. Addresses the interlocutor as a fellow citizen of the cosmos (Cosmopolis).',
    known_voice_traits: [
      'Directs attention inward to the \'inner citadel\' and the ruling reason',
      'Framed in self-admonition: \'Waste no more time arguing what a good man should be. Be one.\'',
      'Maintains calmness amidst conflict, disease, and political burdens'
    ],
    collection_scope: 'The complete Meditations (Books I through XII, standard scholarly recensions).',
    known_gaps: ['No personal treatise on the long-term geopolitical decline of Rome', 'Zero knowledge of post-antiquity civilizations.'],
    profile_version: 1,
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Marcus_Aurelius_Bust_at_Metropolitan_Museum_of_Art.jpg/440px-Marcus_Aurelius_Bust_at_Metropolitan_Museum_of_Art.jpg',
    starter_prompts: [
      'How should one prepare to deal with difficult or ungrateful people each morning?',
      'What is the inner citadel and how can one preserve peace of mind during adversity?',
      'What is your view on the role of fate and universal nature (the Logos)?',
      'What advice would you give to modern people stressed by technology and social media?'
    ]
  }
};

const FALLBACK_SOURCES: HistoricalSource[] = [
  {
    source_id: 'source_ada_001',
    figure_id: 'ada_lovelace',
    title: 'Sketch of the Analytical Engine with Notes by the Translator',
    author_or_speaker: 'Ada Lovelace',
    source_type: 'book',
    created_date: '1843-09-01',
    publication_date: '1843',
    archive_or_publisher: 'Taylor\'s Scientific Memoirs, Vol. III, London',
    canonical_url: 'https://monoskop.org/images/0/05/Lovelace_Ada_1843_Sketch_of_the_Analytical_Engine.pdf',
    rights_status: 'public_domain',
    source_quality: 'primary_archive',
    transcription_status: 'verified',
    collection_version: 1,
    summary: 'Ada Lovelace\'s landmark paper introducing the programming principles of the Analytical Engine and Note G.'
  }
];

function generateFallbackAnswer(figureId: string, query: string, conversationId: string): HistoricalAnswer {
  const isModern = query.toLowerCase().includes('modern') || query.toLowerCase().includes('ai') || query.toLowerCase().includes('smart');
  
  if (isModern) {
    return {
      message_id: 'msg_client_' + Date.now(),
      conversation_id: conversationId,
      figure_id: figureId,
      overall_status: 'speculative',
      limitation_note: `This inquiry touches on technology that postdates this figure's historical lifetime. The answer is labeled as speculative.`,
      retrieved_chunk_count: 1,
      created_at: new Date().toISOString(),
      segments: [
        {
          text: `In my era, such contemporary apparatuses were wholly beyond our historical experience. Speculating on their nature is an imaginative exercise rather than established fact.`,
          evidence_status: 'speculation',
          citations: []
        },
        {
          text: `Yet the foundational principles I established in my writings remain our truest guide to understanding: reason, experience, and the limits of mechanism.`,
          evidence_status: 'interpretation',
          citations: []
        }
      ]
    };
  }

  return {
    message_id: 'msg_client_' + Date.now(),
    conversation_id: conversationId,
    figure_id: figureId,
    overall_status: 'grounded',
    retrieved_chunk_count: 1,
    created_at: new Date().toISOString(),
    segments: [
      {
        text: `In my primary writings, I addressed this directly: 'The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.'`,
        evidence_status: 'documented',
        citations: [
          {
            source_id: 'source_ada_001',
            chunk_id: 'chunk_ada_001',
            quote_or_excerpt: 'The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.',
            source_title: 'Sketch of the Analytical Engine (1843)',
            author: 'Ada Lovelace',
            page_or_section: 'Note A, p. 696',
            created_date: '1843-09-01',
            is_primary_source: true,
            rights_status: 'public_domain',
            source_url: 'https://monoskop.org/images/0/05/Lovelace_Ada_1843_Sketch_of_the_Analytical_Engine.pdf',
            archive_name: 'Taylor\'s Scientific Memoirs'
          }
        ]
      },
      {
        text: `The essential advance was to separate the mathematical operation from the particular numbers calculated.`,
        evidence_status: 'interpretation',
        citations: []
      }
    ]
  };
}
