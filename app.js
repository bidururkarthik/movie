const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertmoviecase = (dbobject) => {
  return {
    movieName: dbobject.movie_name,
  };
};

//get all movie name

app.get("/movies/", async (request, response) => {
  const getmoviesQuery = `
    SELECT
      *
    FROM
      movie
    ORDER BY
      movie_name;`;
  const moviesArray = await db.all(getmoviesQuery);
  response.send(moviesArray.map((eachmovie) => convertmoviecase(eachmovie)));
});

//specfic using moviename using get id

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const moviedetails = `
        SELECT
          *
        FROM
           movie
        WHERE 
           movie_id = ${movieId}   
    `;
  const movie = await db.get(moviedetails);
  response.send(movie);
});

//create new table using post method

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addmovieQuery = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (
        '${directorId}',
         '${movieName}',
         '${leadActor}',
      );`;

  const dbResponse = await db.run(addmovieQuery);
  response.send("movie sucessfully added");
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const moviedetails = movies.body;

  const { directorId, movieName, leadActor } = moviedetails;
  const putquerymovie = `
    UPDATE 
        movie
    SET
        director_id= ${directorId},
        movie_name= ${movieName},
        leadactor= ${leadActor}
    WHERE
    movie_id = ${movieId}
    `;
  await db.run(putquerymovie);
  response.send("Movie Details updates");
});

app.delete("movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const moviedelete = `
        DELETE FROM
        movie
        WHERE
        movie_id = ${movieId}
    `;
  await db.run(moviedelete);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const directorquery = `
      SELECT
      *
    FROM
      director
    `;
  const directorarray = await db.all(directorquery);
  response.send(directorarray);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const directorqueryid = `
      SELECT
      *
    FROM
      director
    WHERE
       movie_id = ${movie_Id}  
    `;
  const directorarrayid = await db.all(directorqueryid);
  response.send(directorarrayid);
});
