const { createApp } = Vue;

createApp({
    data() {
        return {
            // Container to hold all inputs from form fields
            form: {
                fullName: '',
                dob: '',
                gender: '',
                totalVisitors: null,
                childVisitors: null,
                accommodation: '',
                cardName: '',
                cardNumber: '',
                cardExpiry: '',
                cardCvv: ''
            },
            // Container to hold error messages for separate form items
            errors: {
                fullName: '',
                dob: '',
                gender: '',
                selectedPlaces: '',
                totalVisitors: '',
                childVisitors: '',
                accommodation: '',
                cardName: '',
                cardNumber: '',
                cardExpiry: '',
                cardCvv: ''
            },
            generalError: '',        // General alert message text
            places: [],              // Array storing data imported from the JSON file
            isLoadingPlaces: false,  // Boolean flag to track dynamic data loading status
            placesError: '',         // Error text when loading fails
            selectedPlaces: [],      // Array storing attractions selected by the user
            accommodationOptions: [  // Predefined drop-down menu items
                "No accommodation needed",
                "Forest View Hotel",
                "Totoro Family Inn",
                "Witch Valley Guesthouse",
                "Luxury Ghibli Resort"
            ],
            showSummary: false       // Control flag to display or hide the itinerary summary
        };
    },
    // Automatically trigger data import after component is mounted
    mounted() {
        this.loadPlaces();
    },
    methods: {
        // Async function with await fetch to import place details from JSON file
        async loadPlaces() {
            this.isLoadingPlaces = true;
            try {
                const response = await fetch('ghibli_park.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data.');
                }
                this.places = await response.json();
                this.isLoadingPlaces = false;
            } catch (error) {
                this.placesError = 'Error loading Ghibli Park details. Please try again later.';
                // Maintain flag as true to display error block when fetch fails
                this.isLoadingPlaces = true; 
            }
        },

        // Logic for checking and altering selection in selectedPlaces array
        togglePlace(place) {
            const index = this.selectedPlaces.findIndex(p => p.id === place.id);
            if (index !== -1) {
                // If it exists in the array, remove it
                this.selectedPlaces.splice(index, 1);
            } else {
                // If it does not exist, push it to the array
                this.selectedPlaces.push(place);
            }
        },

        // Clear all validation errors from the previous attempt
        clearErrors() {
            Object.keys(this.errors).forEach(key => this.errors[key] = '');
            this.generalError = '';
        },

        // Validation function called by generateItinerary to verify mandatory values
        validateForm() {
            let isValid = true;

            // 1. Validate Personal Details
            if (!this.form.fullName.trim()) { this.errors.fullName = 'Full Name is required.'; isValid = false; }
            if (!this.form.dob) { this.errors.dob = 'Date of Birth is required.'; isValid = false; }
            if (!this.form.gender) { this.errors.gender = 'Gender selection is required.'; isValid = false; }

            // 2. Validate Ghibli Park Selection
            if (this.selectedPlaces.length === 0) { this.errors.selectedPlaces = 'Please select at least one Ghibli Park attraction.'; isValid = false; }

            // 3. Validate Visitors Details constraints
            if (this.form.totalVisitors === null || this.form.totalVisitors < 1) { 
                this.errors.totalVisitors = 'Total visitors must be at least 1.'; 
                isValid = false; 
            }
            if (this.form.childVisitors === null || this.form.childVisitors < 0) { 
                this.errors.childVisitors = 'Children field cannot be empty or negative.'; 
                isValid = false; 
            }

            // 4. Validate Accommodation choice
            if (!this.form.accommodation) { this.errors.accommodation = 'Accommodation choice is required.'; isValid = false; }

            // 5. Validate Payment Details
            if (!this.form.cardName.trim()) { this.errors.cardName = 'Cardholder name is required.'; isValid = false; }
            if (!this.form.cardNumber.trim()) { this.errors.cardNumber = 'Card number is required.'; isValid = false; }
            if (!this.form.cardExpiry) { this.errors.cardExpiry = 'Card expiration date is required.'; isValid = false; }
            if (!this.form.cardCvv) { this.errors.cardCvv = 'CVV code is required.'; isValid = false; }

            return isValid;
        },

        // Core workflow function mapped to "Generate Itinerary" click event
        generateItinerary() {
            this.clearErrors();       // 1. Clear previous errors to start fresh
            this.showSummary = false;  // Hide summary section initially

            const isFormValid = this.validateForm(); // 2. Perform field validations

            if (!isFormValid) {
                // 3. Show error block text if mandatory items are pending
                this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.';
            } else {
                // 4. Show summary block if all data elements are provided and clean
                this.showSummary = true;
            }
        }
    }
}).mount('#app');