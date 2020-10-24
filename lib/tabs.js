$(function () {
  const board_id = localStorage.getItem("board_id");
  const token = localStorage.getItem("trello_token");
  const statsContainer = document.getElementById("stats-wrapper");
  let listsOfData;

  // locaser

  const htmlLoader = () => {
    const markup = `
<div class="loader">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>

`;
    statsContainer.insertAdjacentHTML("afterbegin", markup);
  };
  // clear the loader

  const clearUI = () => {
    statsContainer.innerHTML = "";
  };

  // html for the card
  const htmlCard = ({ listName, noOfCards }) => {
    return `
  <div class="card mb-2 text-center">
            <div class="card-body">
              <h2>${listName}</h2>
              <h1 class="mt-3 mb-0">${noOfCards}</h1>
            </div>
          </div>
  `;
  };

  // function to get the card data and list data

  async function getCardsList() {
    htmlLoader();
    try {
      const fetchedListsData = await Trello.get(
        `/boards/${board_id}/lists?token=${token}`
      );
      // checking for the cardLists
      if (fetchedListsData && fetchedListsData.length > 0) {
        listsOfData = fetchedListsData.map(({ name, id }) => ({
          listName: name,
          id,
          noOfCards: 0,
        }));

        if (listsOfData && listsOfData.length > 0) {
          const cardsData = await Trello.get(
            `/boards/${board_id}/cards?token=${token}`
          );
          if (cardsData && cardsData.length > 0) {
            cardsData.forEach((element) => {
              let datas = listsOfData.find(({ id }) => id === element.idList);
              datas.noOfCards = datas.noOfCards + 1;
            });
            clearUI();
            console.log(listsOfData);
            listsOfData.forEach((item) => {
              const markup = htmlCard(item);

              statsContainer.innerHTML += markup;
            });
          }
        }
      }
    } catch (err) {
      clearUI();
      console.log(err);
    }
  }

  $("#myTab a").on("click", function (e) {
    clearUI();
    e.preventDefault();
    $("#myTab a.active.show").removeClass("active show");
    $("#myTab a.active").attr("aria-selected", false);
    $(this).addClass("active show");
    $(this).attr("aria-selected", true);
    $("#myTabContent .tab-pane.active.show").removeClass("active show");
    $(`#myTabContent .tab-pane${$(this).attr("href")}`).addClass("active show");
    if ($(this).attr("href").slice(1) === "stats") {
      console.log("this is stats");
      getCardsList();
    }
  });
});
