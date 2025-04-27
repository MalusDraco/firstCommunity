// Code to receive data from MongoDB
const res = await fetch("http://localhost:3000/communityEvents", {
  method: "GET",
});
const arr = await res.json();

let card_div = document.querySelector(".request-cards");
let finalHTML = card_div.innerHTML;
// console.log(finalHTML);
// console.log(arr);

function createCards() {
  // Code that iterates through each object to create a new event card
  arr.forEach((event) => {
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

    finalHTML += `<article class="request-card">
              <h3>${event.title}</h3>
              <p>
                ${event.description}
              </p>
              <div class="request-meta">
                <span><i class="fas fa-calendar"></i>${formattedDate}</span>
                <span><i class="fas fa-user"></i> Posted by ${event.organization}</span>
              </div>
              <div class="request-actions">
                <button class="accept-btn">Accept Request</button>
                <button class="details-btn">View Details</button>
              </div>
            </article>`;
  });
  console.log(finalHTML);
  card_div.innerHTML = finalHTML;
}
createCards();
