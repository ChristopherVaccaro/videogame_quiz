import { useMemo, useState } from 'react';

const questionBank = {
  classic: [
    {
      question: 'Which character says "It\'s dangerous to go alone! Take this."?',
      options: ['Old Man (The Legend of Zelda)', 'Cloud Strife', 'Master Chief', 'Solid Snake'],
      answer: 0,
      trivia: 'This line appears in the original 1986 The Legend of Zelda and became one of gaming’s most quoted phrases.'
    },
    {
      question: 'What year did the original PlayStation launch in Japan?',
      options: ['1992', '1994', '1996', '1998'],
      answer: 1,
      trivia: 'Sony launched PlayStation in Japan on December 3, 1994.'
    },
    {
      question: 'Which game popularized the battle royale genre in 2017?',
      options: ['Fortnite', 'Apex Legends', 'PUBG: Battlegrounds', 'H1Z1'],
      answer: 2,
      trivia: 'PUBG exploded in early access and set the modern battle royale formula.'
    },
    {
      question: 'In Pokémon Red and Blue, which city has the first Gym?',
      options: ['Cerulean City', 'Pewter City', 'Vermilion City', 'Celadon City'],
      answer: 1,
      trivia: 'Brock’s Rock-type Gym in Pewter is the first major challenge in Kanto.'
    },
    {
      question: 'What event is considered the big 1983 video game market crash in North America?',
      options: ['Console wars', 'Arcade shutdown', 'Atari shock', 'Video game crash of 1983'],
      answer: 3,
      trivia: 'Oversaturation and weak software quality contributed to a dramatic market collapse.'
    }
  ],
  characters: [
    {
      question: 'What is Mario’s profession in Nintendo canon?',
      options: ['Chef', 'Plumber', 'Carpenter', 'Detective'],
      answer: 1,
      trivia: 'Mario started as “Jumpman,” but Nintendo later established him as a plumber from Brooklyn.'
    },
    {
      question: 'Kratos is the protagonist of which series?',
      options: ['Devil May Cry', 'God of War', 'Darksiders', 'Prince of Persia'],
      answer: 1,
      trivia: 'Kratos debuted in 2005 and later transitioned from Greek to Norse mythology arcs.'
    },
    {
      question: 'Who is the AI companion in Halo known for helping Master Chief?',
      options: ['E.D.I.', 'Ava', 'Cortana', 'Iris'],
      answer: 2,
      trivia: 'Cortana became one of Xbox’s most recognizable characters.'
    },
    {
      question: 'Which hero carries the Master Sword?',
      options: ['Link', 'Zelda', 'Marth', 'Ike'],
      answer: 0,
      trivia: 'Link is the recurring hero of The Legend of Zelda series.'
    },
    {
      question: 'Which fighting-game mascot shouts “Hadouken”?',
      options: ['Scorpion', 'Ryu', 'Kazuya', 'Rock Howard'],
      answer: 1,
      trivia: 'Ryu’s Hadouken is among the most iconic special moves in gaming history.'
    }
  ]
};

const modes = [
  { key: 'classic', title: 'CLASSIC', subtitle: '5 random questions from all eras. Build combos and chase high scores.' },
  { key: 'characters', title: 'CHARACTERS', subtitle: 'Focus on legends, villains, and unforgettable heroes.' }
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function App() {
  const [mode, setMode] = useState('classic');
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showTrivia, setShowTrivia] = useState(false);

  const questions = useMemo(() => shuffle(questionBank[mode]).slice(0, 5), [mode, started]);
  const current = questions[index];
  const finished = index >= questions.length;

  const beginGame = () => {
    setStarted(true);
    setIndex(0);
    setScore(0);
    setCombo(0);
    setSelected(null);
    setShowTrivia(false);
  };

  const submitAnswer = (choice) => {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === current.answer;
    if (correct) {
      setScore((v) => v + 100 + combo * 25);
      setCombo((v) => v + 1);
    } else {
      setCombo(0);
    }
    setShowTrivia(true);
  };

  const next = () => {
    setSelected(null);
    setShowTrivia(false);
    setIndex((v) => v + 1);
  };

  return (
    <main className="app">
      <header className="topbar">
        <h1>PIXEL_QUIZ</h1>
        <button onClick={() => setStarted(false)}>CFG</button>
      </header>

      <section className="panel stats">
        <div><span>GAMES</span><strong>{started ? 1 : 0}</strong></div>
        <div><span>SCORE</span><strong>{score}</strong></div>
        <div><span>COMBO</span><strong>x{combo}</strong></div>
        <div><span>MODE</span><strong>{mode.toUpperCase()}</strong></div>
      </section>

      {!started ? (
        <section>
          <h2>SELECT MODE</h2>
          <div className="mode-grid">
            {modes.map((item) => (
              <article key={item.key} className={`panel mode ${mode === item.key ? 'active' : ''}`} onClick={() => setMode(item.key)}>
                <h3>&gt; {item.title}</h3>
                <p>{item.subtitle}</p>
              </article>
            ))}
          </div>
          <button className="start" onClick={beginGame}>[ENTER] START RUN</button>
        </section>
      ) : finished ? (
        <section className="panel result">
          <h2>RUN COMPLETE</h2>
          <p>Final score: {score}</p>
          <p>Accuracy: {Math.round((score > 0 ? (questions.filter((q, i) => i < index && q.answer === selected).length : 0) / questions.length) * 100) || 0}%</p>
          <button className="start" onClick={beginGame}>PLAY AGAIN</button>
        </section>
      ) : (
        <section className="panel quiz">
          <h2>Q{index + 1}: {current.question}</h2>
          <div className="answers">
            {current.options.map((option, idx) => {
              const state = selected === null ? '' : idx === current.answer ? 'correct' : idx === selected ? 'wrong' : '';
              return (
                <button key={option} className={state} onClick={() => submitAnswer(idx)}>
                  [{idx + 1}] {option}
                </button>
              );
            })}
          </div>
          {showTrivia && (
            <div className="trivia">
              <p>{current.trivia}</p>
              <button className="start" onClick={next}>{index === questions.length - 1 ? 'FINISH' : 'NEXT QUESTION'}</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
