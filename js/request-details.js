// Get request ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get('id');

// Function to load request details
function loadRequestDetails() {
  if (!requestId) {
    handleRequestNotFound();
    return;
  }

  try {
    // Get request data from localStorage
    const requestData = JSON.parse(
      localStorage.getItem(`request_${requestId}`)
    );

    if (!requestData) {
      handleRequestNotFound();
      return;
    }

    // Update page elements with request data
    document.getElementById('requestTitle').textContent =
      requestData.title || 'Untitled Request';
    document.getElementById('organizationName').textContent =
      requestData.organization || 'No Organization';
    document.getElementById('requestDescription').textContent =
      requestData.description || 'No description provided';
    document.getElementById('requestLocation').textContent =
      requestData.location || 'Location not specified';

    // Update status badge
    const statusBadge = document.getElementById('requestStatus');
    const status = requestData.status || 'pending';
    statusBadge.className = `status-badge status-${status}`;
    statusBadge.innerHTML = `
            <i class="fas fa-${getStatusIcon(status)}"></i>
            ${capitalizeFirstLetter(status)}
        `;

    // Set image if available
    const requestImage = document.getElementById('requestImage');
    if (requestData.image) {
      requestImage.src = requestData.image;
      requestImage.alt = `Image for ${requestData.title}`;
    } else {
      requestImage.src = 'assets/placeholder-image.jpg';
      requestImage.alt = 'No image available';
    }

    // Initialize map
    initializeMap(requestData.location);
  } catch (error) {
    console.error('Error loading request details:', error);
    handleRequestNotFound();
  }
}

// Function to handle request not found
function handleRequestNotFound() {
  document.querySelector('.request-details-container').innerHTML = `
        <a href="community.html" class="back-button">
            <i class="fas fa-arrow-left"></i>
            Back to Dashboard
        </a>
        <div class="info-section" style="text-align: center; padding: 2rem;">
            <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ff4444; margin-bottom: 1rem;"></i>
            <h1>Request Not Found</h1>
            <p>The requested item could not be found. It may have been deleted or the link might be incorrect.</p>
        </div>
    `;
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

// Placeholder function for map initialization
function initializeMap(location) {
  const mapElement = document.getElementById('locationMap');
  mapElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%; background-color: #f0f0f0;">
            <p>Map showing: ${location || 'Location not specified'}</p>
        </div>
    `;
}

// Load request details when page loads
document.addEventListener('DOMContentLoaded', loadRequestDetails);
