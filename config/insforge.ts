import { createClient } from '@insforge/sdk';

const insforgeUrl = 'https://q7crgduz.us-west.insforge.app';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTIwMTV9.zcfNvjx7mHkRL__jqBssMSHkDKsD_ieG3sdEUFVN4TU';

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: anonKey,
});