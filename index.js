//JS code for searching National Parks by state\
"use strict";
let stateCounter = 1;
const stateCode = [];
const baseURL =  "https://developer.nps.gov/api/v1/parks"
const api_key = "ZW1Kwvd9LoNKpDjaknmD1vJ5FaRW0HdsZaOyamFB"

//display results function to update the HTML and display the results
function displayResults(response){
    $('#js-loading').empty();
    $('.loader').addClass('hidden');
    $('.input').html(`<input type="text" maxlength="2" name="state" id="js-state1">
    <label for="state">State</label>`)
    $('#js-results-list').empty();
    $('#js-results').removeClass('hidden');
    for(let i=0;i<response.data.length;i++){
        console.log('loop ran')
        $('#js-results-list').append(`<li><h3>${response.data[i].fullName}</h3>
        <p>States: ${response.data[i].states}</p>
        <p>${response.data[i].description}</p>
        <a href="${response.data[i].url}" target="_blank">${response.data[i].url}</a>
        <p>Mailing Address</p>
        <p class="close">${response.data[i].addresses[0].line1}</p>
        <p class="close">${response.data[i].addresses[0].city}, ${response.data[i].addresses[0].stateCode} ${response.data[i].addresses[0].postalCode}</p>
        </li>`)
    }
    console.log(response);
}

//build query function to build the request URL from the form inputs
function buildQuery(stateCode){
    let string = 'stateCode=';
    for(let i=0;i<stateCounter;i++){
        string= string + stateCode[i] + ","
    }
    string = string + '&limit=' + $('#js-max-results').val()
    string = string + '&api_key=' + api_key;
    console.log(string);
    return string;
}

//get parks function to send GET request to the NPS API
function getParks(){
    for(let i=0;i<stateCounter;i++){
        stateCode[i]=$(`#js-state${i+1}`).val()
        console.log(stateCode);
    }
    const queryString = buildQuery(stateCode);
    const request = baseURL + "?" + queryString;
    fetch(request)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('Something went wrong.')
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        //display error text
    })

}

//add input function to add another state input when the Add State button is pressed
function addNewState(){
    stateCounter ++;
    $('.input').append(`<input type="text" maxlength="2" name="state${stateCounter}" id="js-state${stateCounter}">
    <label for="state${stateCounter}">State</label>`);
}

//watch form function to watch for each button being pressed
function watchForm(){
    $('#js-add-state').click(event => {
        event.preventDefault();
        addNewState();
    })
    $('#js-submit').click(event => {
        event.preventDefault();
        $('#js-loading').html('Searching for results...')
        getParks();
    })
}

$(watchForm);