import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';
import { fetchArticles } from './lib/api';


test('App displays correct title', async () => {
    const { getByText } = render(App);
    const title = getByText('The New York Times');
    expect(title).toBeTruthy();
});

test('App displays current date', () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const { findByText } = render(App);
    const date = findByText(today);
    expect(date).toBeTruthy();
});


test('API returns the correct API key', async () => {
    const response = await fetch('http://localhost:8000/api/key'); 
    const data = await response.json();
    expect(data.apiKey).toBe('LOZOPnWO4QHFWH335ZCsoPYBwMJCOXZu'); 
  });
  
// Ensure articles are returned in the expected format from the NYT API
test('NYT API returns articles in expected format', async () => {
    const fakeResponse = {
        results: [
            {
                title: 'Test Article Title',
                url: 'http://test-article-url.com',
                multimedia: [{ url: 'http://test-image.com' }],
                abstract: 'Test article abstract',
            },
        ],
    };
   // Stub the fetch function
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    json: async () => fakeResponse,
}));

    const data = await fetchArticles();
    expect(data).toEqual(fakeResponse.results); // Verify the returned data matches
});