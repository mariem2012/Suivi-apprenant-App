import { defineStore } from "pinia";
import axios from "axios";

export const useRegistrationStore = defineStore("inscriptionStore", {
  state: () => ({
    inscriptions: [],
    inscription: {
      registration_date: "",
      start_date: "",
      end_date: "",
      amount: 0,
      studentId: null,
      moduleId: null,
    },
  }),

  actions: {
    async loadRegistrations() {
      try {
        const response = await axios.get("http://localhost:3000/api/registrations");
          this.inscriptions = response.data.registrations;
          
      } catch (error) {
        this.inscriptions = [];
        console.error("Erreur lors du chargement des inscriptions :", error.message);
      }
    },

    async loadRegistrationById(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/registrations/${id}`);
        return response.data.registration;
      } catch (error) {
        console.error("Erreur lors du chargement de l'inscription :", error.message);
      }
    },

    async addInscription(newInscription) {
      try {
        const response = await axios.post("http://localhost:3000/api/registrations", newInscription);
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("L'ajout de l'inscription a échoué.");
        }
        await this.loadRegistrations();
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'inscription :", error.response?.data || error.message);
        throw error;
      }
    },

    async updateRegistration(id, updatedInscription) {
      try {
        const response = await axios.put(`http://localhost:3000/api/registrations/${id}`, updatedInscription);
        if (response.status !== 200) {
          throw new Error("La mise à jour de l'inscription a échoué.");
        }
        await this.loadRegistrations();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'inscription :", error.message);
        throw error;
      }
    },

    async removeRegistration(id) {
      try {
        await axios.delete(`http://localhost:3000/api/registrations/${id}`);
        await this.loadRegistrations();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'inscription :", error.message);
        throw error;
      }
    },
  },

  persist: true,
});
