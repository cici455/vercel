// The Mythological Database for Lumina
// Tone: Epic, Archetypal, Sacred Blueprint, "Soul Operating System"

interface SignContent {
  sun: { title: string; subtitle: string; notes: { meaning: string; practice: string } };
  moon: { title: string; subtitle: string; notes: { meaning: string; practice: string } };
  rising: { title: string; subtitle: string; notes: { meaning: string; practice: string } };
  mercury: { epithet: string; notes: { meaning: string; practice: string } };
  venus: { epithet: string; notes: { meaning: string; practice: string } };
  mars: { epithet: string; notes: { meaning: string; practice: string } };
  jupiter: { epithet: string; notes: { meaning: string; practice: string } };
  saturn: { epithet: string; notes: { meaning: string; practice: string } };
}

export const ZODIAC_CONTENT: Record<string, SignContent> = {
  aries: {
    sun: { 
      title: "THE VANGUARD", 
      subtitle: "Igniting the first spark of creation.",
      notes: {
        meaning: "You carry the primal fire that begins all cycles, leading where others hesitate to tread.",
        practice: "Start one thing today before you feel ready."
      }
    },
    moon: { 
      title: "THE WILDFIRE", 
      subtitle: "Emotions that burn, consume, and renew.",
      notes: {
        meaning: "Your inner world is a rapid combustion engine, processing feelings with immediate intensity.",
        practice: "Move your body when anger rises; let the heat release through action."
      }
    },
    rising: { 
      title: "THE WARRIOR", 
      subtitle: "Forging a path through the storm with iron will.",
      notes: {
        meaning: "You meet the world head-on, your presence cutting through ambiguity like a sharpened blade.",
        practice: "Walk into a room as if you own the space."
      }
    },
    mercury: { epithet: "The Flash Insight", notes: { meaning: "Thoughts strike like lightning, illuminating the solution instantly.", practice: "Trust your first instinct; do not over-analyze." } },
    venus: { epithet: "The Huntress Heart", notes: { meaning: "Love is a chase, a conquest of passion and directness.", practice: "Express your desire without playing games." } },
    mars: { epithet: "The Iron Will", notes: { meaning: "Action is immediate, decisive, and fueled by raw courage.", practice: "Tackle the hardest task first." } },
    jupiter: { epithet: "The King's Conquest", notes: { meaning: "Luck favors the bold and those who dare to expand territory.", practice: "Take a risk on a new venture." } },
    saturn: { epithet: "The Stoic General", notes: { meaning: "Discipline is forged in the heat of self-reliance and restraint.", practice: "Finish what you start, no matter the resistance." } }
  },
  taurus: {
    sun: { 
      title: "THE BUILDER", 
      subtitle: "Cultivating the eternal garden from chaos.",
      notes: {
        meaning: "You anchor the abstract into the material, creating value that outlasts the season.",
        practice: "Touch something living (soil, wood, stone) to ground yourself."
      }
    },
    moon: { 
      title: "THE SANCTUARY", 
      subtitle: "A fortress of peace in a turbulent world.",
      notes: {
        meaning: "Your soul seeks the stability of the earth, finding safety in silence and sensory comfort.",
        practice: "Prepare a meal slowly; savor the process."
      }
    },
    rising: { 
      title: "THE SENTINEL", 
      subtitle: "Unmovable presence in the face of shifting tides.",
      notes: {
        meaning: "You project an aura of calm permanence, a rock in the rushing river of life.",
        practice: "Stand still for five minutes and just breathe."
      }
    },
    mercury: { epithet: "The Earthly Sage", notes: { meaning: "Wisdom comes from practical application and tangible results.", practice: "Speak only what you know to be true." } },
    venus: { epithet: "The Garden's Keeper", notes: { meaning: "Beauty is cultivated through patience and deep appreciation of form.", practice: "Buy yourself flowers or tend to a plant." } },
    mars: { epithet: "The Bull's Charge", notes: { meaning: "Power builds slowly, then releases with unstoppable momentum.", practice: "Persist when others quit." } },
    jupiter: { epithet: "The Golden Harvest", notes: { meaning: "Abundance flows to those who value the earth and its resources.", practice: "Invest in quality, not quantity." } },
    saturn: { epithet: "The Stone Fortress", notes: { meaning: "Security is built brick by brick, through unyielding consistency.", practice: "Review your finances or long-term plans." } }
  },
  gemini: {
    sun: { 
      title: "THE WEAVER", 
      subtitle: "Connecting the threads of a fragmented reality.",
      notes: {
        meaning: "You are the bridge between disparate worlds, finding the hidden link in every conversation.",
        practice: "Write down two unrelated ideas and find the connection."
      }
    },
    moon: { 
      title: "THE MIRROR", 
      subtitle: "Reflecting a thousand faces of the truth.",
      notes: {
        meaning: "Your feelings are a kaleidoscope, shifting rapidly to understand every perspective.",
        practice: "Talk out your feelings to clarify them."
      }
    },
    rising: { 
      title: "THE TRICKSTER", 
      subtitle: "Dancing between dimensions with a knowing smile.",
      notes: {
        meaning: "You greet the world with curiosity, wearing adaptability as your primary defense.",
        practice: "Ask a question instead of making a statement."
      }
    },
    mercury: { epithet: "The Quick Silver", notes: { meaning: "The mind is a fluid entity, processing data at light speed.", practice: "Learn one new fact today." } },
    venus: { epithet: "The Dual Charmer", notes: { meaning: "Love is a conversation, a mental dance of wit and wordplay.", practice: "Send a thoughtful message to someone you admire." } },
    mars: { epithet: "The Wind Blade", notes: { meaning: "Conflict is fought with words; sharp, precise, and cutting.", practice: "Debate an idea without getting personal." } },
    jupiter: { epithet: "The Infinite Web", notes: { meaning: "Growth comes from networking and the exchange of information.", practice: "Connect two people who should know each other." } },
    saturn: { epithet: "The Silent Scribe", notes: { meaning: "Mastery requires focusing the scattered mind into a single point.", practice: "Read one chapter with full attention." } }
  },
  cancer: {
    sun: { 
      title: "THE GUARDIAN", 
      subtitle: "Protecting the sacred flame of ancestry.",
      notes: {
        meaning: "You are the keeper of the emotional hearth, protecting what is tender and true.",
        practice: "Create a safe space for yourself or a loved one."
      }
    },
    moon: { 
      title: "THE OCEAN", 
      subtitle: "A depth that holds the memory of all tides.",
      notes: {
        meaning: "Your heart moves with the moon, pulling the tides of memory and intuition.",
        practice: "Honor your need for retreat and silence."
      }
    },
    rising: { 
      title: "THE SHELL", 
      subtitle: "A hardened exterior masking a luminous core.",
      notes: {
        meaning: "You navigate the world with a protective shield, revealing your soft center only to the trusted.",
        practice: "Trust your gut feeling about a new person."
      }
    },
    mercury: { epithet: "The Whisperer", notes: { meaning: "Communication is felt before it is heard; words are carriers of emotion.", practice: "Listen to what is not being said." } },
    venus: { epithet: "The Moonlit Tide", notes: { meaning: "Love is nurturing, a safe harbor in the storm.", practice: "Cook a meal for someone you love." } },
    mars: { epithet: "The Crab's Shield", notes: { meaning: "Defensive action protects the vulnerable; you fight for home.", practice: "Set a boundary to protect your energy." } },
    jupiter: { epithet: "The Great Provider", notes: { meaning: "Blessings come through caring for the family and the tribe.", practice: "Host a gathering or share a meal." } },
    saturn: { epithet: "The Ancient Wall", notes: { meaning: "Structure is found in tradition and the roots of the past.", practice: "Look at an old family photo." } }
  },
  leo: {
    sun: { 
      title: "THE MONARCH", 
      subtitle: "Radiating the solar authority of the divine self.",
      notes: {
        meaning: "You exist to shine, to remind others of the divine spark within the human spirit.",
        practice: "Accept a compliment without deflecting it."
      }
    },
    moon: { 
      title: "THE HEARTH", 
      subtitle: "A warm, roaring fire that draws all souls near.",
      notes: {
        meaning: "Your inner self needs to be seen and celebrated; you burn bright for those you love.",
        practice: "Express a creative impulse without judgment."
      }
    },
    rising: { 
      title: "THE CROWN", 
      subtitle: "Wearing sovereignty as a second skin.",
      notes: {
        meaning: "You walk with dignity, commanding attention simply by being present.",
        practice: "Wear something that makes you feel regal."
      }
    },
    mercury: { epithet: "The Royal Edict", notes: { meaning: "Speech is a declaration; words carry the weight of authority.", practice: "Speak with conviction, not hesitation." } },
    venus: { epithet: "The Gilded Rose", notes: { meaning: "Love is a grand gesture, a performance of adoration and loyalty.", practice: "Give a generous gift or compliment." } },
    mars: { epithet: "The Lion's Heart", notes: { meaning: "Courage comes from the heart; you fight for pride and honor.", practice: "Defend someone who cannot defend themselves." } },
    jupiter: { epithet: "The Solar Expansion", notes: { meaning: "Fortune smiles on those who lead with warmth and generosity.", practice: "Encourage someone to pursue their dream." } },
    saturn: { epithet: "The Iron Throne", notes: { meaning: "Authority is earned through responsibility and the burden of leadership.", practice: "Take charge of a situation that lacks direction." } }
  },
  virgo: {
    sun: { 
      title: "THE ALCHEMIST", 
      subtitle: "Gold is made in the small acts.",
      notes: {
        meaning: "You refine the world by seeing the details others miss, turning chaos into order.",
        practice: "Organize one small area of your life."
      }
    },
    moon: { 
      title: "THE ANALYST", 
      subtitle: "Finding order in the noise of the emotional spectrum.",
      notes: {
        meaning: "You process emotions through understanding; clarity is your form of comfort.",
        practice: "Write a list to clear your mind."
      }
    },
    rising: { 
      title: "THE HEALER", 
      subtitle: "Sensing the fracture before the break occurs.",
      notes: {
        meaning: "You present a composed face, always ready to fix what is broken.",
        practice: "Offer a practical solution to a problem."
      }
    },
    mercury: { epithet: "The Sacred Scribe", notes: { meaning: "The mind is a tool for discernment; truth is found in the details.", practice: "Edit a piece of work or refine a plan." } },
    venus: { epithet: "The Devoted Hand", notes: { meaning: "Love is service; affection is shown through helpful acts.", practice: "Do a chore for someone without being asked." } },
    mars: { epithet: "The Precise Cut", notes: { meaning: "Action is surgical; efficient, effective, and without waste.", practice: "Focus on the most efficient way to complete a task." } },
    jupiter: { epithet: "The Divine Order", notes: { meaning: "Growth happens when systems are healthy and functioning.", practice: "Improve a daily routine." } },
    saturn: { epithet: "The Hermit's Discipline", notes: { meaning: "Mastery is achieved through humility and daily practice.", practice: "Commit to a small, daily habit." } }
  },
  libra: {
    sun: { 
      title: "THE HARMONIZER", 
      subtitle: "Balancing the cosmic scales of duality.",
      notes: {
        meaning: "You seek the golden mean, creating beauty and justice in a polarized world.",
        practice: "Find the middle ground in a conflict."
      }
    },
    moon: { 
      title: "THE DIPLOMAT", 
      subtitle: "Seeking the perfect resonance between souls.",
      notes: {
        meaning: "Emotional peace is found in relationship; you reflect the other to know the self.",
        practice: "Ask someone how they are truly feeling."
      }
    },
    rising: { 
      title: "THE AESTHETE", 
      subtitle: "Curating beauty as a defense against entropy.",
      notes: {
        meaning: "You meet the world with grace, smoothing rough edges with charm and style.",
        practice: "Add a touch of beauty to your environment."
      }
    },
    mercury: { epithet: "The Silver Tongue", notes: { meaning: "Words are weighed for balance; communication is an art form.", practice: "Compliment someone sincerely." } },
    venus: { epithet: "The Mirror's Edge", notes: { meaning: "Love is a partnership of equals, a reflection of divine beauty.", practice: "Collaborate with someone on a project." } },
    mars: { epithet: "The Elegant Duel", notes: { meaning: "Conflict is navigated with strategy and social grace.", practice: "Assert yourself politely but firmly." } },
    jupiter: { epithet: "The Just Ruling", notes: { meaning: "Expansion comes through fairness, partnership, and social connection.", practice: "Introduce two people who can help each other." } },
    saturn: { epithet: "The Binding Oath", notes: { meaning: "Commitment is the structure that holds relationships together.", practice: "Keep a promise you made." } }
  },
  scorpio: {
    sun: { 
      title: "THE PHOENIX", 
      subtitle: "Rising from the ashes of inevitable transformation.",
      notes: {
        meaning: "You live to transform, diving into the dark to find the light of regeneration.",
        practice: "Let go of something that no longer serves you."
      }
    },
    moon: { 
      title: "THE ABYSS", 
      subtitle: "Navigating the dark waters where secrets dwell.",
      notes: {
        meaning: "Your feelings run deep and private, guarding a vulnerable core of intense passion.",
        practice: "Spend time alone in silence."
      }
    },
    rising: { 
      title: "THE MYSTIC", 
      subtitle: "A gaze that pierces the veil of the material world.",
      notes: {
        meaning: "You project an aura of mystery, seeing beneath the surface of social masks.",
        practice: "Trust your intuition about a hidden truth."
      }
    },
    mercury: { epithet: "The Shadow Seer", notes: { meaning: "The mind investigates the taboo; truth is found in the shadows.", practice: "Research a topic that fascinates you." } },
    venus: { epithet: "The Siren's Call", notes: { meaning: "Love is a total merger of souls; intense, magnetic, and transformative.", practice: "Share a secret with someone you trust." } },
    mars: { epithet: "The Scorpion's Sting", notes: { meaning: "Power is held in reserve, then struck with precision and intensity.", practice: "Focus your energy on a single goal." } },
    jupiter: { epithet: "The Deep Magic", notes: { meaning: "Wisdom is gained through psychological depth and crisis.", practice: "Investigate a mystery." } },
    saturn: { epithet: "The Gatekeeper", notes: { meaning: "Strength comes from self-mastery and the ability to endure.", practice: "Face a fear you have been avoiding." } }
  },
  sagittarius: {
    sun: { 
      title: "THE EXPLORER", 
      subtitle: "Chasing the horizon where truth meets myth.",
      notes: {
        meaning: "You are the eternal seeker, firing arrows of truth into the vast unknown.",
        practice: "Learn about a culture different from your own."
      }
    },
    moon: { 
      title: "THE NOMAD", 
      subtitle: "Finding home in the movement between worlds.",
      notes: {
        meaning: "Your soul needs freedom to roam; emotional security is found in the open road.",
        practice: "Go somewhere you have never been."
      }
    },
    rising: { 
      title: "THE PROPHET", 
      subtitle: "Speaking the vision before it comes to pass.",
      notes: {
        meaning: "You greet the world with optimism and a story, leading others with vision.",
        practice: "Share an inspiring idea."
      }
    },
    mercury: { epithet: "The Truth Arrow", notes: { meaning: "Speech is direct, honest, and aimed at the big picture.", practice: "Tell the truth, even if it is blunt." } },
    venus: { epithet: "The Wild Muse", notes: { meaning: "Love is an adventure; a journey of shared discovery.", practice: "Plan a spontaneous trip or outing." } },
    mars: { epithet: "The Centaur's Aim", notes: { meaning: "Action is fueled by belief; you fight for a cause.", practice: "Take a stand for what you believe in." } },
    jupiter: { epithet: "The High Priest", notes: { meaning: "Blessings multiply when you share wisdom and seek higher truth.", practice: "Teach someone something you know." } },
    saturn: { epithet: "The Elder's Wisdom", notes: { meaning: "Authority is built on knowledge and the testing of beliefs.", practice: "Study a philosophy or belief system." } }
  },
  capricorn: {
    sun: { 
      title: "THE ARCHITECT", 
      subtitle: "Building the structures that outlast time itself.",
      notes: {
        meaning: "You are the master builder, climbing the mountain of ambition with steady steps.",
        practice: "Set a goal for five years from now."
      }
    },
    moon: { 
      title: "THE HERMIT", 
      subtitle: "Finding solace in the high, cold peaks of solitude.",
      notes: {
        meaning: "You find comfort in control and self-sufficiency; emotions are managed with reserve.",
        practice: "Acknowledge an emotion without judging it."
      }
    },
    rising: { 
      title: "THE EXECUTIVE", 
      subtitle: "Commanding respect through sheer presence.",
      notes: {
        meaning: "You project authority and competence; the world sees you as someone in charge.",
        practice: "Dress for the role you want."
      }
    },
    mercury: { epithet: "The Master Plan", notes: { meaning: "Thinking is pragmatic, structured, and focused on the end game.", practice: "Create a step-by-step plan." } },
    venus: { epithet: "The Stone Rose", notes: { meaning: "Love is serious business; loyalty and status are key.", practice: "Show your commitment through a reliable act." } },
    mars: { epithet: "The Mountain's Peak", notes: { meaning: "Ambition drives action; you work hard for tangible success.", practice: "Complete a difficult work task." } },
    jupiter: { epithet: "The Empire's Reach", notes: { meaning: "Expansion happens through career success and public standing.", practice: "Network with a mentor or leader." } },
    saturn: { epithet: "The Time Keeper", notes: { meaning: "Discipline is the key to legacy; you respect the limits of reality.", practice: "Review your schedule and priorities." } }
  },
  aquarius: {
    sun: { 
      title: "THE VISIONARY", 
      subtitle: "Downloading the blueprint of the future.",
      notes: {
        meaning: "You are the awakener, bringing the water of new consciousness to the thirsty earth.",
        practice: "Break one small rule today."
      }
    },
    moon: { 
      title: "THE WITNESS", 
      subtitle: "Stand back. See the pattern.",
      notes: {
        meaning: "You observe feelings from a distance, understanding the group dynamic instinctively.",
        practice: "Observe a situation without participating."
      }
    },
    rising: { 
      title: "THE REBEL", 
      subtitle: "Breaking the chains of the obsolete paradigm.",
      notes: {
        meaning: "You appear as an individual, unique and unafraid to stand apart from the crowd.",
        practice: "Express a unique opinion."
      }
    },
    mercury: { epithet: "The Cosmic Link", notes: { meaning: "The mind connects to the universal network; ideas are electric.", practice: "Brainstorm a new idea." } },
    venus: { epithet: "The Starry Love", notes: { meaning: "Love is friendship and freedom; a meeting of minds.", practice: "Connect with a friend or group." } },
    mars: { epithet: "The Radical Spark", notes: { meaning: "Action is unpredictable and driven by the need for change.", practice: "Try a new method for an old task." } },
    jupiter: { epithet: "The Future Seed", notes: { meaning: "Growth comes through innovation and humanitarian ideals.", practice: "Support a cause you care about." } },
    saturn: { epithet: "The Grid Master", notes: { meaning: "Structure is found in the network and the laws of the collective.", practice: "Organize a group or community." } }
  },
  pisces: {
    sun: { 
      title: "THE DREAMER", 
      subtitle: "Dissolving the boundaries between self and the divine.",
      notes: {
        meaning: "You are the mystic, feeling the oneness of all life and the flow of the ether.",
        practice: "Spend time in meditation or nature."
      }
    },
    moon: { 
      title: "THE ORACLE", 
      subtitle: "Feeling the tremors of the collective unconscious.",
      notes: {
        meaning: "Your heart is open to the suffering and joy of the world; boundaries are porous.",
        practice: "Cleanse your energy after being in a crowd."
      }
    },
    rising: { 
      title: "THE CHAMELEON", 
      subtitle: "Merging with the ether to become invisible.",
      notes: {
        meaning: "You flow into any room, adapting your energy to the atmosphere around you.",
        practice: "Wear a color that reflects your mood."
      }
    },
    mercury: { epithet: "The Mystic Poet", notes: { meaning: "Thought is non-linear and imaginative; words paint pictures.", practice: "Write a poem or record a dream." } },
    venus: { epithet: "The Ocean's Heart", notes: { meaning: "Love is a spiritual union, compassionate and unconditional.", practice: "Perform an act of kindness." } },
    mars: { epithet: "The Tidal Spear", notes: { meaning: "Action flows like water; subtle, indirect, but powerful.", practice: "Follow your intuition on what to do next." } },
    jupiter: { epithet: "The Boundless Tide", notes: { meaning: "Faith expands when you surrender to the flow of the universe.", practice: "Practice gratitude for the unseen." } },
    saturn: { epithet: "The Silent Monastery", notes: { meaning: "Spiritual discipline provides the structure for the soul.", practice: "Spend ten minutes in silence." } }
  }
};

export const OMEN_NOTES: Record<string, { meaning: string; practice: string }> = {
  "Saturn favors patience. Choose what lasts.": { meaning: "Time is an ally, not an enemy; endurance is being tested.", practice: "Delay gratification for a greater reward." },
  "Let the long road teach you.": { meaning: "The journey holds the lesson, not the destination.", practice: "Walk slowly and observe your path." },
  "Hold your ground; the tide will turn.": { meaning: "Resilience is required; change is inevitable but not immediate.", practice: "Stand firm in your decision." },
  "Silence is an answer too.": { meaning: "Absence of noise reveals the truth.", practice: "Listen more than you speak today." },
  "What is built slowly stands longer.": { meaning: "Foundations laid with care endure the storm.", practice: "Focus on quality over speed." },
  "The veil is thin. Trust your sight.": { meaning: "Intuition is heightened; the unseen is visible.", practice: "Trust your first impression." },
  "Old roots feed new growth.": { meaning: "The past provides the nutrients for the future.", practice: "Honor an ancestor or tradition." },
  "Chaos precedes the new form.": { meaning: "Disorder is the workshop of creation.", practice: "Accept the mess as part of the process." },
  "Honor the contract with yourself.": { meaning: "Integrity is the alignment of action and belief.", practice: "Keep a small promise to yourself." },
  "The shadow proves the light exists.": { meaning: "Contrast is necessary for perception.", practice: "Accept a flaw as part of the whole." },
  "Wait for the dust to settle.": { meaning: "Clarity comes after the commotion ceases.", practice: "Pause before reacting." },
  "Action without thought is waste.": { meaning: "Energy must be directed to be effective.", practice: "Plan before you move." },
  "The stars ask for your discipline.": { meaning: "Order and routine are the keys to freedom.", practice: "Stick to your schedule." },
  "Flow like water, strike like stone.": { meaning: "Be adaptable yet unyielding when necessary.", practice: "Adjust your approach but keep your goal." },
  "The unseen world is speaking.": { meaning: "Signs and symbols are communicating with you.", practice: "Pay attention to coincidences." },
  "Your hesitation is wisdom today.": { meaning: "Pause is protection; do not rush.", practice: "Wait for a clear green light." },
  "Plant the seed in the dark.": { meaning: "Beginnings often happen in obscurity.", practice: "Start a project in private." },
  "The echo reveals the source.": { meaning: "Feedback shows the origin of the signal.", practice: "Listen to how others respond to you." },
  "Stillness conquers the storm.": { meaning: "Inner peace is the ultimate defense.", practice: "Find a quiet center within." },
  "Fate favors the prepared mind.": { meaning: "Luck is the meeting of preparation and opportunity.", practice: "Review your resources." }
};

export const LUMINA_OMENS = Object.keys(OMEN_NOTES);
