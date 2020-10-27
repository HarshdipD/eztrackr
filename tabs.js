$(function () {
  const board_id = localStorage.getItem("board_id");
  const token = localStorage.getItem("trello_token");
  const statsContainer = document.getElementById("cardWrapper");
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
  const htmlCard = ({ name, noOfCounts }) => {
    return `
<div class="col-md-6 mt-1" style="width:50%;">
<div class="card text-center">
          <div class="card-body p-0">
            <span>${name}</span>
            <span> :${noOfCounts}</span>
          </div>
        </div>
</div>
  `;
  };

  // function to get the card data and list data

  async function getCardsList() {
    htmlLoader();
    try {

      const [listData, cardsData] = await Promise.all([Trello.get(
        `/boards/${board_id}/lists?token=${token}`
      ), Trello.get(
        `/boards/${board_id}/cards?token=${token}`
      )]);

      if (cardsData && cardsData.length > 0) {
        listsOfData = listData.map(({ id, name }) => ({ id, name, noOfCounts: 0 }));
        cardsData.forEach(element => {
          let datas = listsOfData.find(({ id }) => id === element.idList);
          datas.noOfCounts++;
        });
        console.log(listsOfData);
        clearUI();
        listsOfData.forEach((item) => {
          const markup = htmlCard(item);

          statsContainer.innerHTML += markup;
        });
      } else {
        clearUI();
        statsContainer.innerHTML = `<h1>No data present!</h1>`
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
