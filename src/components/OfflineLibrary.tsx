import React from 'react';
import { Book, ChevronRight, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface OfflineArticle {
  title: string;
  category: string;
  content: string;
}

const OFFLINE_ARTICLES: OfflineArticle[] = [
  {
    title: "Photosynthesis Basics",
    category: "Science",
    content: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigments. In this process, plants take in carbon dioxide and water and release oxygen as a byproduct. The chemical equation for photosynthesis is 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2."
  },
  {
    title: "Newton's First Law",
    category: "Physics",
    content: "Newton's First Law of Motion, also known as the Law of Inertia, states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This means that objects have a natural tendency to keep doing what they are doing."
  },
  {
    title: "The Solar System",
    category: "Astronomy",
    content: "Our solar system consists of our star, the Sun, and everything bound to it by gravity — the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids."
  },
  {
    title: "Ancient Civilizations",
    category: "History",
    content: "Ancient civilizations like Mesopotamia, Ancient Egypt, the Indus Valley, and Ancient China laid the foundations for modern society. They developed writing systems, complex religions, social structures, and impressive architectural feats like the pyramids and the Great Wall."
  },
  {
    title: "Human Anatomy",
    category: "Biology",
    content: "Human anatomy is the study of the structure of the human body. It includes the study of various systems such as the skeletal system, muscular system, nervous system, circulatory system, and respiratory system. Each system plays a vital role in keeping the body functioning correctly."
  },
  {
    title: "Water Cycle",
    category: "Geography",
    content: "The water cycle describes the continuous movement of water on, above, and below the surface of the Earth. It involves processes like evaporation (water turning into vapor), condensation (vapor turning into clouds), precipitation (rain or snow), and collection (water gathering in oceans and lakes)."
  },
  {
    title: "Basic Mathematics",
    category: "Math",
    content: "Mathematics is the study of numbers, shapes, and patterns. Basic math includes addition, subtraction, multiplication, and division. These fundamental operations are used in everyday life, from counting money to measuring ingredients for a recipe."
  },
  {
    title: "English Grammar",
    category: "Language",
    content: "Grammar is the set of structural rules governing the composition of clauses, phrases, and words in a natural language. Key components of English grammar include parts of speech (nouns, verbs, adjectives), sentence structure, and punctuation."
  },
  {
    title: "Basic Hygiene",
    category: "Health",
    content: "Good hygiene is the first line of defense against many diseases. Washing hands with soap, drinking clean water, and keeping your surroundings clean can prevent most common illnesses. Personal hygiene also includes regular bathing and dental care."
  },
  {
    title: "The Water Cycle",
    category: "Geography",
    content: "The water cycle describes the continuous movement of water on, above, and below the surface of the Earth. It involves processes like evaporation (water turning into vapor), condensation (vapor turning into clouds), precipitation (rain or snow), and collection (water gathering in oceans and lakes)."
  },
  {
    title: "Basic Mathematics",
    category: "Math",
    content: "Mathematics is the study of numbers, shapes, and patterns. Basic math includes addition, subtraction, multiplication, and division. These fundamental operations are used in everyday life, from counting money to measuring ingredients for a recipe."
  },
  {
    title: "English Grammar",
    category: "Language",
    content: "Grammar is the set of structural rules governing the composition of clauses, phrases, and words in a natural language. Key components of English grammar include parts of speech (nouns, verbs, adjectives), sentence structure, and punctuation."
  },
  {
    title: "Sustainable Living",
    category: "Environment",
    content: "Sustainable living is a lifestyle that attempts to reduce an individual's or society's use of the Earth's natural resources and personal resources. It includes reducing waste, using renewable energy, and choosing products that have a lower environmental impact."
  },
  {
    title: "The Great Indian Rivers",
    category: "Geography",
    content: "India is blessed with many large rivers. The Ganges, Yamuna, Brahmaputra, and Indus are some of the most important rivers. These rivers provide water for drinking, agriculture, and industry, and they also have great cultural and religious significance."
  },
  {
    title: "Indian Independence Movement",
    category: "History",
    content: "The Indian independence movement was a series of historic events with the ultimate aim of ending the British rule in India. It lasted from 1857 to 1947. Key figures included Mahatma Gandhi, Jawaharlal Nehru, and Subhas Chandra Bose."
  }
];

interface OfflineLibraryProps {
  theme: 'light' | 'dark';
  onSelect: (content: string) => void;
}

export default function OfflineLibrary({ theme, onSelect }: OfflineLibraryProps) {
  return (
    <div className="space-y-4">
      <div className={cn(
        "p-4 rounded-2xl border flex items-center gap-3",
        theme === 'dark' ? "bg-blue-950/20 border-blue-900/50 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-700"
      )}>
        <Info size={18} className="shrink-0" />
        <p className="text-xs font-medium">You are currently offline. You can still read these saved lessons or view your chat history.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {OFFLINE_ARTICLES.map((article) => (
          <button
            key={article.title}
            onClick={() => onSelect(article.content)}
            className={cn(
              "p-4 text-left border rounded-2xl transition-all flex items-center justify-between group",
              theme === 'dark' 
                ? "bg-stone-900 hover:bg-stone-800 border-stone-800" 
                : "bg-white hover:bg-stone-50 border-stone-200"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Book size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{article.title}</h4>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{article.category}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-stone-300 group-hover:text-brand-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
