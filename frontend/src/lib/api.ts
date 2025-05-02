export async function fetchArticles() {
    const res = await fetch('/api/articles');
    const data = await res.json();
    return data.results;
  }

// lib/api.ts

export async function fetchApiKey(apiEndpoint: string) {
  const response = await fetch(apiEndpoint);
  const data = await response.json();
  return data; // Assuming the response includes { apiKey: '...' }
}

  
 // Function to fetch articles with the API key (simplified)
/*export async function fetchArticles() {
  try {
    const res = await fetch('/api/articles');
    const data = await res.json();
    return data.results;  // Return articles directly
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];  // Return an empty array in case of error
  }
}

// Function to fetch API key from the backend
export async function fetchApiKey(): Promise<string> {
  try {
    const res = await fetch('/api/key');
    const data = await res.json();
    return data.apiKey;  // Return the API key
  } catch (error) {
    console.error('Failed to fetch API key:', error);
    throw new Error('Unable to fetch API key');
  }
}*/


