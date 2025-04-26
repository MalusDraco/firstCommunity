// Modal functionality
let modal; // Declare modal at the top level

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
      const requestData = {
        id: requestId,
        title: formData.get('title'),
        description: formData.get('description'),
        organization: formData.get('organization'),
        location: formData.get('location'),
        hours: formData.get('hours'),
        status: 'pending',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      };

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

  // Determine request type based on title/keywords
  const requestType = determineRequestType(data.title);

  card.innerHTML = `
        <span class="request-type ${requestType}">${requestType}</span>
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="request-meta">
            <span><i class="fas fa-calendar"></i>Requested for ${
              data.date
            }</span>
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
  card.style.cursor = 'pointer'; // Make it clear it's clickable
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
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to determine request type
function determineRequestType(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('emergency') || titleLower.includes('urgent')) {
    return 'emergency';
  } else if (
    titleLower.includes('training') ||
    titleLower.includes('workshop')
  ) {
    return 'training';
  } else {
    return 'safety';
  }
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
