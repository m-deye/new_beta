class CustomerService {
    getCustomersLarge() {
        return Promise.resolve([
            { id: 1, name: "Entreprise A", secteur: "Informatique", ville: "Paris" },
            { id: 2, name: "Entreprise B", secteur: "Finance", ville: "Londres" },
            { id: 3, name: "Entreprise C", secteur: "Santé", ville: "New York" },
        ]);
    }
}

export default new CustomerService();
