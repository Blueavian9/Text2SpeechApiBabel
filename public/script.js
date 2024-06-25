$(document).ready(function() {

  function populateNameDropdown() {
     let $nameDropdown = $('#nameDropdown');
     data.forEach((item) => {
         $nameDropdown.append(
             $('<option></option>')
             .val(item.name)
             .text(item.name)
         )
     });
  }
 
 
  function updateLanguageDropdown(selectedName) { 
     let $languageDropdown = $('#languageDropdown');
     $languageDropdown.empty();
     let selectedItem = data.find(item => { return item.name === selectedName });
     if (selectedItem) {
         $languageDropdown.append(
             $('<option></option>')
             .val(selectedItem.language_id)
             .text(selectedItem.language_id)
         );
     }
  }
  
 
  populateNameDropdown();
 
  updateLanguageDropdown($('#nameDropdown').val());
 
 
  $('#nameDropdown').change(function() {
     let selectedName = $(this).val();
     updateLanguageDropdown(selectedName);
  });
 
 });

 const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("nameDropdown");
const submitButton = document.getElementById("submitButton");
const audioContainer = document.getElementsByClassName("audio-container");


submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const data = {
    voice: voiceSelect.value, 
    text: textInput.value,
  };
  
  axios.post("http://localhost:3333/api/synthesize", data)
    .then(response => {
      const audioUrl = response.data.audioUrl;
      const audioElement = document.createElement("audio");
      
      audioElement.src = audioUrl;
      audioElement.controls = true;
      audioContainer[0].appendChild(audioElement);
    })
    .catch(error => {
      console.error("There was an error synthesizing the speech!", error);
    });
});