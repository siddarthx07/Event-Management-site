<template>
  <div class="dashboard">
    <h2 class="welcome-message">Welcome, {{ username }}!</h2>
    <p class="instructions">Select an option to get started:</p>

    <div class="cards-container">
      <!-- Left Card: View Events -->
      <button class="card" @click="viewEvents">
        <div class="card-content">
          <i class="fas fa-eye card-icon"></i>
          <p class="card-title">View Events</p>
        </div>
      </button>

      <!-- Right Card: Organize Events -->
      <button class="card" @click="becomeOrganizer">
        <div class="card-content">
          <i class="fas fa-edit card-icon"></i>
          <p class="card-title">Organize Events</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"), // Get the role from localStorage
    };
  },
  methods: {
    viewEvents() {
      this.$router.push("/");
    },
    becomeOrganizer() {
      axios
        .put(
          "http://localhost:3000/api/users/role/organizer",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          localStorage.setItem("role", response.data.role);
          this.role = response.data.role;
          this.$router.push("/organize");
        })
        .catch((error) => {
          console.error("Error updating role:", error);
          alert("Failed to become an organizer.");
        });
    },
  },
};
</script>

<style scoped>
/* Dashboard Container */
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #e8f1ff, #f5e8ff); /* Soft gradient background */
  padding: 20px;
  text-align: center;
}

/* Welcome Message */
.welcome-message {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 10px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Subtle text shadow */
}

.instructions {
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 30px;
}

/* Cards Container: Divides the page into two halves */
.cards-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 800px;
  gap: 2rem; /* Space between cards */
}

/* Card Styling */
.card {
  background: #ffffff;
  flex: 1; /* Equal width for both cards */
  max-width: 300px; /* Medium size card */
  height: 300px; /* Medium height */
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Soft shadow */
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  border: none;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
  background-color: #f8f8ff;
}

.card-content {
  text-align: center;
}

.card-icon {
  font-size: 4rem;
  color: #6c63ff; /* Icon color */
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

/* Add Hover Glow Effect */
.card:hover .card-icon {
  color: #574b90;
  filter: drop-shadow(0 0 10px #6c63ff);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .card {
    max-width: 100%;
    height: 250px;
  }

  .card-icon {
    font-size: 3.5rem;
  }

  .card-title {
    font-size: 1.25rem;
  }
}
</style>
