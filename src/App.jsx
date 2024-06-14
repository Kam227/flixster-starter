import './App.css';
import MovieList from './MovieList.jsx';

const App = () => {

  return (
    <div className="App">
      <header className="header" >
        <img className="img" src="../public/movie.png"/>
        <h1>Flixster</h1>
      </header>

      <main>
        <MovieList />
      </main>

      <footer className="footer">
        <p>© 2024 Flixster. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App
