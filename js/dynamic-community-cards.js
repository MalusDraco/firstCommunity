// Code to receive data from MongoDB
const res = await fetch("http://localhost:3000/communityEvents", {
  method: "GET",
});
const arr = await res.json();

function getStatusIcon(status) {
  switch (status) {
    case "approved":
      return "check-circle";
    case "emergency":
      return "exclamation-circle";
    default:
      return "clock";
  }
}

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let card_div = document.querySelector(".request-cards");
let finalHTML = card_div.innerHTML;

function createCards() {
  // Code that iterates through each object to create a new event card
  arr.forEach((event) => {
    console.log(event);
    const submissionDate = new Date(event.submissionDate).toLocaleDateString(
      "en-US",
      {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }
    );

    const formattedDate = new Date(event.date)
      .toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/-/g, "/");

    finalHTML += `
    <div class="request-card">
    <h3>${event.title}</h3>
    <p>${event.description}</p>
    <div class="request-meta">
        <span><i class="fas fa-calendar"></i>Event Date: ${formattedDate}</span>
        <span><i class="fas fa-clock"></i>Submitted: ${submissionDate}</span>
        <span><i class="fas fa-building"></i>${event.organization}</span>
        <span><i class="fas fa-map-marker-alt"></i>${
          event.location[0].address
        }</span>
        <span><i class="fas fa-clock"></i>${event.time}</span>
    
    </div>
     <div class="request-status ${event.status}">
        <i class="fas fa-${getStatusIcon(event.status)}"></i>
        ${capitalizeFirstLetter(event.status)} Response
     </div>
     </div>
     `;
  });
  // console.log(finalHTML);
  card_div.innerHTML = finalHTML;
}
createCards();
