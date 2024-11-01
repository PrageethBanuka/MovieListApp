document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#movie-list ul");
  const forms = document.forms;

  // Default movies to add if Local Storage is empty
  const defaultMovies = [
    "The Intern",
    "Inception",
    "The Prestige",
    "The Wolf of Wall Street",
    "The Avengers"
  ];

  // Load saved movies from local storage, or add default movies if none exist
  function initializeMovies() {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    if (movies.length === 0) {
      // Save default movies to Local Storage if none exist
      localStorage.setItem("movies", JSON.stringify(defaultMovies));
      loadMoviesFromArray(defaultMovies);
    } else {
      loadMoviesFromArray(movies);
    }
  }

  // Delete movie event listener
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const li = e.target.parentElement;
      const movieName = li.querySelector(".name").textContent;
      li.parentNode.removeChild(li);
      deleteMovie(movieName);
    }
  });

  // Add movie form submission
  const addForm = forms["add-movie"];
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const value = addForm.querySelector('input[type="text"]').value.trim();
    if (!value) return;

    addMovieToList(value);
    saveMovie(value);
    addForm.querySelector('input[type="text"]').value = "";
  });

  function saveMovie(name) {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    movies.push(name);
    localStorage.setItem("movies", JSON.stringify(movies));
  }

  function deleteMovie(name) {
    let movies = JSON.parse(localStorage.getItem("movies") || "[]");
    movies = movies.filter((movie) => movie !== name);
    localStorage.setItem("movies", JSON.stringify(movies));
  }

  function loadMoviesFromArray(movies) {
    movies.forEach((movie) => addMovieToList(movie));
  }

  function addMovieToList(movie) {
    const li = document.createElement("li");
    const movieName = document.createElement("span");
    const deleteBtn = document.createElement("span");

    movieName.textContent = movie;
    deleteBtn.textContent = "delete";

    movieName.classList.add("name");
    deleteBtn.classList.add("delete");

    li.appendChild(movieName);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }

  // Download movie list as JSON
  function downloadMovieList() {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "movie_list.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function uploadMovieList(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const movies = JSON.parse(e.target.result);
        if (Array.isArray(movies)) {
          localStorage.setItem("movies", JSON.stringify(movies));
          list.innerHTML = "";
          loadMoviesFromArray(movies);
        } else {
          alert("Invalid file format.");
        }
      } catch (error) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  }

  document.querySelector("#download-button").addEventListener("click", downloadMovieList);
  document.querySelector("#upload-input").addEventListener("change", uploadMovieList);

  initializeMovies(); // Initialize movies on page load
});
