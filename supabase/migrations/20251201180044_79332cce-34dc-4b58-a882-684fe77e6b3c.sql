-- Create RLS policies for contact_submissions
-- Allow authenticated users to read all contact submissions
CREATE POLICY "Authenticated users can view contact submissions"
ON contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update contact submissions (for marking as handled)
CREATE POLICY "Authenticated users can update contact submissions"
ON contact_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Optional: Allow public inserts (for the contact form)
CREATE POLICY "Anyone can submit contact forms"
ON contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);