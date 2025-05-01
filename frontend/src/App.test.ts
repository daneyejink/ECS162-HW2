import { test } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';

test('App displays correct title', async () => {
    const { getByText } = render(App);
    const title = getByText('The New York Times');
    if (!title) {
        throw new Error('Title "The New York Times" not found!');
    }
});
