// Function to fetch data from Supabase
async function fetchData() {
    const response = await fetch('http://localhost:8000/api/get_data');
    const data = await response.json();
    return data;
  }