import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';
import { fetchArticles } from './lib/api';


test('App displays correct title', async () => {
    const { getByText } = render(App);
    const title = getByText('The New York Times');
    expect(title).toBeTruthy();
});

test('App displays current date', async () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const { findByText } = render(App);
    const date = await findByText(today);
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


// Test if article content is displayed in the UI
test('Article content is displayed in the UI', async () => {
    const fakeArticle = {
        title: 'Test Article Title',
        url: 'http://test-article-url.com',
        multimedia: [{ url: 'http://test-image.com' }],
        abstract: 'Test article abstract',
    };
    
    // Mock fetchArticles in App.svelte
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
        json: async () => ({ results: [fakeArticle] }),
    }));

    const { getByText, getByAltText, getByRole } = render(App);

    const titleElement = await screen.findByText(fakeArticle.title);
    console.log('Title Element:', titleElement); // Debug log
    expect(titleElement).toBeTruthy();

    // Wait for the abstract to appear
    const abstractElement = await screen.findByText(fakeArticle.abstract);
    console.log('Abstract Element:', abstractElement); // Debug log
    expect(abstractElement).toBeTruthy();

    // Wait for the image to appear
    const imageElement = await screen.findByAltText(fakeArticle.title);
    console.log('Image Element:', imageElement); // Debug log
    expect(imageElement).toHaveAttribute('src', fakeArticle.multimedia[0].url);

    // Wait for the link to appear
    const linkElement = await screen.findByRole('link', { name: /read more/i });
    console.log('Link Element:', linkElement); // Debug log
    expect(linkElement).toHaveAttribute('href', fakeArticle.url);
});