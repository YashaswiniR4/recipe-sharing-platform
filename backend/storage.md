# Storage

Create a storage bucket named `recipe-images` in Supabase Storage. You can set it to public for easier image serving, or keep private and use signed URLs.

Example steps:
1. Supabase Console → Storage → New Bucket → `recipe-images`.
2. Set public if you want straightforward public URLs.
3. Use `supabase.storage.from('recipe-images').upload(...)` in the frontend to upload images and `getPublicUrl` to retrieve a public URL.
