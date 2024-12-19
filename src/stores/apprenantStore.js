import { defineStore } from "pinia";
import axios from "axios";

export const useApprenantStore = defineStore("apprenantStore", {
  state: () => ({
    apprenants: [],
    apprenant: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      status: "",
      tutor: "",
    },
  }),

  actions: {
    async loadApprenantData() {
      try {
        const response = await axios.get("http://localhost:3000/api/students");
        this.apprenants = response.data.students;
      } catch (error) {
        this.apprenants = [];
        console.error(
          "Erreur lors du chargement des apprenants :",
          error.message
        );
      }
    },

    async loadApprenantById(id) {
      try {
        // console.log("ID a charger:", id);
        const response = await axios.get(
          `http://localhost:3000/api/students/${id}`
        );
        return response.data.student;
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'utilisateur :",
          error.message
        );
      }
    },

    async addApprenant(newApprenant) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/students",
          newApprenant
        );
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("L'ajout a échoué.");
        }
        await this.loadApprenantData();
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout de l'utilisateur :",
          error.response?.data || error.message
        );
        throw error;
      }
    },

    async updateApprenant(id, updatedApprenant) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/students/${id}`,
          updatedApprenant
        );

        if (response.status !== 200) {
          throw new Error("La mise à jour a échoué.");
        }

        await this.loadApprenantById();
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'utilisateur :",
          error.message
        );
        throw error;
      }
    },

    async removeApprenant(id) {
      try {
        await axios.delete(`http://localhost:3000/api/students/${id}`);
        await this.loadApprenantData();
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'utilisateur :",
          error.message
        );
        throw error;
      }
    },

    async toggleStatut(id) {
      let response = "";
      try {
        const element = this.apprenants.find((e) => e.id === id);
        response = await axios.put(
          `http://localhost:3000/api/students/status/${id}`,
          {
            status: !element.status,
          }
        );
        await this.loadApprenantData();
        return response.data.message;
      } catch (error) {
        const message = error.response.data.message;
        throw message;
      }
    },
  },

  persist: true,
});
