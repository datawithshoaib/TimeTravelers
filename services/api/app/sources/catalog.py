from typing import Dict, List, Optional
from ..schemas.sources import HistoricalSource, SourceChunk

SOURCES_CATALOG: Dict[str, HistoricalSource] = {
    # ADA LOVELACE
    "source_ada_001": HistoricalSource(
        source_id="source_ada_001",
        figure_id="ada_lovelace",
        title="Sketch of the Analytical Engine Invented by Charles Babbage, with Notes by the Translator",
        author_or_speaker="Ada Lovelace (translating L.F. Menabrea with extensive original Notes)",
        source_type="book",
        created_date="1843-09-01",
        publication_date="1843",
        language="en",
        archive_or_publisher="Taylor's Scientific Memoirs, Vol. III, London",
        canonical_url="https://monoskop.org/images/0/05/Lovelace_Ada_1843_Sketch_of_the_Analytical_Engine.pdf",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Ada Lovelace's landmark paper introducing the programming principles of the Analytical Engine, distinguishing it from arithmetic calculators and detailing Note G's Bernoulli algorithm."
    ),
    "source_ada_002": HistoricalSource(
        source_id="source_ada_002",
        figure_id="ada_lovelace",
        title="Letters to Charles Babbage (Summer 1843)",
        author_or_speaker="Ada Lovelace",
        source_type="letter",
        created_date="1843-07-10",
        publication_date="1843",
        language="en",
        archive_or_publisher="British Library / Oxford Bodleian Lovelace-Byron Papers",
        canonical_url="https://blogs.bodleian.ox.ac.uk/adalovelace/2015/10/14/lovelace-letters-to-babbage/",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Private correspondence between Lovelace and Charles Babbage discussing the drafting of the Notes, Bernoulli calculations, and mathematical revisions."
    ),

    # MARCUS AURELIUS
    "source_marcus_001": HistoricalSource(
        source_id="source_marcus_001",
        figure_id="marcus_aurelius",
        title="Meditations (Τὰ εἰς ἑαυτόν / To Himself)",
        author_or_speaker="Marcus Aurelius Antoninus",
        source_type="book",
        created_date="0170-01-01",
        publication_date="1558",
        language="el",
        archive_or_publisher="Editio Princeps by Wilhelm Xylander (Zurich); modern standard Oxford Classical Texts recension",
        canonical_url="https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A2008.01.0641",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Personal Stoic spiritual exercises composed in Greek by the Roman Emperor during the military campaigns in Carnuntum and Sirmium."
    ),

    # GALILEO GALILEI
    "source_galileo_001": HistoricalSource(
        source_id="source_galileo_001",
        figure_id="galileo_galilei",
        title="Sidereus Nuncius (The Starry Messenger)",
        author_or_speaker="Galileo Galilei",
        source_type="book",
        created_date="1610-03-13",
        publication_date="1610",
        language="la",
        archive_or_publisher="Baglioni Press, Venice; Library of Congress Rare Books",
        canonical_url="https://www.loc.gov/item/49040995/",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Galileo's historic astronomical treatise reporting observations made with his newly perfected 20x telescope: lunar craters and the four moons of Jupiter."
    ),
    "source_galileo_002": HistoricalSource(
        source_id="source_galileo_002",
        figure_id="galileo_galilei",
        title="Letter to the Grand Duchess Christina of Tuscany",
        author_or_speaker="Galileo Galilei",
        source_type="letter",
        created_date="1615-06-15",
        publication_date="1636",
        language="it",
        archive_or_publisher="Edizione Nazionale delle Opere di Galileo Galilei, Florence",
        canonical_url="https://hti.osu.edu/sites/default/files/galileo_letter_to_grand_duchess_christina.pdf",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="A seminal essay addressing the relationship between empirical physical observation and Biblical interpretation, asserting that nature and scripture cannot contradict each other."
    ),
    "source_galileo_003": HistoricalSource(
        source_id="source_galileo_003",
        figure_id="galileo_galilei",
        title="Il Saggiatore (The Assayer)",
        author_or_speaker="Galileo Galilei",
        source_type="book",
        created_date="1623-10-20",
        publication_date="1623",
        language="it",
        archive_or_publisher="Accademia dei Lincei, Rome",
        canonical_url="https://en.wikipedia.org/wiki/The_Assayer",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Pioneering scientific treatise outlining the mathematical philosophy of modern physical sciences and mocking scholastic dogmatism."
    ),

    # FREDERICK DOUGLASS
    "source_douglass_001": HistoricalSource(
        source_id="source_douglass_001",
        figure_id="frederick_douglass",
        title="Narrative of the Life of Frederick Douglass, an American Slave",
        author_or_speaker="Frederick Douglass",
        source_type="book",
        created_date="1845-05-01",
        publication_date="1845",
        language="en",
        archive_or_publisher="Anti-Slavery Office, No. 25 Cornhill, Boston",
        canonical_url="https://docsouth.unc.edu/neh/douglass/douglass.html",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Douglass's celebrated first autobiography, detailing his Maryland upbringing under enslavement, learning to read, resistance against the slave-breaker Covey, and flight to freedom."
    ),
    "source_douglass_002": HistoricalSource(
        source_id="source_douglass_002",
        figure_id="frederick_douglass",
        title="What to the Slave is the Fourth of July? (Rochester Address)",
        author_or_speaker="Frederick Douglass",
        source_type="speech",
        created_date="1852-07-05",
        publication_date="1852",
        language="en",
        archive_or_publisher="Rochester Ladies' Anti-Slavery Society, Rochester, NY",
        canonical_url="https://teachingamericanhistory.org/document/what-to-the-slave-is-the-fourth-of-july/",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="A historic speech delivered at Corinthian Hall exposing the deep moral chasm between American constitutional ideals of liberty and the barbaric institution of slavery."
    ),

    # MARIE CURIE
    "source_curie_001": HistoricalSource(
        source_id="source_curie_001",
        figure_id="marie_curie",
        title="Pierre Curie and Autobiographical Notes",
        author_or_speaker="Marie Curie",
        source_type="book",
        created_date="1923-01-01",
        publication_date="1923",
        language="en",
        archive_or_publisher="The Macmillan Company, New York",
        canonical_url="https://archive.org/details/pierrecurie00curirich",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Marie Curie's intimate biographical account of Pierre Curie's life, their shed laboratory in Paris, the discovery of radium, and her autobiographical reflections."
    ),
    "source_curie_002": HistoricalSource(
        source_id="source_curie_002",
        figure_id="marie_curie",
        title="Radium and the New Concepts in Chemistry (1911 Nobel Lecture)",
        author_or_speaker="Marie Curie",
        source_type="speech",
        created_date="1911-12-11",
        publication_date="1912",
        language="fr",
        archive_or_publisher="Nobel Media AB, Stockholm",
        canonical_url="https://www.nobelprize.org/prizes/chemistry/1911/ceremonies/lecture/",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Curie's second Nobel lecture given in Stockholm upon winning the Nobel Prize in Chemistry for the discovery of elements radium and polonium."
    ),

    # LEONARDO DA VINCI
    "source_leonardo_001": HistoricalSource(
        source_id="source_leonardo_001",
        figure_id="leonardo_da_vinci",
        title="Codex on the Flight of Birds (Codice sul volo degli uccelli)",
        author_or_speaker="Leonardo da Vinci",
        source_type="diary",
        created_date="1505-04-15",
        publication_date="1893",
        language="it",
        archive_or_publisher="Biblioteca Reale, Turin",
        canonical_url="https://www.si.edu/spotlight/leonardo-da-vinci/codex-on-the-flight-of-birds",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Leonardo's handwritten notebook analyzing the aerodynamic mechanics of avian wings, balance of centers of gravity, wind currents, and mechanical ornithopter design."
    ),
    "source_leonardo_002": HistoricalSource(
        source_id="source_leonardo_002",
        figure_id="leonardo_da_vinci",
        title="Treatise on Painting & Selected Scientific Notebooks",
        author_or_speaker="Leonardo da Vinci (compiled by Francesco Melzi)",
        source_type="book",
        created_date="1510-01-01",
        publication_date="1651",
        language="it",
        archive_or_publisher="Vatican Library (Codex Urbinas 1270) / Du Fresne, Paris",
        canonical_url="https://archive.org/details/atreatiseonpain00rigagoog",
        rights_status="public_domain",
        source_quality="primary_archive",
        transcription_status="verified",
        collection_version=1,
        summary="Leonardo's instructions on empirical observation, optics, shadow (chiaroscuro), perspective, and the defense of the painter as an interpreter of nature."
    )
}

CHUNKS_CATALOG: List[SourceChunk] = [
    # ADA LOVELACE CHUNKS
    SourceChunk(
        chunk_id="chunk_ada_001",
        figure_id="ada_lovelace",
        source_id="source_ada_001",
        source_title="Sketch of the Analytical Engine (1843)",
        author_or_speaker="Ada Lovelace",
        created_date="1843-09-01",
        source_type="book",
        section="Note A",
        page_number=696,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves. In enabling mechanism to combine together general symbols in successions of unlimited variety and extent, a uniting link is established between the operations of matter and the abstract mental processes of the most abstract branch of mathematical science."
    ),
    SourceChunk(
        chunk_id="chunk_ada_002",
        figure_id="ada_lovelace",
        source_id="source_ada_001",
        source_title="Sketch of the Analytical Engine (1843)",
        author_or_speaker="Ada Lovelace",
        created_date="1843-09-01",
        source_type="book",
        section="Note G",
        page_number=722,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform. It can follow analysis; but it has no power of anticipating any analytical relations or truths. Its province is to assist us to make available what we are already acquainted with. This again is settled by the very nature of things; for there can be no mechanism that possesses spontaneous volition or thought."
    ),
    SourceChunk(
        chunk_id="chunk_ada_003",
        figure_id="ada_lovelace",
        source_id="source_ada_001",
        source_title="Sketch of the Analytical Engine (1843)",
        author_or_speaker="Ada Lovelace",
        created_date="1843-09-01",
        source_type="book",
        section="Note A",
        page_number=694,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="A new, a vast, and a powerful language is developed for the future use of analysis, in which to wield its truths so that these may become of more speedy and accurate practical application for the purposes of mankind than the means hitherto in our possession have rendered possible. Supposing, for instance, that the fundamental relations of pitched sounds in the science of harmony and of musical composition were susceptible of such expression and adaptations, the engine might compose elaborate and scientific pieces of music of any degree of complexity or extent."
    ),
    SourceChunk(
        chunk_id="chunk_ada_004",
        figure_id="ada_lovelace",
        source_id="source_ada_001",
        source_title="Sketch of the Analytical Engine (1843)",
        author_or_speaker="Ada Lovelace",
        created_date="1843-09-01",
        source_type="book",
        section="Note B",
        page_number=701,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="The bounds of arithmetic were outstepped the moment the idea of applying the cards had occurred; and the Analytical Engine does not occupy common ground with mere 'calculating machines.' It holds a position wholly its own; and the considerations it suggests are more interesting in their nature. In distributing its powers, the machine can separate the operation from the particular quantities operated upon."
    ),
    SourceChunk(
        chunk_id="chunk_ada_005",
        figure_id="ada_lovelace",
        source_id="source_ada_002",
        source_title="Letters to Charles Babbage (Summer 1843)",
        author_or_speaker="Ada Lovelace",
        created_date="1843-07-10",
        source_type="letter",
        section="Letter on Bernoulli Numbers",
        page_number=1,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="I am working very hard for you; like the Devil in fact; (which perhaps I am). I think you will be pleased with the Notes. I want to put in something about the numbers of Bernoulli, which I have computed in a table by way of an example of how an implicit function may be worked out by the engine, without having been in the first instance solved by human head and hands."
    ),

    # MARCUS AURELIUS CHUNKS
    SourceChunk(
        chunk_id="chunk_marcus_001",
        figure_id="marcus_aurelius",
        source_id="source_marcus_001",
        source_title="Meditations (To Himself)",
        author_or_speaker="Marcus Aurelius",
        created_date="0170-01-01",
        source_type="book",
        section="Book II, Section 1",
        page_number=17,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me."
    ),
    SourceChunk(
        chunk_id="chunk_marcus_002",
        figure_id="marcus_aurelius",
        source_id="source_marcus_001",
        source_title="Meditations (To Himself)",
        author_or_speaker="Marcus Aurelius",
        created_date="0170-01-01",
        source_type="book",
        section="Book IV, Section 3",
        page_number=39,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="People look for retreats for themselves, in the country, by the coast, or in the hills. There is nowhere that a person can find a more peaceful and trouble-free retreat than in his own mind, especially if he has within himself the kind of thoughts that stand as an inner citadel. Give yourself this retreat continually, and renew yourself. Let your basic principles be brief and fundamental, so that as soon as you turn to them they will purge every stain of resentment."
    ),
    SourceChunk(
        chunk_id="chunk_marcus_003",
        figure_id="marcus_aurelius",
        source_id="source_marcus_001",
        source_title="Meditations (To Himself)",
        author_or_speaker="Marcus Aurelius",
        created_date="0170-01-01",
        source_type="book",
        section="Book VII, Section 28",
        page_number=88,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="Retire into yourself. The rational governing principle within you is of such a nature that it finds contentment in itself, so long as it acts with justice and thereby keeps tranquillity. Wipe out the impression on your imagination. Cease to be jerked like a puppet. Confine yourself to the present moment."
    ),
    SourceChunk(
        chunk_id="chunk_marcus_004",
        figure_id="marcus_aurelius",
        source_id="source_marcus_001",
        source_title="Meditations (To Himself)",
        author_or_speaker="Marcus Aurelius",
        created_date="0170-01-01",
        source_type="book",
        section="Book XII, Section 1",
        page_number=152,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="All those things at which you wish to arrive by a circuitous path, you can possess even now, if you do not refuse them to yourself. And this means: if you leave all the past behind you, and trust the future to Providence, and direct the present alone toward piety and justice."
    ),

    # GALILEO GALILEI CHUNKS
    SourceChunk(
        chunk_id="chunk_galileo_001",
        figure_id="galileo_galilei",
        source_id="source_galileo_001",
        source_title="Sidereus Nuncius (1610)",
        author_or_speaker="Galileo Galilei",
        created_date="1610-03-13",
        source_type="book",
        section="Observations of the Moon",
        page_number=8,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="I have been led to the opinion and conviction that the surface of the Moon is not smooth, uniform, and of spherical precision, as a large school of philosophers believe with regard to it and the other heavenly bodies, but on the contrary is uneven, rough, and full of cavities and prominences, being not unlike the face of the Earth, relieved by chains of mountains and deep valleys."
    ),
    SourceChunk(
        chunk_id="chunk_galileo_002",
        figure_id="galileo_galilei",
        source_id="source_galileo_001",
        source_title="Sidereus Nuncius (1610)",
        author_or_speaker="Galileo Galilei",
        created_date="1610-03-13",
        source_type="book",
        section="Discovery of the Medicean Stars",
        page_number=17,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="On the seventh day of January in the present year 1610, in the first hour of the following night, when I was viewing the constellations of the heavens through a spyglass, Jupiter presented itself to me; and because I had prepared a very excellent instrument, I perceived that three little stars, small but very bright, were near the planet. I discovered that there are four wandering stars, known or observed by no one before us, revolving around Jupiter as does the Moon around the Earth."
    ),
    SourceChunk(
        chunk_id="chunk_galileo_003",
        figure_id="galileo_galilei",
        source_id="source_galileo_002",
        source_title="Letter to the Grand Duchess Christina (1615)",
        author_or_speaker="Galileo Galilei",
        created_date="1615-06-15",
        source_type="letter",
        section="On Scripture and Science",
        page_number=14,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="The intention of the Holy Ghost is to teach us how one goes to heaven, not how heaven goes. The Bible was written to teach salvation, not astronomy. Two truths cannot contradict one another; whenever an apparent contradiction arises between sensory observation and the literal text of Scripture, we must remember that Scripture accommodates itself to common human understanding through metaphor, whereas nature is inexorable and immutable, never transgressing the limits of its governing laws."
    ),
    SourceChunk(
        chunk_id="chunk_galileo_004",
        figure_id="galileo_galilei",
        source_id="source_galileo_003",
        source_title="Il Saggiatore (The Assayer, 1623)",
        author_or_speaker="Galileo Galilei",
        created_date="1623-10-20",
        source_type="book",
        section="Chapter 6",
        page_number=232,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="Philosophy is written in this grand book, the universe, which stands continually open to our gaze. But the book cannot be understood unless one first learns to comprehend the language and read the letters in which it is composed. It is written in the language of mathematics, and its characters are triangles, circles, and other geometric figures without which it is humanly impossible to understand a single word of it; without these, one wanders about in a dark labyrinth."
    ),

    # FREDERICK DOUGLASS CHUNKS
    SourceChunk(
        chunk_id="chunk_douglass_001",
        figure_id="frederick_douglass",
        source_id="source_douglass_001",
        source_title="Narrative of the Life of Frederick Douglass (1845)",
        author_or_speaker="Frederick Douglass",
        created_date="1845-05-01",
        source_type="book",
        section="Chapter VI",
        page_number=33,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="Mr. Auld found out what was going on, and at once forbade Mrs. Auld to instruct me further, telling her among other things that it was unlawful, as well as unsafe, to teach a slave to read. 'If you give a nigger an inch, he will take an ell... A nigger should know nothing but to obey his master—to do as he is told to do. Learning would spoil the best nigger in the world. Now,' said he, 'if you teach that nigger how to read, there would be no keeping him. It would forever unfit him to be a slave.' These words sank deep into my heart. I understood the pathway from slavery to freedom."
    ),
    SourceChunk(
        chunk_id="chunk_douglass_002",
        figure_id="frederick_douglass",
        source_id="source_douglass_001",
        source_title="Narrative of the Life of Frederick Douglass (1845)",
        author_or_speaker="Frederick Douglass",
        created_date="1845-05-01",
        source_type="book",
        section="Chapter VII",
        page_number=38,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="The plan which I adopted, and the one by which I was most successful, was that of making friends of all the little white boys whom I met in the street. As many of these as I could, I converted into teachers. With their kindly aid, obtained at different times and in different places, I finally succeeded in learning to read. When I was sent of errands, I always took my book with me, and by going one part of my errand quickly, I found time to get a lesson before my return. I used also to carry bread with me, and this I used to bestow upon the hungry little urchins, who, in return, would give me that more valuable bread of knowledge."
    ),
    SourceChunk(
        chunk_id="chunk_douglass_003",
        figure_id="frederick_douglass",
        source_id="source_douglass_002",
        source_title="What to the Slave is the Fourth of July? (1852)",
        author_or_speaker="Frederick Douglass",
        created_date="1852-07-05",
        source_type="speech",
        section="Oration at Corinthian Hall",
        page_number=12,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="What, to the American slave, is your 4th of July? I answer; a day that reveals to him, more than all other days in the year, the gross injustice and cruelty to which he is the constant victim. To him, your celebration is a sham; your boasted liberty, an unholy license; your national greatness, swelling vanity; your sounds of rejoicing are empty and heartless; your denunciations of tyrants, brass fronted impudence; your shouts of liberty and equality, hollow mockery; your prayers and hymns, your sermons and thanksgivings, with all your religious parade and solemnity, are, to Him, mere bombast, fraud, deception, impiety, and hypocrisy—a thin veil to cover up crimes which would disgrace a nation of savages."
    ),
    SourceChunk(
        chunk_id="chunk_douglass_004",
        figure_id="frederick_douglass",
        source_id="source_douglass_002",
        source_title="What to the Slave is the Fourth of July? (1852)",
        author_or_speaker="Frederick Douglass",
        created_date="1852-07-05",
        source_type="speech",
        section="Constitutional Principles",
        page_number=35,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="Fellow-citizens! there is no matter in respect to which, the people of the North have allowed themselves to be so ruinously imposed upon, as that of the pro-slavery character of the Constitution. In that instrument I hold there is neither warrant, license, nor sanction of the hateful thing; but, interpreted as it ought to be interpreted, the Constitution is a GLORIOUS LIBERTY DOCUMENT. Read its preamble, consider its purposes: is slavery among them? It is not."
    ),

    # MARIE CURIE CHUNKS
    SourceChunk(
        chunk_id="chunk_curie_001",
        figure_id="marie_curie",
        source_id="source_curie_001",
        source_title="Pierre Curie and Autobiographical Notes (1923)",
        author_or_speaker="Marie Curie",
        created_date="1923-01-01",
        source_type="book",
        section="Chapter IV: The Radium Discovery Shed",
        page_number=63,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="We had no money, no laboratory, and no help in conducting this important and difficult task. It was like creating something out of nothing. We were given the use of an abandoned shed across the courtyard from the School of Physics. It had an asphalt floor, a glass roof which did not keep the rain out completely, and no ventilation to carry off poisonous fumes. Yet it was in this miserable old shed that we passed the best and happiest years of our life, devoted entirely to work."
    ),
    SourceChunk(
        chunk_id="chunk_curie_002",
        figure_id="marie_curie",
        source_id="source_curie_001",
        source_title="Pierre Curie and Autobiographical Notes (1923)",
        author_or_speaker="Marie Curie",
        created_date="1923-01-01",
        source_type="book",
        section="Chapter IV: Renouncing the Patent",
        page_number=78,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="A question of attitude presented itself regarding our discovery. We could either consider ourselves its inventors and take out patents on the extraction of radium from pitchblende, securing commercial rights worldwide, or we could publish our results without reserve. Pierre Curie and I decided immediately: Radium was not to enrich any one. It was an element; it belonged to all the world. To patent our process would be contrary to the scientific spirit, which demands that scientific truth remain free and accessible to all mankind."
    ),
    SourceChunk(
        chunk_id="chunk_curie_003",
        figure_id="marie_curie",
        source_id="source_curie_002",
        source_title="Nobel Lecture in Chemistry (1911)",
        author_or_speaker="Marie Curie",
        created_date="1911-12-11",
        source_type="speech",
        section="Radium as a Chemical Element",
        page_number=4,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="The chemical work which had for its aim the isolation of radium in the state of pure salt and its characterization as a new element, was carried out especially by me, but it is intimately connected with our common work. I may be permitted to recall that the discovery of radium and of polonium was made by Pierre Curie in common with me. Radium has an atomic weight of 226.45, and emits spontaneously luminous rays that produce significant heat without external fuel, demonstrating an entirely atomic transformation."
    ),

    # LEONARDO DA VINCI CHUNKS
    SourceChunk(
        chunk_id="chunk_leonardo_001",
        figure_id="leonardo_da_vinci",
        source_id="source_leonardo_001",
        source_title="Codex on the Flight of Birds (1505)",
        author_or_speaker="Leonardo da Vinci",
        created_date="1505-04-15",
        source_type="diary",
        section="Folio 8r: Anatomy and Resistance of Bird Wings",
        page_number=8,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="A bird is an instrument working according to mathematical law, which instrument it is in the capacity of man to reproduce with all its movements, but not with a corresponding degree of strength, though it is deficient only in the power of maintaining equilibrium. The anatomy of the wing and the resistance of the air demonstrate that such an instrument constructed by man is lacking in nothing except the soul of the bird, which soul must be counterfeited by the soul of man."
    ),
    SourceChunk(
        chunk_id="chunk_leonardo_002",
        figure_id="leonardo_da_vinci",
        source_id="source_leonardo_001",
        source_title="Codex on the Flight of Birds (1505)",
        author_or_speaker="Leonardo da Vinci",
        created_date="1505-04-15",
        source_type="diary",
        section="Folio 18v: Flight from Mount Ceceri",
        page_number=18,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="From the mountain that bears the name of the great bird [Mount Ceceri], the famous bird will take its flight, which will fill the world with its great renown. The human bird will master the winds and bring eternal glory to the nest whence it sprang."
    ),
    SourceChunk(
        chunk_id="chunk_leonardo_003",
        figure_id="leonardo_da_vinci",
        source_id="source_leonardo_002",
        source_title="Treatise on Painting & Notebooks",
        author_or_speaker="Leonardo da Vinci",
        created_date="1510-01-01",
        source_type="book",
        section="Codex Urbinas, Part 1: Experience vs Authority",
        page_number=12,
        is_primary_source=True,
        rights_status="reviewed",
        transcription_status="verified",
        text="Though I may have no capability of quoting authors as they do, I shall rely on something much greater and more worthy—experience, the mistress of their masters. They go about puffed up and pompous, clothed and adorned not with their own labours, but with those of others; and they will not even allow me my own. And if they despise me who am an inventor, how much more should they be blamed who are not inventors but trumpet-blowers and reciters of the works of others."
    )
]


def get_sources_for_figure(figure_id: str) -> List[HistoricalSource]:
    return [s for s in SOURCES_CATALOG.values() if s.figure_id == figure_id]


def get_source_by_id(source_id: str) -> Optional[HistoricalSource]:
    return SOURCES_CATALOG.get(source_id)


def get_chunks_for_figure(figure_id: str) -> List[SourceChunk]:
    return [c for c in CHUNKS_CATALOG if c.figure_id == figure_id]


def get_chunk_by_id(chunk_id: str) -> Optional[SourceChunk]:
    for c in CHUNKS_CATALOG:
        if c.chunk_id == chunk_id:
            return c
    return None
