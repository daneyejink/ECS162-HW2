import { test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';

test('App displays correct title', async () => {
    const { getByText } = render(App);
    const title = getByText('The New York Times');
    if (!title) {
        throw new Error('Title "The New York Times" not found!');
    }
});

test('API returns the correct API key', async () => {
    const response = await fetch('/api/key'); 
    const data = await response.json();
    expect(data.apiKey).toBe('LOZOPnWO4QHFWH335ZCsoPYBwMJCOXZu'); 
  });
  