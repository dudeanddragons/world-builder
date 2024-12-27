// Define the ViewState class
export class ViewState {
    constructor() {
      this.state = {
        activeTab: "main", // Default tab
      };
    }
  
    /**
     * Set the active tab
     * @param {string} tab - The name of the tab to set as active
     */
    setActiveTab(tab) {
      this.state.activeTab = tab;
      console.log(`ViewState | Active tab set to: ${tab}`);
    }
  
    /**
     * Get the current active tab
     * @returns {string} - The currently active tab
     */
    getActiveTab() {
      return this.state.activeTab;
    }
  
    /**
     * Reset the view state to default values
     */
    resetState() {
      this.state = {
        activeTab: "main",
      };
      console.log("ViewState | State reset to defaults.");
    }
  }
  
  // Export an instance of ViewState to be used across the application
  export const viewState = new ViewState();
  