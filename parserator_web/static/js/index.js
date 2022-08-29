/* TODO: Flesh this out to connect the form to the API and render results
   in the #address-results div. */

let submit_button = document.getElementById("submit");

// add on click
console.log("adding on click method");
submit_button.addEventListener("click", () => {
   console.log("Parsing address");

   // grab input data
   let input_address = document.getElementById("address").value;
   console.log(input_address);
   let params = {"address": input_address};
   let url = "http://localhost:8000/api/parse/?" + new URLSearchParams(params).toString();
   console.log(url);

   // call api
   let request = fetch(url);
   request.then((response) => {
      if (response['status'] == 200) {
         response.json()
         .then(data => {
            console.log(data);
            let addr_results_div = document.getElementById("address-results");
            
            // Show hidden html element
            addr_results_div.style.display = 'block';

            let addr_type_strong = document.getElementById("parse-type");
            var comp_table_body = addr_results_div.children[2].children[1]

            // Remove old text
            if (addr_type_strong.textContent != "") { 
               addr_type_strong.textContent = "";
            }

            // Remove old elements if exist
            while (comp_table_body.firstChild) {
               comp_table_body.removeChild(comp_table_body.firstChild);
            }

            // Append new elements to html
            let addr_type_text = document.createTextNode(data["address_type"]);
            addr_type_strong.appendChild(addr_type_text);

            for (const [key, value] of Object.entries(data["address_components"])) {
               let tr = document.createElement("tr");
               let td1 = document.createElement("td");
               let td2 = document.createElement("td");
               let addr_comp_type = document.createTextNode(key);
               let addr_comp_text = document.createTextNode(value);
               td1.appendChild(addr_comp_type);
               td2.appendChild(addr_comp_text);
               tr.appendChild(td1);
               tr.appendChild(td2);

               comp_table_body.appendChild(tr);
            }
         })
      } else {
         let addr_results_div = document.getElementById("address-results");
         addr_results_div.style.display = 'block';

         // Remove old elements if exist
         while (addr_results_div.firstChild) {
            addr_results_div.removeChild(addr_results_div.firstChild);
         }

         // Display error message
         let h3 = document.createElement("h3");
         let h3_text = document.createTextNode("Invalid address. Please try again with a valid address.");
         h3.appendChild(h3_text);
         addr_results_div.appendChild(h3);
         
         console.log("API error", response["status"]);
      }
})});