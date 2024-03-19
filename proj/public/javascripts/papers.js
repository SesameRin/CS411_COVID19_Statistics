let COMMUNICATION = 'http://34.16.138.110:8443/';

let paperAPI = '/papers/papersearch'
let paperAPI1 = 'papers/papersearch1'
let paperAPI2 = 'papers/paperrank'
const form = document.getElementById('paper-form');
const titleInput = document.getElementById('title-input');
const authorInput = document.getElementById('author-input');
const journalInput = document.getElementById('journal-input');

const paperData = document.getElementById('paper-data'); // search results


form.addEventListener('submit', event => {
  event.preventDefault(); // prevent from page reloading
  const title = titleInput.value;
  const author = authorInput.value;
  const journal = journalInput.value;

  // Create a new instance of axios
  const instance = axios.create({ baseURL: COMMUNICATION });

  // Make a POST request to the server to get the data for the selected state
  // my very lousy implementation of token handling
  return new Promise((resolve, reject) => {
    var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');
    // console.log(token, username);
    var myheader = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    // console.log(token, username);
    if (token && username) {
      myheader = {
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'username': username
        }
      };
    }
    console.log(myheader);

    instance.post(paperAPI, { titleName: title, authorName: author, journalName: journal }, myheader)
      .then(response1 => {
        var data1 = response1.data; // paper count

        // Display the data for the selected state
        paperData.innerHTML = `
      <p>Satisfied Paper Count: ${data1.papercnt}</p>
    `;

        // Execute the second request
        return instance.post(paperAPI1, { titleName: title, authorName: author, journalName: journal }, myheader);
      })
      .then(response2 => {
        var data2 = response2.data; // paper title, authors, journals

        const table = document.getElementById('PaperSearchTable');
        const tbody = table.getElementsByTagName('tbody')[0];

        // Clear the table
        tbody.innerHTML = '';

        data2.forEach(item => {
          const row = tbody.insertRow();

          const titleCell = row.insertCell();
          titleCell.textContent = item.papertitle;

          const authorCell = row.insertCell();
          authorCell.textContent = item.paperauthor;

          const journalCell = row.insertCell();
          journalCell.textContent = item.paperjournal;

          const publish_timeCell = row.insertCell();
          publish_timeCell.textContent = item.papertime;

          const searchtimesCell = row.insertCell();
          searchtimesCell.textContent = item.searchtimes;
        });

        // Execute the third request
        return instance.post(paperAPI2, {}, myheader);
      })
      .then(response3 => {
        var data3 = response3.data; // paper title, authors, journals

        const table = document.getElementById('PaperRankTable');
        const tbody = table.getElementsByTagName('tbody')[0];

        // Clear the table
        tbody.innerHTML = '';

        data3.forEach(item => {
          const row = tbody.insertRow();

          const rankCell = row.insertCell();
          rankCell.textContent = item.paperrank;

          const titleCell = row.insertCell();
          titleCell.textContent = item.papertitle;

          const searchtimesCell = row.insertCell();
          searchtimesCell.textContent = item.searchtimes;
        });
      })


      .catch(error => {
        console.error('Error fetching paper data:', error);
        reject(error);
      });

  });


  // paperData.innerHTML = `<p>title request: ${title}</p>
  //                       <p>author request: ${author}</p>
  //                       <p>journal request: ${journal}</p>`;
})
