// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = '2501-PUPPIES';
const baseUrl = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const form = document.querySelector('#new-player-form');
const main = document.querySelector('#main');

const state = {
  allPlayers: [],
  singlePlayer: {},
}

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
// TODO
const fetchAllPlayers = async () => {
  try {
    const res = await fetch(baseUrl);
    console.log(res);
    const result = await res.json();
    console.log(result);

    const allPlayers = result.data.players;
    await renderAllPlayers(allPlayers);
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};
// fetchAllPlayers();

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const res = await fetch(`${baseUrl}/${playerId}`);
    console.log(res)
    const result = await res.json();
    console.log(result)

    const singlePlayer = result.data.player;
    renderSinglePlayer(singlePlayer)
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};
// fetchSinglePlayer(29940);
/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  console.log(playerObj)
  try {
    // TODO
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(playerObj)
    })
    const result = await res.json();
    console.log(result);
    fetchAllPlayers();
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    const res = await fetch(`${baseUrl}/${playerId}`, {
      method: 'DELETE'
    })
    fetchAllPlayers()
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
async function renderAllPlayers(playerList){
  console.log(playerList)
  state.allPlayers = playerList.map((player) =>{
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <h1>Name: ${player.name}</h1>
    <p>Id: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <img id='pic' src=${player.imageUrl} />
    <button id='delete'> Delete </button>
    `
    const deleteButton = card.querySelector('#delete')
    deleteButton.addEventListener('click', () =>{
      removePlayer(player.id)
    })
    const pic = card.querySelector('#pic')
    pic.addEventListener('click', () => {
      fetchSinglePlayer(player.id)
    })
    return card;
    })
    renderPlayers(state.allPlayers);
    
}

async function renderPlayers(playerList){
  // TODO
  if(Array.isArray(playerList)){
    // console.log(playerList)
    // console.log(...playerList)
    main.replaceChildren(...playerList)
  } else {
    main.replaceChildren(playerList)
  }
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  state.singlePlayer = document.createElement('div');
  state.singlePlayer.classList.add('single')
  state.singlePlayer.innerHTML = `
  <h2>${player.name} </h2>
  <p>${player.id} </p>
  <p>${player.breed} </p>
  <img src=${player.imageUrl} />
  <button id='goBack'> Go Back </button>
  `
  renderPlayers(state.singlePlayer)
  const goBack = state.singlePlayer.querySelector('#goBack');
  goBack.addEventListener('click', () => {renderPlayers(state.allPlayers)})
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // TODO
    form.innerHTML =`
    Name:
      <input type="text" placeholder="Enter Name" name="name" />
      Breed:
      <input type="text" placeholder="Enter Breed" name="breed" />
      Image:
      <input type="text" placeholder="Enter Image URL" name="img" />
      <button id='submit'> Submit </button>
    `
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log(form.name.value)
      const formObj = {name:form.name.value, breed:form.breed.value, imageUrl:form.img.value}
      addNewPlayer(formObj);
      form.reset();
    })
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};
renderNewPlayerForm();
/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  fetchAllPlayers();
  // const players = await fetchAllPlayers();
  // renderPlayers(players);

  // renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
