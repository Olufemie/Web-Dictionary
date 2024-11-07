import { useEffect, useState } from "react";

function App() {
  const [word, setWord] = useState("");
  const [wordMeaning, setWordMeaning] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMode, setIsMode] = useState(false);
  const [font, setFont] = useState("sans serif");
  const [error, setError] = useState("");
  let meanings;

  useEffect(
    function () {
      document.body.style.fontFamily = `${font}`;
    },
    [font]
  );

  if (wordMeaning.length < 0) return;

  if (wordMeaning.length === 1) meanings = wordMeaning[0].meanings;

  for (let i = 0; i < wordMeaning.length - 1; i++) {
    if (
      wordMeaning[i].meanings.length > wordMeaning[i + 1].meanings.length ||
      wordMeaning[i].meanings.length === wordMeaning[i + 1].meanings.length
    )
      meanings = wordMeaning[i];
  }

  function handleSwitchMode() {
    setIsMode((mode) => !mode);
  }

  async function handleFetch() {
    try {
      setIsLoading(true);
      setError("");

      if (!word) {
        alert("Search cannot be empty");
        return;
      }

      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!res.ok) throw new Error("Could not fetch the data");

      const data = await res.json();

      setWordMeaning(data);
      setError("");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setWord("");
      setIsLoading(false);
    }
  }

  return (
    <div className={`body ${isMode ? "dark" : ""} ${meanings ? "" : "height"}`}>
      <div className="container">
        <Header>
          <Logo />
          <HeaderBox>
            <SelectFont font={font} setFont={setFont} mode={isMode} />
            <Mode mode={isMode} onSwitchMode={handleSwitchMode} />
            <Moon mode={isMode} />
          </HeaderBox>
        </Header>

        <Search
          onFetch={handleFetch}
          word={word}
          setWord={setWord}
          mode={isMode}
        />

        <WordOutput>
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <>
              <WordDetails wordMeaning={wordMeaning} mode={isMode} />
              <Output
                wordMeaning={wordMeaning}
                meanings={meanings}
                mode={isMode}
              />
            </>
          )}

          {!isLoading && !error && (
            <Source wordMeaning={wordMeaning} mode={isMode} />
          )}

          {error && <ErrorMessage mode={isMode} />}
        </WordOutput>
      </div>
    </div>
  );
}

function Header({ children }) {
  return <div className="header__cont">{children}</div>;
}

function Logo() {
  return (
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="38"
        viewBox="0 0 34 38"
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="#838383"
          strokeLinecap="round"
          strokeWidth="1.5"
        >
          <path d="M1 33V5a4 4 0 0 1 4-4h26.8A1.2 1.2 0 0 1 33 2.2v26.228M5 29h28M5 37h28" />
          <path strokeLinejoin="round" d="M5 37a4 4 0 1 1 0-8" />
          <path d="M11 9h12" />
        </g>
      </svg>
    </span>
  );
}

function HeaderBox({ children }) {
  return <div className="header__sub">{children}</div>;
}

function SelectFont({ font, setFont, mode }) {
  return (
    <select
      className={`select ${mode ? "dark" : ""}`}
      value={font}
      onChange={(e) => setFont(e.target.value)}
    >
      <option value="sans-serif">Sans Serif</option>
      <option value="serif">Serif</option>
      <option value="monospace">Mono</option>
    </select>
  );
}

function Mode({ onSwitchMode, mode }) {
  return (
    <div
      className={`header__switch ${mode ? "right dark" : ""}`}
      onClick={onSwitchMode}
    ></div>
  );
}

function Moon({ mode }) {
  return (
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <path
          fill="none"
          stroke={`${mode ? "#A445ED" : "#838383"}`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
        />
      </svg>
    </span>
  );
}

function Search({ onFetch, word, setWord, mode }) {
  function setWordValue(e) {
    setWord(e.target.value);
  }

  return (
    <div className="search__box">
      <input
        type="text"
        value={word}
        onChange={setWordValue}
        className={mode ? "dark" : ""}
      />
      <button onClick={onFetch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            fill="none"
            stroke="#A445ED"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m12.663 12.663 3.887 3.887M1 7.664a6.665 6.665 0 1 0 13.33 0 6.665 6.665 0 0 0-13.33 0Z"
          />
        </svg>
      </button>
    </div>
  );
}

function WordDetails({ wordMeaning, mode }) {
  const wordValue = wordMeaning[0]?.word;
  const wordPhonetic = wordMeaning[0]?.phonetic;
  return (
    <div className="word__details">
      {wordMeaning.length > 0 && (
        <>
          <div className="word__info">
            <h1 className={`${mode ? "dark" : ""}`}>{wordValue}</h1>
            <span>{wordPhonetic}</span>
          </div>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="75"
              height="75"
              viewBox="0 0 75 75"
            >
              <g fill="#A445ED" fillRule="evenodd">
                <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
                <path d="M29 27v21l21-10.5z" />
              </g>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

function WordOutput({ children }) {
  return <div>{children}</div>;
}

function Output({ wordMeaning, meanings, mode }) {
  const newMeaning = meanings?.meanings || meanings;

  return (
    <div className={`output ${mode ? "dark" : ""}`}>
      {wordMeaning.length > 0 && (
        <>
          <ul className="word__list">
            {newMeaning.map((meaning, i) => (
              <NounList meanings={meanings} meaning={meaning} key={i} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function NounList({ meaning, mode }) {
  return (
    <li className={`meaning__list`}>
      <div>
        <p className={`word__pos ${mode ? "dark" : ""}`}>
          {meaning?.partOfSpeech}
        </p>
        <p className="meaning">Meaning</p>
      </div>

      <ul className="meaning__list">
        {meaning?.definitions.map((definition, i) => (
          <li key={i}>{definition.definition}</li>
        ))}
      </ul>

      <div className="synon">
        <p>Synonyms:</p> <span>{meaning?.synonyms.slice(0, 3).join(", ")}</span>
      </div>
    </li>
  );
}

function Loader() {
  return <p className="load">Loading...</p>;
}

function ErrorMessage({ mode }) {
  return (
    <div className="error">
      <span>🥺</span>
      <h3 className={mode ? "dark" : ""}>No Definitions Found</h3>
      <p>
        Sorry pal, we couldn't find definitions for the word you were looking
        for. You can try the search again at later time or head to the web
        instead.
      </p>
    </div>
  );
}

function Source({ wordMeaning, mode }) {
  const source = wordMeaning[0]?.sourceUrls[0];

  return (
    <div className={`source ${mode ? "dark" : ""}`}>
      {wordMeaning.length > 0 && (
        <>
          <p>Source: </p>{" "}
          <a
            className={mode ? "dark" : ""}
            href={`${source}`}
            target="_blank"
            rel="noreferrer"
          >
            {source}{" "}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
              >
                <path
                  fill="none"
                  stroke="#838383"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"
                />
              </svg>
            </span>
          </a>
        </>
      )}
    </div>
  );
}

export default App;
