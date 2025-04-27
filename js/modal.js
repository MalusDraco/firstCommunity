// Database class

// Modal functionality
let modal; // Declare modal at the top level
let long;
let lat;

// Close modal function - moved outside to be accessible everywhere
function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    // Reset form
    const requestForm = document.querySelector('.request-form');
    const fileName = document.querySelector('.file-name');
    if (requestForm) requestForm.reset();
    if (fileName) fileName.textContent = 'No file chosen';
  }
}

function initializeModal() {
  modal = document.getElementById('requestModal');
  const closeBtn = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');
  const fileInput = document.getElementById('requestImage');
  const fileName = document.querySelector('.file-name');
  const requestForm = document.querySelector('.request-form');

  // Show modal when clicking "Submit Request" button
  const submitButton = document.querySelector('.action-card[href="#"]');
  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'block';
      ensureModalMap()
    });
  }
  // 2) address search button
  const searchBtn = document.querySelector('#requestModal .location-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        geocodeModalAddress()
        document.getElementById("map").style.display = "block";
      });
    }
    const locInput = document.getElementById('requestLocation');
  if (locInput) {
    locInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();         // stop form submit
        geocodeModalAddress();
        document.getElementById("map").style.display = "block";
      }
    });
  }

  // Close modal handlers
  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  // Close modal when clicking outside
  window.onclick = (e) => {
    if (e.target == modal) {
      closeModal();
    }
  };

  // Update file name when file is selected
  if (fileInput && fileName) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      fileName.textContent = file ? file.name : 'No file chosen';
    });
  }

  // Handle form submission
  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(requestForm);
      const requestId = generateUniqueId();

      // Format the date as YYYY/MM/DD
      const dateInput = formData.get('date');
      let formattedDate = dateInput
        ? new Date(dateInput)
            .toISOString()
        : '';


      const requestData = {
        title: formData.get('title'),
        date: formattedDate,
        description: formData.get('description'),
        organization: formData.get('organization'),
        address: formData.get('location'),
        longtitude: long,
        latitude: lat,
        hours: formData.get('hours'),
        status: 'pending',
        submissionDate: new Date().toISOString(),
      };
      console.log(requestData)

      // Handle image file
      const imageFile = fileInput.files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          requestData.image = e.target.result;
          saveAndCreateRequest(requestData);
        };
        reader.readAsDataURL(imageFile);
      } else {
        saveAndCreateRequest(requestData);
      }
    });
  }
}

function saveAndCreateRequest(requestData) {
  // Save request data to localStorage
  localStorage.setItem(
    `request_${requestData.id}`,
    JSON.stringify(requestData)
  );


  // Send Post Request for MongoDB
  fetch('http://localhost:3000/newCommunityEvent', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData)
  })

  // Create new request card
  const newRequestCard = createRequestCard(requestData);

  // Add to My Requests section
  const myRequestsSection = document.querySelector('.request-cards');
  myRequestsSection.insertBefore(newRequestCard, myRequestsSection.firstChild);

  // Close modal and reset form
  closeModal();
}

// Function to create a new request card
function createRequestCard(data) {
  const card = document.createElement('div');
  card.className = 'request-card';
  card.setAttribute('data-request-id', data.id);

  // Format the submission date from ISO string to MM-DD-YYYY
  const submissionDate = new Date(data.submissionDate).toLocaleDateString(
    'en-US',
    {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }
  );

  const formattedDate = new Date(data.date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/-/g, '/');

  card.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="request-meta">
            <span><i class="fas fa-calendar"></i>Event Date: ${formattedDate}</span>
            <span><i class="fas fa-clock"></i>Submitted: ${submissionDate}</span>
            <span><i class="fas fa-building"></i>${data.organization}</span>
            <span><i class="fas fa-map-marker-alt"></i>${data.location}</span>
            <span><i class="fas fa-clock"></i>${data.hours}</span>
        </div>
        <div class="request-status ${data.status}">
            <i class="fas fa-${getStatusIcon(data.status)}"></i>
            ${capitalizeFirstLetter(data.status)}
        </div>
    `;

  // Add click event to view request details
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `request-details.html?id=${data.id}`;
  });

  return card;
}

// Helper function to generate unique ID
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to get status icon
function getStatusIcon(status) {
  switch (status) {
    case 'approved':
      return 'check-circle';
    case 'emergency':
      return 'exclamation-circle';
    default:
      return 'clock';
  }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load modal component and initialize functionality
fetch('components/request-modal.html')
  .then((response) => response.text())
  .then((html) => {
    document.getElementById('modalContainer').innerHTML = html;
    // Initialize modal functionality after the component is loaded
    initializeModal();
  })
  .catch((error) => {
    console.error('Error loading modal component:', error);
  });


  /* ----------  modal-map helpers  ---------- */
let modalMap     = null;   // google.maps.Map instance
let modalMarker  = null;   // current pin
let modalCoder   = null;   // Geocoder
let modalAuto    = null;   // Autocomplete

function ensureModalMap() {
  // build the map the *first* time the modal is shown
  if (modalMap) return;                 // already created

  const mapBox = document.querySelector('#requestModal #map');
  const start  = { lat: 37.5246, lng: -120.8557 };   // default centre

  modalMap  = new google.maps.Map(mapBox, {
    center: start,
    zoom: 13,
  });

  modalCoder = new google.maps.Geocoder();

  // attach Places Autocomplete to the location input
  const locationInput = document.getElementById('requestLocation');
  modalAuto = new google.maps.places.Autocomplete(locationInput);
  modalAuto.bindTo('bounds', modalMap);
}

function geocodeModalAddress() {
  const address = document.getElementById('requestLocation').value.trim();
  if (!address) return;

  modalCoder.geocode({ address }, (results, status) => {
    if (status !== 'OK') {
      alert('Address lookup failed: ' + status);
      return;
    }

    const loc = results[0].geometry.location;

    lat = loc.lat()
    long = loc.lng()

    modalMap.setCenter(loc);
    modalMap.setZoom(15);

    if (modalMarker) modalMarker.setMap(null);        // replace old pin
    modalMarker = new google.maps.Marker({
      map: modalMap,
      position: loc,
    });
  });
}
/* ----------  end helpers  ---------- */