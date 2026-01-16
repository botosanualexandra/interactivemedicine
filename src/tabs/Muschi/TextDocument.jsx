// TextDocument.jsx
// English and Romanian translations for Muschi.jsx UI

const textDocument = {
  hero: {
    ro: "mușchiul",
    en: "muscle"
  },
  ceEste: {
    title: { ro: "1️⃣ Ce este mușchiul și ce face?", en: "1️⃣ What is the muscle and what does it do?" },
    organ: { ro: "Mușchiul este un organ activ care:", en: "The muscle is an active organ that:" },
    produce_forta: { ro: "produce forță", en: "produces force" },
    produce_miscare: { ro: "produce mișcare", en: "produces movement" },
    mentine_postura: { ro: "menține postura", en: "maintains posture" },
    tipuri: { ro: "Tipuri de mușchi:", en: "Types of muscles:" },
    scheletici: { ro: "Scheletici", en: "Skeletal" },
    cardiac: { ro: "Cardiac", en: "Cardiac" },
    netezi: { ro: "Netezi", en: "Smooth" },
    info: {
      left: {
        title: { ro: "Mușchi scheletici", en: "Skeletal muscles" },
        description: {
          ro: "Mușchii scheletici sunt atașați de oase și sunt responsabili pentru mișcarea voluntară a corpului.",
          en: "Skeletal muscles are attached to bones and are responsible for voluntary movement of the body."
        }
      },
      right: {
        title: { ro: "Mușchi cardiac", en: "Cardiac muscle" },
        description: {
          ro: "Mușchiul cardiac este un tip special de mușchi care se găsește doar în inimă și este responsabil pentru pomparea sângelui.",
          en: "The cardiac muscle is a special type of muscle found only in the heart and is responsible for pumping blood."
        }
      },
      center: {
        title: { ro: "Mușchi netezi", en: "Smooth muscles" },
        description: {
          ro: "Mușchii netezi se găsesc în pereții organelor interne și sunt responsabili pentru mișcările involuntare, cum ar fi contracțiile intestinale.",
          en: "Smooth muscles are found in the walls of internal organs and are responsible for involuntary movements, such as intestinal contractions."
        }
      },
      default: {
        ro: "Selectați un tip de mușchi pentru a vedea informații.",
        en: "Select a muscle type to see information."
      }
    },
    close: { ro: "am inteles", en: "I understand" }
  },
  ceEsteContractia: {
    title: { ro: "2️⃣ Ce este contracția musculară?", en: "2️⃣ What is muscle contraction?" },
    desc: { ro: "scurtarea sau tensionarea mușchiului prin alunecarea filamentelor interne.", en: "shortening or tensing of the muscle by sliding internal filaments." },
    poate: { ro: "Mușchiul poate:", en: "The muscle can:" },
    scurteze: { ro: "să se scurteze", en: "shorten" },
    ramana: { ro: "să rămână la aceeași lungime", en: "stay the same length" },
    alungeasca: { ro: "să se alungească sub tensiune", en: "lengthen under tension" }
  },
  structura: {
    title: { ro: "3️⃣ Tipuri de contracție musculară", en: "3️⃣ Types of muscle contraction" },
    izotonica: {
      title: { ro: "Contracție izotonică", en: "Isotonic contraction" },
      scurteaza: { ro: "Mușchiul se scurtează", en: "The muscle shortens" },
      miscare: { ro: "Produce mișcare", en: "Produces movement" },
      vizualizare: { ro: "Vizualizare", en: "View" }
    },
    izometrica: {
      title: { ro: "Contracție izometrică", en: "Isometric contraction" },
      neschimba: { ro: "Mușchiul nu se scurtează", en: "The muscle does not shorten" },
      forta: { ro: "Produce forță fără mișcare", en: "Produces force without movement" },
      vizualizare: { ro: "Vizualizare", en: "View" }
    },
    excentrica: {
      title: { ro: "Contracție excentrică", en: "Eccentric contraction" },
      alungeste: { ro: "Mușchiul se alungește sub tensiune", en: "The muscle lengthens under tension" },
      exemplu: { ro: "Exemplu: coborârea unei greutăți", en: "Example: lowering a weight" },
      vizualizare: { ro: "Vizualizare", en: "View" }
    }
  },
  cumApare: {
    title: { ro: "4️⃣ Cum apare contracția?", en: "4️⃣ How does contraction occur?" },
    izotonica: { ro: "Contracție izotonică", en: "Isotonic contraction" },
    steps: [
      { ro: "Creierul trimite impuls nervos", en: "The brain sends a nerve impulse" },
      { ro: "Nervul ajunge la mușchi", en: "The nerve reaches the muscle" },
      { ro: "Se eliberează Ca²⁺", en: "Ca²⁺ is released" },
      { ro: "Are loc alunecarea filamentelor", en: "The sliding of filaments occurs" }
    ],
    sendImpulse: { ro: "Trimite impuls", en: "Send impulse" }
  },
  forta: {
    title: { ro: "5️⃣ Forța musculară", en: "5️⃣ Muscle strength" },
    ceDetermina: { ro: "Ce determină forța:", en: "What determines strength:" },
    dimensiune: { ro: "dimensiunea mușchiului", en: "muscle size" },
    numarFibre: { ro: "numărul fibrelor activate", en: "number of fibers activated" },
    antrenament: { ro: "nivelul de antrenament", en: "training level" },
    numarActive: { ro: "Număr de fibre active", en: "Number of active fibers" }
  }
};

export default textDocument;
