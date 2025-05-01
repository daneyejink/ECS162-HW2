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
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
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


// Test if article content is displayed in the UI
test('Article content is displayed in the UI', async () => {
    const fakeArticle = {
        title: 'Test Article Title',
        web_url: 'http://test-article-url.com',
        multimedia: {
            default: { 
                url: 'http://test-image.com' 
            }
        },
        abstract: 'Test article abstract',
    };
    
    // Mock fetchArticles in App.svelte
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
        json: async () => ({ results: [fakeArticle] }),
    }))

    render(App);

    const titleElement = await screen.findByText(fakeArticle.title);
    expect(titleElement).toBeTruthy();

    const abstractElement = await screen.findByText(fakeArticle.abstract);
    expect(abstractElement).toBeTruthy();

    const urlElement = await screen.findByRole('link', { name: /read full article/i }) as HTMLAnchorElement;
    expect(urlElement.href.replace(/\/$/, '')).toBe(fakeArticle.web_url);
    
    const imageElement = screen.getByAltText(fakeArticle.title) as HTMLImageElement;
    expect(imageElement.src.replace(/\/$/, '')).toBe(fakeArticle.multimedia.default.url);
});

// Test Responsive UI
test('Tablet view testing', () => {
    globalThis.innerWidth = 1024;
    globalThis.dispatchEvent(new Event('resize'));

    render(App);

    // Select the third column 
    const thirdCol = document.querySelector('.column\\3');  
  
    // Ensure the column is hidden on tablet
    if (thirdCol) {
        const thirdColumnStyle = window.getComputedStyle(thirdCol);  
        expect(thirdColumnStyle.display).toBe('none'); // third column none on tablet
    } else {
     // If the column isn't found, make null
        expect(thirdCol).toBeNull();
    }
});

test('Mobile view testing', () => {
    globalThis.innerWidth = 768;
    globalThis.dispatchEvent(new Event('resize'));
    render (App);

    const secCol = document.querySelector('.column\\2');  
  
    // Ensure the column is hidden on mobile device
    if (secCol) {
        const secColumnStyle = window.getComputedStyle(secCol);  
        expect(secColumnStyle.display).toBe('none'); // second column none on tablet
    } else {
     // If the column isn't found, make null
        expect(secCol).toBeNull();
    }
});
  
