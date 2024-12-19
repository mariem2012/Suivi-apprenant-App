import { defineStore } from "pinia";
import axios from "axios";

export const useModuleStore = defineStore("moduleStore", {
  state: () => ({
    modules: [],
    module: {
      name: "",
      duration: "",
      price: "",
    }
  }),

  actions: {
    async loadModuleData() {
      try {
        const response = await axios.get("http://localhost:3000/api/modules");
        this.modules = response.data.modules;
      } catch (error) {
        this.modules = [];
        console.error("Erreur lors du chargement des modules :", error.message);
      }
    },
    async loadModuleById(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/modules/${id}`);
        return response.data.module;
      } catch (error) {
        console.error("Erreur lors du chargement du module :", error.message);
      }
    },


    async addModule(newModule) {
      try {
        const response = await axios.post("http://localhost:3000/api/modules", newModule);
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("L'ajout du module a échoué.");
        }
        await this.loadModuleData();
      } catch (error) {
        console.error("Erreur lors de l'ajout du module :", error.response?.data || error.message);
        throw error;
      }
    },


    async updateModule(id, updatedModule) {
      try {
        const response = await axios.put(`http://localhost:3000/api/modules/${id}`, updatedModule);
        if (response.status !== 200) {
          throw new Error("La mise à jour du module a échoué.");
        }
        await this.loadModuleData();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du module :", error.message);
        throw error;
      }
    },


    async removeModule(id) {
      try {
        await axios.delete(`http://localhost:3000/api/modules/${id}`);
        await this.loadModuleData();
      } catch (error) {
        console.error("Erreur lors de la suppression du module :", error.message);
        throw error;
      }
    }
  },

  persist: true
});
