//code for main page
function funfact() {
    fetch ('https://uselessfacts.jsph.pl/random.json?language=en')
    .then((res) => res.json())
    .then((data) => {
        document.getElementById("fun_fact").innerHTML = "Did You Know: " + data.text.toString();
    });
}

//code for games page
function gamesList() {
    const app = document.getElementById("games")
    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    app.appendChild(container)
    let gamesList = ["Blackjack", "Baccarat", "Minesweeper", "2048", "Tic-tac-toe", "Reversi", "Sudoku", 'Coin flipping', 'Rock paper scissors']
    gamesList.forEach(games => {
        fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${games}`)
        .then((res) => res.json())
        .then((data) => {

            const json = data.query.search[0];
            const url = `https://en.wikipedia.org/?curid=${json.pageid}`;
            const descSnippet = `${json.snippet}...`;

            container.insertAdjacentHTML(
                'beforeend',
                `<div class="card" onclick="location.href='index.html'">
                    <h2><a href="${url}">${games}</a></h2>
                    <p>${descSnippet}</p>
                </div>`
            )
        });
    })
}
//code for covid page