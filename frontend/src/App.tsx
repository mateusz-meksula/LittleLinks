function App() {
  return (
    <>
      <header className="header">
        {/* logo */}
        <div className="logo">
          <div className="logo-container">
            <div className="letter-first center">L</div>
            <div className="letter-second center">L</div>
          </div>
        </div>

        <nav>
          <a className="active" href="">
            Home
          </a>
          <a href="">Log in</a>
          <a href="">Sign up</a>
          <a href="">About</a>
        </nav>
      </header>

      <div className="banner">
        {/* logo */}
        <div className="logo">
          <div className="logo-container">
            <div className="letter-first center">L</div>
            <div className="letter-second center">L</div>
          </div>
        </div>

        <h1>Little Links</h1>
      </div>

      <main className="container">
        <div className="home-buttons">
          <button>Create little link</button>
          <button>My little links</button>
        </div>
      </main>

      {/* <main>
        <div className="center container">
          <form action="">
            <p className="form-title">Create your little link</p>
            <div className="form-field">
              <label htmlFor="">url</label>
              <input type="url" name="" id="" required />
              <div className="form-field-error"></div>
            </div>
            <div className="form-field">
              <label htmlFor="">your short (optional)</label>
              <input disabled type="text" name="" id="" />
              <div className="form-field-error"></div>
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      </main> */}

      <footer className="footer">
        <div className="creator">Created By Mati</div>
        <nav>
          <a href="">GitHub</a>
          <a href="">LinkedIn</a>
          <a href="">Instagram</a>
        </nav>
      </footer>
    </>
  );
}

export default App;
