import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
import { reactive } from "vue";
const toast = useToast();

export const usePaymentStore = defineStore("paymentStore", {
  state: () => ({
    payments: [],
    paymentForm: reactive({
      payment_date: null,
      amount: null,
      payer: null,
      payer_number: null,
      payment_mode: null,
      registrationId: null,
    }),
    registrations: [],
    students: []
  }),

  actions: {
    async reset() {
      this.paymentForm.payment_date = null,
      this.paymentForm.amount = null,
      this.paymentForm.payer = null,
      this.paymentForm.payer_number = null,
      this.paymentForm.payment_mode = null,
      this.paymentForm.registrationId = null
    },
    async loadDataFromApi() {
      try {
        const response = await axios.get("http://localhost:3000/api/payments");
        this.payments = response.data.payments;
      } catch (error) {
        this.payments = [];
        toast.error("Erreur de connexion");
      }
    },

    async getPaymentById(id) {
      let response = "";
      try {
        response = await axios.get(`http://localhost:3000/api/payments/${id}`);
        return response.data.payment;
      } catch (error) {
        const message = error.response.data.errors;
        throw message;
      }
    },

    async getStudents() {
      let response = "";
      try {
        response = await axios.get(`http://localhost:3000/api/students`);
        this.students = response.data.students;
      } catch (error) {
        const message = error.response.data.errors;
        throw message;
      }
    },

    async getStudentRegistrations(id) {
      let response = "";
      try {
        response = await axios.get(`http://localhost:3000/api/payments-students/${id}`);
        this.registrations = response.data.registrations;
      } catch (error) {
        const message = error.response.data.errors;
        throw message;
      }
    },

    async getAmount(id) {
      let response = "";
      try {
        response = await axios.get(`http://localhost:3000/api/payments-registrations/${id}`);
        this.paymentForm.amount = response.data.amount;        
      } catch (error) {
        const message = error.response.data.errors;
        throw message;
      }
    },

    async create() {
      let response = "";
      this.paymentForm.amount = parseFloat(this.paymentForm.amount)
      try {
        response = await axios.post(
          "http://localhost:3000/api/payments",
          this.paymentForm
        );
        await this.reset()
        await this.loadDataFromApi();
        return response.data.message;
      } catch (error) {
        const message = error.response.data.errors;
        throw message;
      }
    },

    async update(id, payment) {
      let response = "";
      try {
        response = await axios.put(
          `http://localhost:3000/api/payments/${id}`,
          payment
        );
        await this.loadDataFromApi();
        return response.data.message;
      } catch (error) {
        const message = error.response.data.errors;
        throw message;
      }
    },

    async destroy(id) {
      let response = "";
      try {
        response = await axios.delete(
          `http://localhost:3000/api/payments/${id}`
        );
        await this.loadDataFromApi();
        return response.data.message;
      } catch (error) {
        const message = error.response.data.error;
        throw message;
      }
    },
  },
  persist: true,
});
