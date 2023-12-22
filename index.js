// Salvo in una costante il File System (modulo build-in)
const fs = require('fs');

const http = require('http');

// Fetch è già integrato in node >=18
// Altrimenti -> npm install node-fetch@2 -> const fetch = require("node-fetch").default;
const server = http.createServer(function (req, res) {
    fetch(`https://api.chucknorris.io/jokes/random`)    // Se non specificato è sempre in GET
        .then(response => response.json())              // Quando ottiengo risposta, converto in JSON
        .then(data => {                                 // Dopo aver converito in JSON, procedo
            // Leggo file norrisDb.json utlizzando codifica UTF-8
            fs.readFile('norrisDb.json', 'utf8', (err, jsonToString) => {
                if (err) {
                    // Se ci sono errori, li riporto in console e mi fermo
                    console.log("Impossibile leggere in file:", err);
                    return;
                }
                // Altrimenti converto il JSON in array (se non esiste lo creo)
                const jokes = JSON.parse(jsonToString || '[]');
                if (!jokes.find(joke => joke === data.value)) {
                    jokes.push(data.value);     // Pusho battuta dentro array
                    // Scrivo su file norrisDb.json utlizzando codifica UTF-8 e riconvertendo battute in json
                    fs.writeFile('norrisDb.json', JSON.stringify(jokes), 'utf8', (err) => {
                        if (err) {
                            // Se ci sono errori, li riporto in console e mi fermo
                            console.log("Impossibile scrivere su file:", err);
                            return;
                        }
                        // Altrimenti loggo messaggio di successo
                        console.log("Salvato!");
                    });
                }
                // Valorizzo battuta a stringa vuota
                let joke = "";
                // Per ogni battuta salvata in array creo un li e metto battuta all'interno
                jokes.forEach(el => {
                    joke += `<li>${el}</li>\n`;
                });
                // Inietto stringa con battute dentro ul, e inietto il tutto in pagina
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(`<ul>${joke}</ul>`);
                res.end();
            });
        })
        .catch(error => {
            console.error(error);
        });
});

server.listen(3000, function () {
    console.log(`Server in ascolto sulla porta ${3000}`);
});