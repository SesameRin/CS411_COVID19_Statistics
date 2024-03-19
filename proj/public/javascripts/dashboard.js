let COMMUNICATION = 'http://34.16.138.110:8443/';
let GET_DASHBOARD_API = '/dashboard/userQueryForm';
let CLEAR_USER_API = '/dashboard/clearUserQueryForm';

function setActiveRow(rowNumber) {
    // Get the table element by its ID
    var table = document.getElementById("userQueryTable");
    
    // Get the row to highlight by its row number
    var rowToHighlight = table.rows[rowNumber];
    // console.log(rowToHighlight);
    // Add the "active-row" class to the row
    rowToHighlight.classList.add("active-row");
}

function addTableRow(username, queryTime, queryContent, queryType, queryResult, resultType) {
    // Get the table element by its ID
    var table = document.getElementById("userQueryTable");
    
    // Insert a new row into the tbody section of the table
    var tbody = table.getElementsByTagName('tbody')[0];
    var newRow = tbody.insertRow(-1);
    
    // Insert a cell for each column and set the cell values
    var usernameCell = newRow.insertCell(0);
    usernameCell.innerHTML = username;
    
    var queryTimeCell = newRow.insertCell(1);
    queryTimeCell.innerHTML = queryTime;
    
    var queryContentCell = newRow.insertCell(2);
    queryContentCell.innerHTML = queryContent;
    
    var queryTypeCell = newRow.insertCell(3);
    queryTypeCell.innerHTML = queryType;
    
    var queryResultCell = newRow.insertCell(4);
    queryResultCell.innerHTML = queryResult;

    var resultTypeCell = newRow.insertCell(5);
    resultTypeCell.innerHTML = resultType;
    
    // Add the onmouseover event to the newly created row
    newRow.onmouseover = function() {
      // Get the index of the current row
      var rowIndex = newRow.rowIndex;
      
      // Call the setActiveRow function with the row index
      setActiveRow(rowIndex);
    };

     // Add the onmouseout event to the newly created row
    newRow.onmouseout = function() {
        // Get the index of the current row
        var rowIndex = newRow.rowIndex;
        
        // Get the table element by its ID
        var table = document.getElementById("userQueryTable");
        
        // Get the row to unhighlight by its row number
        var rowToUnhighlight = table.rows[rowIndex];
        
        // Remove the "active-row" class from the row
        rowToUnhighlight.classList.remove("active-row");
    };
}

function removeAllRowsExceptHeader(tableId) {
    // Get the table element by its ID
    var table = document.getElementById(tableId);
  
    // Get the table's tbody element
    var tbody = table.getElementsByTagName("tbody")[0];
    // console.log(tbody.rows.length);
  
    // Remove all the rows from the tbody except for the header row
    while (tbody.rows.length) {
      tbody.deleteRow(-1);
    }
}
  
  
  


document.addEventListener("DOMContentLoaded", () => {
    // Get the token from localStorage
    // Create a new instance of axios
    
    const clearButton = document.getElementById('clearButton');

    // add an event listener to the button
    clearButton.addEventListener('click', function() {
        return new Promise((resolve, reject) => {
            const instance2 = axios.create({ baseURL: COMMUNICATION });
            var token = localStorage.getItem('token');
            var username = localStorage.getItem('username');
            // console.log(token, username);
            var myheader = {headers : {
                'Content-Type': 'application/json',
            }};
            // console.log(token, username);
            if(token && username) {
                myheader = {headers : {
                    'Content-Type': 'application/json',
                    'token': token,
                    'username': username
                    }
                };
            }
            console.log(myheader);
            // any garbage data will do, here I just pass myheader (not used for data)
            instance2.post(CLEAR_USER_API,myheader,myheader).then(response => {
                // delete old rows and add new rows
                removeAllRowsExceptHeader("userQueryTable");
            })
            .catch(error => {
                console.error('Error fetching user query data:', error);
            });
        });
    });

    // Make a POST request to the server to get the data for the selected state
    // my very lousy implementation of token handling
    return new Promise((resolve, reject) => {
        const instance1 = axios.create({ baseURL: COMMUNICATION });
        var token = localStorage.getItem('token');
        var username = localStorage.getItem('username');
        // console.log(token, username);
        var myheader = {headers : {
            'Content-Type': 'application/json',
        }};
        // console.log(token, username);
        if(token && username) {
            myheader = {headers : {
                'Content-Type': 'application/json',
                'token': token,
                'username': username
                }
            };
        }
        instance1.get(GET_DASHBOARD_API, myheader).then(response => {
            var data = response.data.data;
            // delete old rows and add new rows
            removeAllRowsExceptHeader("userQueryTable");
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                addTableRow(data[i].username, data[i].time, data[i].queryContent, data[i].queryType, data[i].queryResult, data[i].resultName);
            }

            resolve(data);
        })
        .catch(error => {
            console.error('Error fetching user query data:', error);
            reject(error);
        });
    });
});


