document.addEventListener('DOMContentLoaded', function () {
  let board_id = localStorage.getItem("board_id");
  let token = localStorage.getItem("trello_token");
  const statsContainer = document.getElementById("cardWrapper");
  const tabs = document.querySelectorAll("#myTab a");
  let listsOfData;

  // loader

  const hideLoader = () => {
    document.getElementById('loader').style.display = 'none';
  };
  // clear the loader

  const clearUI = () => {
    statsContainer.textContent = "";
  };

  // html for the card
  const htmlCard = ({ name, noOfCounts }) => {
    var b = document.createElement('b');
    b.textContent = name;
    var div = document.createElement('div');
    var span = document.createElement('span');
    var innerSpan = document.createElement('span');
    innerSpan.textContent = `: ${noOfCounts}`
    span.appendChild(b);
    span.appendChild(innerSpan);
    span.style = "font-size: 1.5em";
    div.appendChild(span);
    div.appendChild(document.createElement('br'));

    return div;

  }

  // function to get the card data and list data

  async function getCardsList() {
    try {

      const [listData, cardsData] = await Promise.all([Trello.get(
        `/boards/${board_id}/lists?token=${token}`
      ), Trello.get(
        `/boards/${board_id}/cards?token=${token}`
      )]);
    
      if (listData && listData.length > 0) {
        listsOfData = listData.map(({ id, name }) => ({ id, name, noOfCounts: 0 }));

        if (cardsData && cardsData.length > 0) {
          cardsData.forEach(element => {
            let datas = listsOfData.find(({ id }) => id === element.idList);
            datas.noOfCounts++;
          });
          hideLoader();
          listsOfData.forEach((item) => {
            const markup = htmlCard(item);
            statsContainer.appendChild(markup);

          });
        } else {
          hideLoader();
          listsOfData.forEach((item) => {
            const markup = htmlCard(item);
            statsContainer.appendChild(markup);
          });
        }
      } else {
        hideLoader();
        statsContainer.textContent = `<p>Hmm... there are no lists present in your board.</p>`
      }

    } catch (err) {
      hideLoader();
      console.log(err);
    }
  }

  tabs.forEach(item => {
    item.addEventListener('click', function (e) {
      if (!board_id || !token) {
        board_id = localStorage.getItem("board_id");
        token = localStorage.getItem("trello_token");
      }
      clearUI();
      document.getElementById('loader').style.display = 'block';
      e.preventDefault();
      document.querySelector("#myTab a.active").setAttribute('aria-selected', "false")
      document.querySelector("#myTab a.active.show").classList.remove("active", "show");
      this.classList.add("active", "show");
      this.setAttribute("aria-selected", "true");
      document.querySelector("#tab-content .tab-pane.active.show").classList.remove("active", "show");
      document.querySelector(`#tab-content .tab-pane${this.getAttribute('href')}`).classList.add("active", "show");
      if (this.getAttribute('href').slice(1) === 'stats') {
        getCardsList();
      }

    })
  })

});
